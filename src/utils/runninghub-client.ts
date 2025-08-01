// RunningHub API client for cloud ComfyUI workflows
interface RunningHubConfig {
  apiKey: string;
  workflowId?: string;
}

interface FitDiTWorkflowParams {
  human_image: File | string;
  garment_image: File | string;
  garment_type: string;
  n_steps?: number;
  image_scale?: number;
  seed?: number;
}

interface RunningHubResponse {
  task_id: string;
  status: string;
  error?: string;
  result_url?: string;
  queue_position?: number;
}

class RunningHubClient {
  private apiKey: string;
  private baseUrl: string;
  private workflowId: string | undefined;

  constructor(config: RunningHubConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = 'https://www.runninghub.ai';
    this.workflowId = config.workflowId;
    
    console.log('✅ RunningHub client initialized with CORRECT API format:');
    console.log(`   Base URL: ${this.baseUrl}`);
    console.log(`   Workflow ID: ${this.workflowId}`);
    console.log(`   API Key in request body: ${this.apiKey.substring(0, 10)}...`);
  }

  async uploadImage(image: File | string): Promise<string> {
    try {
      // For strings, check if it's already a filename from previous upload
      if (typeof image === 'string') {
        // If it's already a ComfyUI filename (no extension means it's a hash), return as-is
        if (!image.startsWith('http') && !image.startsWith('/') && image.includes('.')) {
          console.log(`📋 Using existing ComfyUI filename: ${image}`);
          return image;
        }
      }

      let file: File;
      
      if (typeof image === 'string') {
        console.log(`📥 Fetching image from URL: ${image}`);
        const response = await fetch(image);
        const blob = await response.blob();
        file = new File([blob], 'image.jpg', { type: blob.type });
      } else {
        file = image;
      }

      console.log(`📤 Uploading to ComfyUI proxy: ${file.name} (${file.size} bytes)`);
      
      const formData = new FormData();
      formData.append('image', file);

      // Use ComfyUI proxy for uploads (this works reliably)
      const uploadUrl = `https://www.runninghub.ai/proxy/${this.apiKey}/upload/image`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      console.log(`📊 Upload response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Upload error: ${errorText}`);
        throw new Error(`Upload failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('📤 ComfyUI upload result:', result);

      // ComfyUI returns the filename directly
      const imageName = result.name;
      if (!imageName) {
        throw new Error('No image name returned from ComfyUI upload');
      }

      console.log(`✅ Image uploaded to ComfyUI: ${imageName}`);
      return imageName;

    } catch (error) {
      console.error('❌ Image upload error:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async executeFitDiTWorkflow(params: FitDiTWorkflowParams): Promise<RunningHubResponse> {
    try {
      console.log('🚀 Starting FitDiT workflow via RunningHub API:', params);

      // Upload images if needed
      const humanImageUrl = await this.uploadImage(params.human_image);
      const garmentImageUrl = await this.uploadImage(params.garment_image);

      console.log('📋 Workflow inputs:');
      console.log(`   Human image: ${humanImageUrl}`);
      console.log(`   Garment image: ${garmentImageUrl}`);
      console.log(`   Garment type: ${params.garment_type}`);

      // Use RunningHub's AI App API format
      const workflowPayload = {
        webappId: this.workflowId || process.env.RUNNINGHUB_WORKFLOW_ID,
        apiKey: this.apiKey,
        nodeInfoList: [
          {
            nodeId: "5",
            fieldName: "image", 
            fieldValue: garmentImageUrl,
            description: "Upload clothing image"
          },
          {
            nodeId: "6",
            fieldName: "image",
            fieldValue: humanImageUrl,
            description: "Upload model image"
          },
          {
            nodeId: "3",
            fieldName: "category",
            fieldValue: this.mapGarmentType(params.garment_type),
            description: "Select replacement area"
          },
          {
            nodeId: "4",
            fieldName: "resolution",
            fieldValue: "1536x2048",
            description: "Output resolution selection"
          }
        ]
      };

      console.log('🎯 Starting AI App workflow with CORRECT API format:', JSON.stringify(workflowPayload, null, 2));

      const response = await fetch(`${this.baseUrl}/task/openapi/ai-app/run`, {
        method: 'POST',
        headers: {
          'Host': 'www.runninghub.ai',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workflowPayload)
      });

      console.log(`📊 Workflow response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Workflow error: ${errorText}`);
        throw new Error(`Workflow start failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ RunningHub workflow response:', result);

      // Check for various possible response formats
      if (result.code && result.code !== 200 && result.code !== 0) {
        throw new Error(result.message || result.msg || 'Workflow execution failed');
      }

      // Look for task ID in various possible locations
      const taskId = result.taskId || result.data?.taskId || result.data?.task_id || result.task_id || result.id;
      if (!taskId) {
        console.log('🔍 Response structure:', JSON.stringify(result, null, 2));
        throw new Error('No task ID returned from workflow execution');
      }

      return { 
        task_id: taskId, 
        status: 'running' 
      };

    } catch (error) {
      console.error('❌ RunningHub workflow error:', error);
      return { 
        task_id: '', 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getStatus(taskId: string): Promise<RunningHubResponse> {
    try {
      console.log(`🔍 Checking status for task: ${taskId}`);

      const response = await fetch(`${this.baseUrl}/task/openapi/status`, {
        method: 'POST',
        headers: {
          'Host': 'www.runninghub.ai',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          taskId: taskId
        })
      });

      console.log(`📊 Status response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Status check error: ${errorText}`);
        throw new Error(`Status check failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Status result:', result);

      // Check for RunningHub's response format
      if (result.code && result.code !== 0) {
        throw new Error(result.msg || 'Status check failed');
      }

      // RunningHub returns status directly in the data field
      const runningHubStatus = result.data;
      
      // Map RunningHub status to our expected format
      let mappedStatus = 'unknown';
      switch (runningHubStatus) {
        case 'QUEUED':
          mappedStatus = 'pending';
          break;
        case 'RUNNING':
        case 'IN_PROGRESS':
          mappedStatus = 'running';
          break;
        case 'COMPLETED':
        case 'SUCCESS':
          mappedStatus = 'success';
          break;
        case 'FAILED':
        case 'ERROR':
          mappedStatus = 'failed';
          break;
        default:
          console.log(`⚠️ Unknown RunningHub status: "${runningHubStatus}"`);
          mappedStatus = 'unknown';
      }
      
      return {
        task_id: taskId,
        status: mappedStatus,
        error: undefined
      };

    } catch (error) {
      console.error('❌ Status check error:', error);
      return {
        task_id: taskId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getResults(taskId: string): Promise<RunningHubResponse> {
    try {
      console.log(`📥 Getting results for task: ${taskId}`);

      const response = await fetch(`${this.baseUrl}/task/openapi/outputs`, {
        method: 'POST',
        headers: {
          'Host': 'www.runninghub.ai',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          taskId: taskId
        })
      });

      console.log(`📊 Results response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          console.log('📋 Results not found (404) - check RunningHub dashboard');
                      return {
              task_id: taskId,
              status: 'completed',
              result_url: `https://www.runninghub.ai/workflow/${this.workflowId}`,
              error: 'View results on RunningHub dashboard'
            };
        }
        console.error(`❌ Results error: ${errorText}`);
        throw new Error(`Results fetch failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('📥 Results:', result);

      // Check RunningHub API response format
      if (result.code && result.code !== 0) {
        throw new Error(result.msg || 'Failed to get results');
      }

      // According to RunningHub API docs, results are in data array
      const outputs = result.data || [];
      
      if (outputs.length === 0) {
        console.log('⚠️ No outputs found in results');
        return {
          task_id: taskId,
          status: 'completed',
          error: 'No output files generated'
        };
      }

      // Get the first output file (usually the generated image)
      const firstOutput = outputs[0];
      const resultUrl = firstOutput.fileUrl;
      
      console.log(`✅ Found result URL: ${resultUrl}`);
      
      return {
        task_id: taskId,
        status: 'completed',
        result_url: resultUrl
      };

    } catch (error) {
      console.error('❌ Results fetch error:', error);
      return {
        task_id: taskId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private mapGarmentType(garmentType: string): string {
    const mapping: { [key: string]: string } = {
      'upper_body': 'Upper-body',
      'lower_body': 'Lower-body', 
      'dresses': 'Dresses'
    };
    return mapping[garmentType] || 'Upper-body';
  }
}

// Factory function to create client
export function createRunningHubClient(): RunningHubClient {
  const apiKey = process.env.RUNNINGHUB_API_KEY;
  const workflowId = process.env.RUNNINGHUB_WORKFLOW_ID;
  
  if (!apiKey) {
    throw new Error('RUNNINGHUB_API_KEY environment variable is required');
  }

  console.log('🔧 Creating RunningHub client with:');
  console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`   Workflow ID: ${workflowId || 'Not specified'}`);
  
  return new RunningHubClient({
    apiKey,
    workflowId
  });
}

// Create a getter function that reads fresh environment variables each time
export const runningHubClient = {
  get instance() {
    return createRunningHubClient();
  },
  
  // Proxy all methods to the fresh instance
  async uploadImage(image: File | string): Promise<string> {
    return this.instance.uploadImage(image);
  },
  
  async executeFitDiTWorkflow(params: FitDiTWorkflowParams): Promise<RunningHubResponse> {
    return this.instance.executeFitDiTWorkflow(params);
  },
  
  async getStatus(taskId: string): Promise<RunningHubResponse> {
    return this.instance.getStatus(taskId);
  },
  
  async getResults(taskId: string): Promise<RunningHubResponse> {
    return this.instance.getResults(taskId);
  }
};

// Export types for use in other files
export type { FitDiTWorkflowParams, RunningHubResponse }; 