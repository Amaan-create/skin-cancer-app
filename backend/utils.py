import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import json
import cv2

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

# ===== LOAD MODEL =====
def load_model():
    model = models.resnet50(weights=None)
    model.fc = nn.Linear(model.fc.in_features, 7)

    model.load_state_dict(torch.load("model/deploy_model.pth", map_location="cpu"))
    model.eval()
    return model

# ===== LOAD LABEL MAP =====
def load_labels():
    with open("model/label_map.json") as f:
        label_map = json.load(f)
    return {v: k for k, v in label_map.items()}

# ===== TRANSFORM =====
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],
                         [0.229,0.224,0.225])
                        
])

# ===== PREDICT =====
def predict(image, model, label_map):
    image = image.convert("RGB")
    tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(tensor)
        probs = torch.softmax(output, dim=1)[0].numpy()

    pred_idx = int(np.argmax(probs))

    # ===== Grad-CAM =====
    cam = GradCAM(model=model, target_layers=[model.layer4[-1]])
    grayscale_cam = cam(input_tensor=tensor)[0]

    rgb_img = np.array(image.resize((224,224))).astype(np.float32) / 255.0
    cam_image = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    return {
        "predicted_class": label_map[pred_idx],
        "confidence": float(probs[pred_idx]),
        "all_probabilities": {
            label_map[i]: float(p)
            for i, p in enumerate(probs)
        },
        "gradcam": cam_image
    }