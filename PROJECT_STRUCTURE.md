# DraftMate AI MVP Project Structure

This document proposes a **simple, demo-ready full-stack architecture** for a university MVP.

## 1) Folder Structure

```text
draftmate-ai/
├─ frontend/                      # React + Vite app
│  ├─ public/
│  │  └─ vite.svg
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ ProblemInput.jsx
│  │  │  ├─ DraftEditor.jsx
│  │  │  ├─ HistoryList.jsx
│  │  │  └─ FeedbackForm.jsx
│  │  ├─ pages/
│  │  │  ├─ HomePage.jsx
│  │  │  └─ HistoryPage.jsx
│  │  ├─ services/
│  │  │  └─ api.js
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ styles.css
│  ├─ index.html
│  ├─ package.json
│  └─ vite.config.js
│
├─ backend/                       # Node.js + Express API
│  ├─ src/
│  │  ├─ db/
│  │  │  ├─ database.js
│  │  │  └─ schema.sql
│  │  ├─ routes/
│  │  │  ├─ drafts.js
│  │  │  ├─ history.js
│  │  │  └─ feedback.js
│  │  ├─ services/
│  │  │  └─ aiService.js
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ .env.example
│  ├─ package.json
│  └─ data/
│     └─ draftmate.db            # SQLite file (generated at runtime)
│
├─ shared/
│  └─ demo-script.md             # 3-minute demo flow checklist
│
├─ .gitignore
└─ README.md
```

---

## 2) File List

### Root
- `.gitignore`
- `README.md`
- `shared/demo-script.md`

### Frontend
- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/index.html`
- `frontend/public/vite.svg`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/styles.css`
- `frontend/src/pages/HomePage.jsx`
- `frontend/src/pages/HistoryPage.jsx`
- `frontend/src/components/ProblemInput.jsx`
- `frontend/src/components/DraftEditor.jsx`
- `frontend/src/components/HistoryList.jsx`
- `frontend/src/components/FeedbackForm.jsx`
- `frontend/src/services/api.js`

### Backend
- `backend/package.json`
- `backend/.env.example`
- `backend/src/server.js`
- `backend/src/app.js`
- `backend/src/db/database.js`
- `backend/src/db/schema.sql`
- `backend/src/routes/drafts.js`
- `backend/src/routes/history.js`
- `backend/src/routes/feedback.js`
- `backend/src/services/aiService.js`
- `backend/data/draftmate.db` (runtime generated)

---

## 3) Explanation of Each File

## Root files
- `.gitignore` — ignores `node_modules`, `.env`, and `backend/data/draftmate.db` so local artifacts are not committed.
- `README.md` — quick setup (`npm install`, run frontend/backend), project purpose, and API overview.
- `shared/demo-script.md` — step-by-step demo script to finish in under 3 minutes.

## Frontend files
- `frontend/package.json` — frontend dependencies/scripts (`dev`, `build`, `preview`).
- `frontend/vite.config.js` — Vite config (dev server, optional proxy to backend).
- `frontend/index.html` — root HTML template used by Vite.
- `frontend/public/vite.svg` — default static asset placeholder.
- `frontend/src/main.jsx` — React entry point; renders `App`.
- `frontend/src/App.jsx` — top-level layout and basic route switch/navigation.
- `frontend/src/styles.css` — minimal styling for clean demo UI.
- `frontend/src/pages/HomePage.jsx` — main workflow page: input problem, generate draft, edit, save, submit feedback.
- `frontend/src/pages/HistoryPage.jsx` — displays previously saved drafts.
- `frontend/src/components/ProblemInput.jsx` — text area + generate button.
- `frontend/src/components/DraftEditor.jsx` — editable generated draft + save button.
- `frontend/src/components/HistoryList.jsx` — list/table of saved entries with timestamp and preview.
- `frontend/src/components/FeedbackForm.jsx` — simple rating + comment form tied to a draft.
- `frontend/src/services/api.js` — centralized Axios/fetch functions for backend endpoints.

## Backend files
- `backend/package.json` — backend dependencies/scripts (`dev`, `start`).
- `backend/.env.example` — sample env vars (e.g., `PORT`, AI key placeholder).
- `backend/src/server.js` — starts Express server and listens on configured port.
- `backend/src/app.js` — Express app configuration (middleware, route registration, error handler).
- `backend/src/db/database.js` — SQLite connection and helper functions.
- `backend/src/db/schema.sql` — SQL schema for `drafts` and `feedback` tables.
- `backend/src/routes/drafts.js` — endpoint to create AI draft and save edited draft.
- `backend/src/routes/history.js` — endpoint to fetch saved drafts/history.
- `backend/src/routes/feedback.js` — endpoint to store user feedback.
- `backend/src/services/aiService.js` — wraps AI draft generation call; can start with mocked output for reliability.
- `backend/data/draftmate.db` — SQLite database file generated automatically.

## Suggested minimal database schema
- `drafts`: `id`, `problem_text`, `generated_text`, `edited_text`, `created_at`.
- `feedback`: `id`, `draft_id`, `rating`, `comment`, `created_at`.

This supports the full MVP flow while staying lightweight.

## MVP demo flow (under 3 minutes)
1. Open Home page.
2. Paste a short complaint scenario.
3. Click **Generate Draft** (show immediate AI result).
4. Edit 1–2 lines in the draft editor.
5. Click **Save**.
6. Add quick feedback (rating + short comment).
7. Open History page to show saved record.

This path proves all required features in one smooth run.
