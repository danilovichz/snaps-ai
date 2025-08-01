// Simple ComfyUI client for pre-configured workflows
export interface SimpleComfyUIParams {
  human_image: File | string; // File object or URL
  garment_image: File | string; // File object or URL
  garment_type: 'upper_body' | 'lower_body' | 'dresses';
  n_steps?: number;
  image_scale?: number;
  seed?: number;
}

export interface SimpleComfyUIResponse {
  prompt_id: string;
  status: 'queued' | 'running' | 'success' | 'error';
  result_url?: string;
  error?: string;
}

class SimpleComfyUIClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'http://localhost:8188') {
    this.baseUrl = baseUrl;
  }

  /**
   * Upload image to ComfyUI and get filename
   */
  async uploadImage(image: File | string): Promise<string> {
    if (typeof image === 'string') {
      // If it's a URL, download and upload
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      return this.uploadFile(file);
    } else {
      return this.uploadFile(image);
    }
  }

  private async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'input');
    formData.append('subfolder', '');

    const response = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.name; // ComfyUI returns the filename
  }

  /**
   * Trigger the pre-configured FitDiT workflow
   */
  async runFitDiTWorkflow(params: SimpleComfyUIParams): Promise<SimpleComfyUIResponse> {
    try {
      console.log('🚀 Starting FitDiT workflow with params:', params);

      // Upload images
      const humanImageName = await this.uploadImage(params.human_image);
      const garmentImageName = await this.uploadImage(params.garment_image);

      console.log('📤 Images uploaded:', { humanImageName, garmentImageName });

      // Create workflow with uploaded image names
      const workflow = this.createFitDiTWorkflow({
        human_image_name: humanImageName,
        garment_image_name: garmentImageName,
        garment_type: params.garment_type,
        n_steps: params.n_steps || 20,
        image_scale: params.image_scale || 2,
        seed: params.seed || Math.floor(Math.random() * 1000000)
      });

      // Queue the workflow
      const queueResponse = await fetch(`${this.baseUrl}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: workflow })
      });

      if (!queueResponse.ok) {
        throw new Error(`Queue failed: ${queueResponse.statusText}`);
      }

      const queueResult = await queueResponse.json();
      console.log('✅ Workflow queued with ID:', queueResult.prompt_id);

      return {
        prompt_id: queueResult.prompt_id,
        status: 'queued'
      };

    } catch (error) {
      console.error('❌ FitDiT workflow error:', error);
      return {
        prompt_id: '',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check workflow status and get results
   */
  async getWorkflowStatus(promptId: string): Promise<SimpleComfyUIResponse> {
    try {
      // Check queue status
      const queueResponse = await fetch(`${this.baseUrl}/queue`);
      const queueData = await queueResponse.json();
      
      // Check if still in queue
      const inQueue = queueData.queue_running.some((item: any) => item[1] === promptId) ||
                     queueData.queue_pending.some((item: any) => item[1] === promptId);

      if (inQueue) {
        return { prompt_id: promptId, status: 'running' };
      }

      // Check for completed results
      const historyResponse = await fetch(`${this.baseUrl}/history/${promptId}`);
      
      if (!historyResponse.ok) {
        return { prompt_id: promptId, status: 'running' };
      }

      const historyData = await historyResponse.json();
      
      if (!historyData[promptId]) {
        return { prompt_id: promptId, status: 'running' };
      }

      const result = historyData[promptId];
      
      // Check for errors
      if (result.status && result.status.status_str === 'error') {
        return {
          prompt_id: promptId,
          status: 'error',
          error: result.status.messages?.[0] || 'Unknown error'
        };
      }

      // Find the output image from SaveImage node (node 17 in your workflow)
      const outputs = result.outputs;
      if (outputs && outputs['17']) { // SaveImage node
        const images = outputs['17'].images;
        if (images && images.length > 0) {
          const imageName = images[0].filename;
          const resultUrl = `${this.baseUrl}/view?filename=${imageName}&type=output`;
          
          return {
            prompt_id: promptId,
            status: 'success',
            result_url: resultUrl
          };
        }
      }

      return { prompt_id: promptId, status: 'running' };

    } catch (error) {
      console.error('❌ Status check error:', error);
      return {
        prompt_id: promptId,
        status: 'error',
        error: error instanceof Error ? error.message : 'Status check failed'
      };
    }
  }

  /**
   * Create the FitDiT workflow JSON with dynamic image names
   */
  private createFitDiTWorkflow(params: {
    human_image_name: string;
    garment_image_name: string;
    garment_type: string;
    n_steps: number;
    image_scale: number;
    seed: number;
  }) {
    // Your exact workflow structure with dynamic values
    return {
      "3": {
        "inputs": {
          "category": this.mapGarmentType(params.garment_type),
          "offset_top": 9,
          "offset_bottom": 0,
          "offset_left": 0,
          "offset_right": -169,
          "model": ["16", 0],
          "vton_image": ["6", 0]
        },
        "class_type": "FitDiTMaskGenerator",
        "_meta": { "title": "Generate FitDiT Mask" }
      },
      "4": {
        "inputs": {
          "n_steps": params.n_steps,
          "image_scale": params.image_scale,
          "seed": params.seed,
          "num_images": 1,
          "resolution": "1536x2048",
          "model": ["16", 0],
          "vton_image": ["6", 0],
          "garm_image": ["5", 0],
          "mask": ["3", 1],
          "pose_image": ["3", 2]
        },
        "class_type": "FitDiTTryOn",
        "_meta": { "title": "FitDiT Try-On" }
      },
      "5": {
        "inputs": {
          "image": params.garment_image_name
        },
        "class_type": "LoadImage",
        "_meta": { "title": "Load Garment Image" }
      },
      "6": {
        "inputs": {
          "image": params.human_image_name
        },
        "class_type": "LoadImage",
        "_meta": { "title": "Load Model Image" }
      },
      "10": {
        "inputs": {
          "images": ["4", 0]
        },
        "class_type": "PreviewImage",
        "_meta": { "title": "Try-on Result" }
      },
      "16": {
        "inputs": {
          "device": "cuda",
          "with_fp16": false,
          "with_offload": false,
          "with_aggressive_offload": false
        },
        "class_type": "FitDiTLoader",
        "_meta": { "title": "Load FitDiT Model" }
      },
      "17": {
        "inputs": {
          "filename_prefix": "fitdit_result",
          "images": ["4", 0]
        },
        "class_type": "SaveImage",
        "_meta": { "title": "Save Image" }
      }
    };
  }

  private mapGarmentType(type: string): string {
    const mapping: Record<string, string> = {
      'upper_body': 'Upper-body',
      'lower_body': 'Lower-body', 
      'dresses': 'Dresses'
    };
    return mapping[type] || 'Upper-body';
  }
}

export const simpleComfyUIClient = new SimpleComfyUIClient(
  process.env.COMFYUI_BASE_URL || 'http://localhost:8188'
); 