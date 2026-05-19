# AI-Based Skin Cancer Detection System

An AI-powered dermatological preliminary diagnosis web application that predicts different types of skin lesions using deep learning and computer vision.

This project uses a trained PyTorch model integrated with a FastAPI backend and a React frontend to provide fast image-based predictions with Grad-CAM visualization support.

---

## Features

- Upload skin lesion images
- Deep learning–based prediction system
- FastAPI backend for inference
- React + Vite frontend
- Grad-CAM heatmap visualization
- Confidence score prediction
- Modern responsive UI
- PyTorch model integration

---

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- CSS

### Backend
- FastAPI
- Uvicorn
- PyTorch
- Torchvision
- Pillow
- NumPy
- OpenCV

### AI/ML
- CNN-based skin lesion classification
- HAM10000 dataset
- Grad-CAM explainability

---

## Project Structure

```bash
skin-cancer-app/
│
├── backend/
│   ├── model/
│   │   └── deploy_model.pth
│   ├── main.py
│   └── utils.py
│
├── dermnet-frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Installation

# 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/skin-cancer-app.git
cd skin-cancer-app
```

---

# 2. Backend Setup

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# 3. Frontend Setup

Open another terminal:

```bash
cd dermnet-frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Model Information

The project uses a trained PyTorch model stored using Git LFS.

### Install Git LFS

```bash
git lfs install
```

### Pull Model Files

```bash
git lfs pull
```

---

## API Endpoint

### Predict Skin Lesion

```http
POST /predict
```

### Request

- Form-data image upload

### Response

```json
{
  "prediction": "Melanoma",
  "confidence": 96.5
}
```

---

## Dataset

This project uses the HAM10000 dataset:

- Human Against Machine with 10000 training images
- Dermatoscopic skin lesion images
- Multi-class classification

---

## Disclaimer

This project is intended for academic and research purposes only.

It is not a replacement for professional medical diagnosis, treatment, or consultation.

---

## Future Improvements

- Multi-model ensemble prediction
- Cloud deployment
- Authentication system
- Patient history tracking
- Mobile application
- Real-time camera scanning
- Improved explainability visualizations

---

## Author

Amaan Khan  
B.Tech Computer Science & Design  
GCET / AKTU

---

## License

This project is licensed under the MIT License.
