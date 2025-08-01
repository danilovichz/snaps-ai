# FitDiT Integration Setup Guide

This guide explains how to set up and use the new FitDiT virtual try-on integration that replaces the fal.ai implementation.

## Environment Configuration

Create or update your `.env.local` file with the following variables:

```env
# ComfyUI Configuration (Required for FitDiT Virtual Try-On)
COMFYUI_BASE_URL=http://localhost:8188

# FAL AI Configuration (Optional - kept for backup)
FAL_API_KEY=your_fal_api_key_here

# Other existing configurations...
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## ComfyUI Requirements

### 1. Install FitDiT Nodes
Make sure you have the FitDiT custom nodes installed in your ComfyUI installation:

- **FitDiTLoader**: Loads the FitDiT model
- **FitDiTMaskGenerator**: Generates masks for clothing regions
- **FitDiTTryOn**: Performs the actual virtual try-on

### 2. Required Models
Download and place these models in your ComfyUI models directory:
- FitDiT checkpoint files
- Any required VAE models
- ControlNet models (if needed)

### 3. Start ComfyUI Server
```bash
cd /path/to/ComfyUI
python main.py --listen 127.0.0.1 --port 8188
```

## API Changes

### New Parameters Supported:
- `n_steps` (20): Number of inference steps
- `image_scale` (2): Image scale factor
- `resolution` ("1536x2048"): Output resolution
- `offset_top`, `offset_bottom`, `offset_left`, `offset_right` (0): Mask offsets

### Example API Call:
```javascript
const response = await fetch('/api/virtual-tryon', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    human_image_url: "https://example.com/person.jpg",
    garment_image_url: "https://example.com/shirt.jpg", 
    garment_type: "upper_body",
    n_steps: 20,
    image_scale: 2,
    resolution: "1536x2048"
  })
});
```

## Frontend Compatibility

The frontend code requires **NO CHANGES**. The API maintains the same interface:
- Same endpoints: `/api/virtual-tryon` (POST/GET)
- Same response format
- Same status polling mechanism

## Testing

1. **Start ComfyUI**: Ensure ComfyUI is running on localhost:8188
2. **Start your app**: `npm run dev`
3. **Test workflow**: Try virtual try-on with example images first
4. **Check logs**: Monitor console for detailed execution logs

## Troubleshooting

### Common Issues:

1. **"Connection refused" error**: 
   - Check if ComfyUI is running
   - Verify COMFYUI_BASE_URL in .env.local

2. **"Node not found" error**:
   - Install FitDiT custom nodes
   - Restart ComfyUI server

3. **"Model not found" error**:
   - Download required FitDiT models
   - Place in correct ComfyUI models directory

4. **Slow processing**:
   - Check GPU availability
   - Adjust `n_steps` parameter (lower = faster)

## Performance Notes

- **First run**: May be slower due to model loading
- **GPU memory**: FitDiT requires substantial VRAM
- **Queue system**: Multiple requests are queued automatically
- **Timeout**: Default 30 seconds per request, 5 minutes total workflow time

## Advanced Configuration

You can modify workflow parameters in `src/utils/comfyui-client.ts`:
- Change default steps, scale, resolution
- Adjust GPU settings (fp16, offloading)
- Modify mask generation parameters
- Add custom preprocessing steps 