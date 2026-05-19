from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import base64
import cv2

from utils import load_model, load_labels, predict

app = FastAPI()

# CORS (important for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model()
label_map = load_labels()

@app.get("/")
def home():
    return {"message": "Skin Cancer API running"}

@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    result = predict(image, model, label_map)

    # convert gradcam to base64
    _, buffer = cv2.imencode(".jpg", result["gradcam"])
    gradcam_base64 = base64.b64encode(buffer).decode("utf-8")

    result["gradcam"] = gradcam_base64

    return result