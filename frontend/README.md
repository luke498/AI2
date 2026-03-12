# DraftMate AI Frontend

## Run frontend + backend

1. Start backend (Terminal 1):
   ```bash
   cd backend
   cp .env.example .env
   # add your OPENAI_API_KEY in .env
   npm install
   npm run dev
   ```

2. Start frontend (Terminal 2):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

Vite proxies `/submit`, `/history`, `/save`, and `/feedback` to the backend.

Guardrail: if the input includes sensitive topics (legal advice, medical advice, financial advice), backend returns a warning instead of a generated draft.

## API examples

### POST /submit
Request body:
```json
{
  "problemDescription": "Message type: complaint\nTone: polite\nIssue description: My order arrived late and damaged."
}
```

Example response:
```json
{
  "id": 1,
  "problemDescription": "Message type: complaint\nTone: polite\nIssue description: My order arrived late and damaged.",
  "generatedDraft": "Dear Support Team, ...",
  "createdAt": "2026-03-08 13:45:00"
}
```

Example warning response:
```json
{
  "warning": "Sensitive topic detected (legal/medical/financial advice). Please consult a qualified professional instead of using an AI draft."
}
```

### GET /history
Example response:
```json
[
  {
    "id": 1,
    "problemDescription": "...",
    "generatedDraft": "Dear Support Team, ...",
    "createdAt": "2026-03-08 13:45:00"
  }
]
```

### POST /feedback
Request body:
```json
{
  "requestId": 1,
  "rating": 5,
  "comment": "Useful output"
}
```


### POST /save
Request body:
```json
{
  "requestId": 1,
  "editedDraft": "Updated final email text..."
}
```

Example response:
```json
{
  "id": 1,
  "editedDraft": "Updated final email text...",
  "generatedAt": "2026-03-08 13:45:00",
  "savedAt": "2026-03-08 13:46:12",
  "draftingSeconds": 72
}
```
