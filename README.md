# DraftMate AI

DraftMate AI is a simple AI-powered web application that helps users generate complaint messages or email drafts from a short problem description.

## Features
- AI draft generation
- Edit before saving
- History
- Feedback system

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite
- **AI:** OpenAI API

## Project Structure
```text
.
├─ frontend/   # React + Vite app
└─ backend/    # Express API + SQLite + OpenAI
```

## Setup Instructions

### 1) Run Backend
```bash
cd backend
cp .env.example .env
# add your OPENAI_API_KEY in .env
npm install
npm run dev
```

Backend runs at: `http://localhost:4000`

### 2) Run Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Demo Flow
1. User enters problem description
2. Click **Generate**
3. AI generates draft
4. User edits draft
5. Save and give feedback

---
Simple MVP for student demo and learning full-stack integration.
