# 🚀 FitDiT Production Deployment Guide

## 📊 **Deployment Options Comparison**

| Option | Scalability | Cost | Complexity | Speed | Best For |
|--------|-------------|------|------------|-------|----------|
| **Local ComfyUI** | ❌ Low | ✅ Free | ✅ Easy | ⚡ Fast | Development |
| **Replicate** | ✅ High | 💰 $0.10/run | ✅ Easy | 🐌 Slow | MVP/Testing |
| **RunPod Serverless** | ✅ High | 💚 $0.05/run | 🔶 Medium | ⚡ Fast | Production |
| **Modal** | ✅ High | 💚 $0.04/run | 🔶 Medium | ⚡ Fast | Production |
| **Docker + K8s** | ✅ High | 💰 Variable | 🔴 Hard | ⚡ Fast | Enterprise |

---

## 🛠 **Option 1: Local Development (Current)**

**For testing and development only**

### Environment Setup:
```env
# .env.local
COMFYUI_PROVIDER=local
COMFYUI_BASE_URL=http://localhost:8188
```

### ComfyUI Installation:
```bash
# Clone and setup ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt

# Install FitDiT nodes (you'll need to find/install these)
cd custom_nodes
git clone [FitDiT-nodes-repo]  # Replace with actual repo

# Run ComfyUI
python main.py --listen 127.0.0.1 --port 8188
```

---

## ⭐ **Option 2: Replicate (Recommended for MVP)**

**Easiest to set up, pay-per-use**

### Setup:
1. **Create Replicate account**: [replicate.com](https://replicate.com)
2. **Deploy FitDiT model** (or find existing one)
3. **Update environment**:

```env
# .env.local
COMFYUI_PROVIDER=replicate
REPLICATE_API_TOKEN=your_replicate_token_here
```

### Pros:
- ✅ Zero infrastructure management
- ✅ Auto-scaling
- ✅ Easy setup

### Cons:
- ❌ Higher cost per request
- ❌ Cold start delays
- ❌ Less control

---

## 🚀 **Option 3: RunPod Serverless (Recommended for Production)**

**Best balance of cost, performance, and scalability**

### Setup:

1. **Create RunPod account**: [runpod.io](https://runpod.io)

2. **Create serverless endpoint**:
```bash
# Deploy ComfyUI + FitDiT to RunPod
# Use their template or create custom Docker image
```

3. **Update environment**:
```env
# .env.local
COMFYUI_PROVIDER=runpod
RUNPOD_API_KEY=your_runpod_api_key
RUNPOD_ENDPOINT_URL=https://api.runpod.ai/v2/your-endpoint-id
```

### Custom Docker Image for RunPod:
```dockerfile
# Dockerfile
FROM runpod/pytorch:2.0.1-py3.10-cuda11.8.0-devel-ubuntu22.04

# Install ComfyUI
WORKDIR /workspace
RUN git clone https://github.com/comfyanonymous/ComfyUI.git
WORKDIR /workspace/ComfyUI

# Install dependencies
RUN pip install -r requirements.txt

# Install FitDiT nodes
RUN cd custom_nodes && git clone [fitdit-repo]

# Copy models (you'll need to add model files)
COPY models/ models/

# Setup entry point
COPY handler.py .
CMD ["python", "handler.py"]
```

---

## 🔧 **Option 4: Modal (Best Performance)**

**Fastest cold starts, great developer experience**

### Setup:

1. **Install Modal**: `pip install modal`

2. **Create Modal app**:
```python
# modal_fitdit.py
import modal

app = modal.App("fitdit-tryon")

# Define image with ComfyUI + FitDiT
image = (
    modal.Image.debian_slim()
    .pip_install(["torch", "torchvision", "torchaudio"])
    .run_commands([
        "git clone https://github.com/comfyanonymous/ComfyUI.git /workspace/ComfyUI",
        "cd /workspace/ComfyUI && pip install -r requirements.txt"
    ])
    # Add FitDiT installation steps
)

@app.function(
    image=image,
    gpu=modal.gpu.T4(),
    timeout=300,
    memory=8192
)
def fitdit_tryon(workflow_params):
    # Your ComfyUI execution code here
    return {"result_url": "..."}
```

3. **Deploy**:
```bash
modal deploy modal_fitdit.py
```

4. **Update environment**:
```env
# .env.local
COMFYUI_PROVIDER=modal
MODAL_API_KEY=your_modal_token
MODAL_ENDPOINT_URL=https://your-app--fitdit-tryon.modal.run
```

---

## 🐳 **Option 5: Docker + Kubernetes (Enterprise)**

**For high-scale production deployments**

### Docker Setup:
```dockerfile
# Dockerfile
FROM nvidia/cuda:11.8-devel-ubuntu22.04

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3 python3-pip git
RUN pip3 install torch torchvision torchaudio

# Install ComfyUI
WORKDIR /app
RUN git clone https://github.com/comfyanonymous/ComfyUI.git
WORKDIR /app/ComfyUI
RUN pip3 install -r requirements.txt

# Install FitDiT
RUN cd custom_nodes && git clone [fitdit-repo]

# Copy models and config
COPY models/ models/
COPY config/ config/

EXPOSE 8188
CMD ["python3", "main.py", "--listen", "0.0.0.0", "--port", "8188"]
```

### Kubernetes Deployment:
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fitdit-comfyui
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fitdit-comfyui
  template:
    metadata:
      labels:
        app: fitdit-comfyui
    spec:
      containers:
      - name: comfyui
        image: your-registry/fitdit-comfyui:latest
        ports:
        - containerPort: 8188
        resources:
          requests:
            nvidia.com/gpu: 1
            memory: "8Gi"
          limits:
            nvidia.com/gpu: 1
            memory: "16Gi"
---
apiVersion: v1
kind: Service
metadata:
  name: fitdit-service
spec:
  selector:
    app: fitdit-comfyui
  ports:
  - port: 8188
    targetPort: 8188
  type: LoadBalancer
```

---

## 📝 **Environment Configuration Summary**

Create your `.env.local` file with one of these configurations:

### Development (Local):
```env
# Local Development
COMFYUI_PROVIDER=local
COMFYUI_BASE_URL=http://localhost:8188

# Your existing vars
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Production (RunPod):
```env
# Production with RunPod
COMFYUI_PROVIDER=runpod
RUNPOD_API_KEY=your_runpod_api_key
RUNPOD_ENDPOINT_URL=https://api.runpod.ai/v2/your-endpoint-id

# Your existing vars
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Production (Replicate):
```env
# Production with Replicate
COMFYUI_PROVIDER=replicate
REPLICATE_API_TOKEN=your_replicate_token

# Your existing vars
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

---

## 🎯 **Recommended Path**

1. **Start with Local** (for development)
2. **MVP with Replicate** (easiest production)
3. **Scale with RunPod/Modal** (cost-effective production)
4. **Enterprise with K8s** (if you need full control)

## 🔧 **Quick Start for Each Option**

### Local Development:
```bash
# 1. Create .env.local with local config
echo "COMFYUI_PROVIDER=local" > .env.local
echo "COMFYUI_BASE_URL=http://localhost:8188" >> .env.local

# 2. Start ComfyUI (in separate terminal)
cd /path/to/ComfyUI
python main.py --listen 127.0.0.1 --port 8188

# 3. Start your app
npm run dev
```

### Replicate Production:
```bash
# 1. Get Replicate API token from replicate.com
# 2. Create .env.local with replicate config
echo "COMFYUI_PROVIDER=replicate" > .env.local
echo "REPLICATE_API_TOKEN=your_token_here" >> .env.local

# 3. Deploy (no ComfyUI setup needed!)
npm run dev
```

The code automatically switches between providers based on your environment variables! 🎉 