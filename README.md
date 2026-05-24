# Auvora — AI-Powered Interview Preparation & Resume Builder
live link - https://auvora-ai.vercel.app/
Auvora is a full-stack web application designed to empower job seekers using the power of **Google Gemini AI**. It provides a comprehensive suite for interview preparation and resume optimization, helping candidates bridge skill gaps and land their dream jobs.

---

## 🚀 Key Features

### 1. AI Interview Intelligence
- **Intelligent Report Generation**: Upload your resume PDF and a job description to get a deep-dive analysis.
- **Match Scoring**: Get an instant score (0–100) reflecting how well your profile aligns with the role.
- **Tailored Q&A**: Generates both technical and behavioral questions specific to the job, including the "Interviewer Intent" and "Model Answers."
- **Skill Gap Analysis**: Identifies missing skills and ranks them by severity (Low/Medium/High).
- **Day-Wise Prep Plan**: Receives an actionable, day-by-day roadmap to prepare for the interview.

### 2. Resume Engineering
- **ATS-Optimized Resume**: Uses a multi-pass AI pipeline to extract keywords, generate content, and self-critique the output to ensure maximum ATS compatibility.
- **General Polishing**: Upload any existing resume to get a professionally reformatted version, even without a specific job description.

### 3. Unified Dashboard
- **Report Management**: Save, view, and manage all your past interview reports and generated resumes in one secure location.
- **Secure Authentication**: Built with JWT-based sessions, cookie security, and token blacklisting for a robust user experience.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, React Router 7, Vite 7, Tailwind CSS 4 |
| **Backend** | Node.js, Express 5, Mongoose (MongoDB) |
| **AI Engine** | Google Gemini API (Flash & Preview models) |
| **Security** | JWT (JSON Web Tokens), bcryptjs |
| **PDF Processing** | Puppeteer (Rendering), pdf-parse (Extraction) |

---

## 📂 Project Architecture

```text
GEnAi/
├── Backend/                 # Express Server & AI Logic
│   ├── src/
│   │   ├── controllers/     # Route handlers (Auth, Interview)
│   │   ├── models/          # MongoDB Schemas
│   │   ├── routes/          # API Route definitions
│   │   └── services/        # Core Gemini AI integration logic
│   └── .env                 # Backend configurations
└── Frontend/                # React Vite Application
    ├── src/
    │   ├── features/        # Feature-based folder structure
    │   ├── context/         # App-wide state management
    │   └── components/      # UI components (Tailwind CSS)
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Google AI Studio Key](https://aistudio.google.com/)

### 1. Initial Setup
```bash
git clone https://github.com/vanshgupta11/Auvora-AI-Powered-Interview-Preparation-Resume-Builder.git
cd Auvora-AI-Powered-Interview-Preparation-Resume-Builder
```

### 2. Backend Configuration
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/auvora
JWT_SECRET=your_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Configuration
```bash
cd ../Frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 License
Distributed under the **ISC License**.

---

**Developed by [Vansh Gupta](https://github.com/vanshgupta11)**
