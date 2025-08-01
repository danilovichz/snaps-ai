export interface ComfyUIConfig {
  baseUrl: string; // e.g., 'http://localhost:8188'
  timeout?: number;
  provider?: 'local' | 'replicate' | 'runpod' | 'modal';
  apiKey?: string; // For cloud providers
}

export interface FitDiTWorkflowParams {
  human_image_url: string;
  garment_image_url: string;
  garment_type: 'upper_body' | 'lower_body' | 'dresses';
  n_steps?: number;
  image_scale?: number;
  seed?: number;
  resolution?: '1024x1024' | '1536x2048';
  offset_top?: number;
  offset_bottom?: number;
  offset_left?: number;
  offset_right?: number;
}

export interface ComfyUIResponse {
  prompt_id: string;
  number: number;
  node_errors: Record<string, any>;
}

export interface ComfyUIStatus {
  status: 'pending' | 'running' | 'success' | 'error';
  prompt_id: string;
  queue_remaining?: number;
  current?: number;
  outputs?: Record<string, any>;
  error?: string;
}

export class ComfyUIClient {
  private config: ComfyUIConfig;
  
  constructor(config: ComfyUIConfig) {
    this.config = {
      timeout: 30000,
      provider: 'local',
      ...config
    };
  }

  /**
   * Generate unique ID for filenames
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Execute FitDiT workflow with provider-specific handling
   */
  async executeFitDiTWorkflow(params: FitDiTWorkflowParams): Promise<string> {
    switch (this.config.provider) {
      case 'replicate':
        return this.executeReplicateWorkflow(params);
      case 'runpod':
        return this.executeRunPodWorkflow(params);
      case 'modal':
        return this.executeModalWorkflow(params);
      default:
        return this.executeLocalWorkflow(params);
    }
  }

  /**
   * Local ComfyUI execution (development)
   */
  private async executeLocalWorkflow(params: FitDiTWorkflowParams): Promise<string> {
    try {
      // Upload images to ComfyUI
      console.log('🔄 Uploading images to local ComfyUI...');
      const [garmentImageName, humanImageName] = await Promise.all([
        this.uploadImageFromUrl(params.garment_image_url, `garment_${this.generateId()}.jpg`),
        this.uploadImageFromUrl(params.human_image_url, `human_${this.generateId()}.jpg`)
      ]);

      console.log('✅ Images uploaded:', { garmentImageName, humanImageName });

      // Create workflow
      const workflow = this.createFitDiTWorkflow(params, garmentImageName, humanImageName);
      
      // Execute workflow
      console.log('🚀 Executing FitDiT workflow...');
      const response = await fetch(`${this.config.baseUrl}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: workflow }),
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      if (!response.ok) {
        throw new Error(`Failed to execute workflow: ${response.statusText}`);
      }

      const result: ComfyUIResponse = await response.json();
      
      if (result.node_errors && Object.keys(result.node_errors).length > 0) {
        throw new Error(`Workflow execution failed: ${JSON.stringify(result.node_errors)}`);
      }

      console.log('✅ Workflow submitted with prompt_id:', result.prompt_id);
      return result.prompt_id;

    } catch (error) {
      console.error('❌ Error executing local FitDiT workflow:', error);
      throw error;
    }
  }

  /**
   * Replicate API execution (production-ready)
   */
  private async executeReplicateWorkflow(params: FitDiTWorkflowParams): Promise<string> {
    try {
      console.log('🚀 Executing FitDiT on Replicate...');
      
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "your-fitdit-model-version", // Replace with actual model version
          input: {
            human_image: params.human_image_url,
            garment_image: params.garment_image_url,
            garment_type: params.garment_type,
            num_inference_steps: params.n_steps || 20,
            guidance_scale: params.image_scale || 2,
            seed: params.seed,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Replicate prediction started:', result.id);
      return result.id;

    } catch (error) {
      console.error('❌ Error executing Replicate workflow:', error);
      throw error;
    }
  }

  /**
   * RunPod serverless execution (cost-effective scaling)
   */
  private async executeRunPodWorkflow(params: FitDiTWorkflowParams): Promise<string> {
    try {
      console.log('🚀 Executing FitDiT on RunPod...');
      
      const response = await fetch(`${this.config.baseUrl}/runsync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            workflow: this.createFitDiTWorkflow(params, 'garment.jpg', 'human.jpg'),
            images: {
              'garment.jpg': params.garment_image_url,
              'human.jpg': params.human_image_url
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`RunPod API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ RunPod job started:', result.id);
      return result.id;

    } catch (error) {
      console.error('❌ Error executing RunPod workflow:', error);
      throw error;
    }
  }

  /**
   * Modal execution (serverless with custom runtime)
   */
  private async executeModalWorkflow(params: FitDiTWorkflowParams): Promise<string> {
    try {
      console.log('🚀 Executing FitDiT on Modal...');
      
      const response = await fetch(`${this.config.baseUrl}/fitdit-tryon`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Modal API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Modal function started:', result.call_id);
      return result.call_id;

    } catch (error) {
      console.error('❌ Error executing Modal workflow:', error);
      throw error;
    }
  }

  /**
   * Upload an image to ComfyUI (local only)
   */
  async uploadImage(imageBlob: Blob, filename: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageBlob, filename);
    formData.append('overwrite', 'true');

    const response = await fetch(`${this.config.baseUrl}/upload/image`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(this.config.timeout!),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const result = await response.json();
    return result.name; // Returns the filename in ComfyUI
  }

  /**
   * Download image from URL and upload to ComfyUI (local only)
   */
  async uploadImageFromUrl(imageUrl: string, filename?: string): Promise<string> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
    }
    
    const blob = await response.blob();
    const finalFilename = filename || `${this.generateId()}.${blob.type.split('/')[1] || 'jpg'}`;
    
    return this.uploadImage(blob, finalFilename);
  }

  /**
   * Create FitDiT workflow from template
   */
  private createFitDiTWorkflow(params: FitDiTWorkflowParams, garmentImageName: string, humanImageName: string) {
    // Map garment type to category format expected by FitDiT
    const categoryMap = {
      'upper_body': 'Upper-body',
      'lower_body': 'Lower-body', 
      'dresses': 'Dresses'
    };

    return {
      "3": {
        "inputs": {
          "category": categoryMap[params.garment_type],
          "offset_top": params.offset_top || 0,
          "offset_bottom": params.offset_bottom || 0,
          "offset_left": params.offset_left || 0,
          "offset_right": params.offset_right || 0,
          "model": ["16", 0],
          "vton_image": ["6", 0]
        },
        "class_type": "FitDiTMaskGenerator",
        "_meta": {
          "title": "Generate FitDiT Mask"
        }
      },
      "4": {
        "inputs": {
          "n_steps": params.n_steps || 20,
          "image_scale": params.image_scale || 2,
          "seed": params.seed || Math.floor(Math.random() * 1000000),
          "num_images": 1,
          "resolution": params.resolution || "1536x2048",
          "model": ["16", 0],
          "vton_image": ["6", 0],
          "garm_image": ["5", 0],
          "mask": ["3", 1],
          "pose_image": ["3", 2]
        },
        "class_type": "FitDiTTryOn",
        "_meta": {
          "title": "FitDiT Try-On"
        }
      },
      "5": {
        "inputs": {
          "image": garmentImageName
        },
        "class_type": "LoadImage",
        "_meta": {
          "title": "Load Garment Image"
        }
      },
      "6": {
        "inputs": {
          "image": humanImageName
        },
        "class_type": "LoadImage",
        "_meta": {
          "title": "Load Model Image"
        }
      },
      "16": {
        "inputs": {
          "device": "cuda",
          "with_fp16": false,
          "with_offload": false,
          "with_aggressive_offload": false
        },
        "class_type": "FitDiTLoader",
        "_meta": {
          "title": "Load FitDiT Model"
        }
      },
      "17": {
        "inputs": {
          "filename_prefix": "fitdit_result",
          "images": ["4", 0]
        },
        "class_type": "SaveImage",
        "_meta": {
          "title": "Save Image"
        }
      }
    };
  }

  /**
   * Check workflow status with provider-specific handling
   */
  async getStatus(promptId: string): Promise<ComfyUIStatus> {
    switch (this.config.provider) {
      case 'replicate':
        return this.getReplicateStatus(promptId);
      case 'runpod':
        return this.getRunPodStatus(promptId);
      case 'modal':
        return this.getModalStatus(promptId);
      default:
        return this.getLocalStatus(promptId);
    }
  }

  /**
   * Local ComfyUI status check
   */
  private async getLocalStatus(promptId: string): Promise<ComfyUIStatus> {
    try {
      // Check queue status
      const queueResponse = await fetch(`${this.config.baseUrl}/queue`);
      const queueData = await queueResponse.json();
      
      // Check if prompt is in queue
      const inQueue = queueData.queue_pending.some((item: any) => item[1] === promptId) ||
                     queueData.queue_running.some((item: any) => item[1] === promptId);
      
      if (inQueue) {
        const queuePosition = queueData.queue_pending.findIndex((item: any) => item[1] === promptId);
        return {
          status: queuePosition >= 0 ? 'pending' : 'running',
          prompt_id: promptId,
          queue_remaining: queuePosition >= 0 ? queuePosition + 1 : 0
        };
      }

      // Check history for completed results
      const historyResponse = await fetch(`${this.config.baseUrl}/history/${promptId}`);
      
      if (!historyResponse.ok) {
        return {
          status: 'error',
          prompt_id: promptId,
          error: 'Failed to get status'
        };
      }

      const historyData = await historyResponse.json();
      
      if (historyData[promptId]) {
        const execution = historyData[promptId];
        
        if (execution.status?.completed) {
          return {
            status: 'success',
            prompt_id: promptId,
            outputs: execution.outputs
          };
        } else if (execution.status?.status_str === 'error') {
          return {
            status: 'error',
            prompt_id: promptId,
            error: execution.status.messages?.join(', ') || 'Unknown error'
          };
        }
      }

      return {
        status: 'pending',
        prompt_id: promptId
      };

    } catch (error) {
      console.error('Error checking local status:', error);
      return {
        status: 'error',
        prompt_id: promptId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Replicate status check
   */
  private async getReplicateStatus(promptId: string): Promise<ComfyUIStatus> {
    try {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${promptId}`, {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        return {
          status: 'error',
          prompt_id: promptId,
          error: 'Failed to get Replicate status'
        };
      }

      const result = await response.json();
      
      const statusMap: Record<string, 'pending' | 'running' | 'success' | 'error'> = {
        'starting': 'pending',
        'processing': 'running',
        'succeeded': 'success',
        'failed': 'error',
        'canceled': 'error'
      };

      return {
        status: statusMap[result.status] || 'pending',
        prompt_id: promptId,
        outputs: result.status === 'succeeded' ? { result_url: result.output } : undefined,
        error: result.status === 'failed' ? result.error : undefined
      };

    } catch (error) {
      return {
        status: 'error',
        prompt_id: promptId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * RunPod status check
   */
  private async getRunPodStatus(promptId: string): Promise<ComfyUIStatus> {
    try {
      const response = await fetch(`${this.config.baseUrl}/status/${promptId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      const result = await response.json();
      
      const statusMap: Record<string, 'pending' | 'running' | 'success' | 'error'> = {
        'IN_QUEUE': 'pending',
        'IN_PROGRESS': 'running',
        'COMPLETED': 'success',
        'FAILED': 'error'
      };

      return {
        status: statusMap[result.status] || 'pending',
        prompt_id: promptId,
        outputs: result.status === 'COMPLETED' ? result.output : undefined,
        error: result.status === 'FAILED' ? result.error : undefined
      };

    } catch (error) {
      return {
        status: 'error',
        prompt_id: promptId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Modal status check
   */
  private async getModalStatus(promptId: string): Promise<ComfyUIStatus> {
    try {
      const response = await fetch(`${this.config.baseUrl}/calls/${promptId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      const result = await response.json();
      
      const statusMap: Record<string, 'pending' | 'running' | 'success' | 'error'> = {
        'pending': 'pending',
        'running': 'running',
        'completed': 'success',
        'failed': 'error'
      };

      return {
        status: statusMap[result.status] || 'pending',
        prompt_id: promptId,
        outputs: result.status === 'completed' ? result.outputs : undefined,
        error: result.status === 'failed' ? result.error : undefined
      };

    } catch (error) {
      return {
        status: 'error',
        prompt_id: promptId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get result image URL from workflow outputs
   */
  getResultImageUrl(outputs: Record<string, any>): string | null {
    try {
      // For local ComfyUI
      if (this.config.provider === 'local') {
        const saveImageOutput = outputs["17"];
        if (saveImageOutput?.images?.[0]) {
          const image = saveImageOutput.images[0];
          return `${this.config.baseUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`;
        }
      }
      
      // For cloud providers
      if (outputs.result_url) {
        return outputs.result_url;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting result URL:', error);
      return null;
    }
  }

  /**
   * Wait for workflow completion with polling
   */
  async waitForCompletion(promptId: string, maxWaitTime = 300000): Promise<ComfyUIStatus> {
    const startTime = Date.now();
    const pollInterval = 2000;

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getStatus(promptId);
      
      if (status.status === 'success' || status.status === 'error') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Workflow execution timed out');
  }
}

// Create client based on environment configuration
const getComfyUIClient = () => {
  const provider = (process.env.COMFYUI_PROVIDER || 'local') as 'local' | 'replicate' | 'runpod' | 'modal';
  
  const configs = {
    local: {
      baseUrl: process.env.COMFYUI_BASE_URL || 'http://localhost:8188',
      provider: 'local' as const
    },
    replicate: {
      baseUrl: 'https://api.replicate.com',
      provider: 'replicate' as const,
      apiKey: process.env.REPLICATE_API_TOKEN
    },
    runpod: {
      baseUrl: process.env.RUNPOD_ENDPOINT_URL || '',
      provider: 'runpod' as const,
      apiKey: process.env.RUNPOD_API_KEY
    },
    modal: {
      baseUrl: process.env.MODAL_ENDPOINT_URL || '',
      provider: 'modal' as const,
      apiKey: process.env.MODAL_API_KEY
    }
  };

  return new ComfyUIClient(configs[provider]);
};

// Default client instance
export const comfyUIClient = getComfyUIClient(); 