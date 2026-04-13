# TextSummarizer

TextSummarizer is a GenAI-powered, full-stack web application that leverages advanced Transformer-based Deep Learning models to simplify complex legal texts. Designed to make legal information more accessible to lawyers, researchers, and the general public, it summarizes lengthy judgments through an intuitive interface. Users can upload documents or input text to receive high-quality summaries. The platform features JWT authentication, user profiles, and document/text summarization. It is built with React, Node.js/Express, MongoDB Atlas, and Python FastAPI for custom models.

## ✨ Features

- **User Authentication** (JWT, protected routes)
- **Profile Management**
- **Document/Text Upload & Summarization**
- **Listen to the generated summaries**
- **Modern Responsive UI** (React, Tailwind)
- **Custom ML Models** (PyTorch, HuggingFace, FastAPI)

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, JWT, Axios
- **Database:** MongoDB Atlas (Mongoose ODM)
- **ML Models:** Python, FastAPI, PyTorch, HuggingFace Transformers

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd talqs ai
```

### 2. Environment Variables

Create `.env` files in both `backend/` and `models/`:

#### backend/.env

```
PORT=9000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
FASTAPI_URL=http://localhost:8000
```

#### models/.env

```
SUMMARY_MODEL_PATH=summary custom model.pth
```

### 3. (Recommended) Create a Python Virtual Environment

It is recommended to use a virtual environment for the Python ML service to avoid dependency conflicts:

```bash
cd models
python -m venv venv
# Activate the environment:
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 4. Install Dependencies

- **Backend:**
  ```bash
  cd backend
  npm install
  ```
- **Frontend:**
  ```bash
  cd ../frontend
  npm install
  ```
- **Models (FastAPI):**
  ```bash
  cd ../models
  pip install -r requirements.txt
  # or install: fastapi uvicorn torch transformers python-multipart
  ```

### 5. Run the Application

- **Start FastAPI ML Service:**
  ```bash
  cd models
  uvicorn app:app --reload --host 0.0.0.0 --port 8000
  ```
- **Start Backend:**
  ```bash
  cd backend
  npm start
  ```
- **Start Frontend:**
  ```bash
  cd frontend
  npm start
  ```

## 🔑 Authentication

- JWT-based authentication
- Store token in localStorage
- Send `Authorization: Bearer <token>` in API requests

## 📚 API Endpoints

### Backend (Node.js/Express)

- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/profile` — Get user profile (auth)
- `POST /api/upload` — Upload file or text for summarization (auth)

### FastAPI (Python ML Service)

- `POST /summarize` — Summarize uploaded file/text
  - Request: `{ file: <file> }`
  - Response: `{ summary: <string> }`

## 🧑‍💻 Usage

1. **Sign up / Login**
2. **Upload a document** or **paste text** to summarize
3. **Download** or **copy** or **listen** the summary text
4. **Download** or **copy** or **listen** to generated summaries
