# SkinAI — Skin Disease Detection System
## Final Year Project · B.Tech IT · KKWIEER, Nashik

---

## Project Structure
```
skin-disease-detector/
├── backend/
│   ├── main.py                  ← FastAPI app entry point
│   ├── routes/
│   │   ├── __init__.py          ← Makes routes/ a Python package (keep empty)
│   │   └── predict.py           ← /api/predict endpoint
│   ├── model/
│   │   ├── skin_disease_model.h5   ← Download from Kaggle Output tab
│   │   └── class_indices.json      ← Download from Kaggle Output tab
│   ├── requirements.txt
│   └── Procfile                 ← For Render deployment
└── frontend/
    ├── src/
    │   ├── App.js               ← Main React component
    │   ├── App.css              ← All styles
    │   └── index.js             ← React entry point
    ├── public/
    │   └── index.html
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

---

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# IMPORTANT: Place your model files in backend/model/
#   skin_disease_model.h5   (from Kaggle Output tab)
#   class_indices.json      (from Kaggle Output tab)

# Run backend
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000
API docs at:     http://localhost:8000/docs

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm start
```

Frontend runs at: http://localhost:3000

---

### Testing the API directly

Open http://localhost:8000/docs in your browser.
Click on POST /api/predict → Try it out → upload an image → Execute.

---

## Deployment

### Backend → Render.com (Free)
1. Push code to GitHub
2. Go to render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - Root directory: backend
   - Build command: pip install -r requirements.txt
   - Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
5. Add model files (commit .h5 to GitHub — it's under 100MB)

### Frontend → Vercel (Free)
1. Update REACT_APP_API_URL in frontend/.env with your Render URL
2. Push to GitHub
3. Go to vercel.com → Import Project → select frontend folder
4. Deploy

---

## Model Details
- Architecture: MobileNetV2 (Transfer Learning)
- Dataset: HAM10000 (10,015 images)
- Classes: 7 skin disease types
- Validation Accuracy: 71.49%
- Input size: 224×224 RGB

## Diseases Detected
1. Melanoma (Critical)
2. Basal Cell Carcinoma (High)
3. Actinic Keratosis (Moderate)
4. Benign Keratosis (Low)
5. Melanocytic Nevus / Mole (Low)
6. Dermatofibroma (Low)
7. Vascular Lesion (Low)

## Disclaimer
For educational purposes only. Not a substitute for professional medical advice.
