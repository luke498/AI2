# DraftMate AI Backend

## Run locally

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Set `OPENAI_API_KEY` in `.env`.
4. Start server:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:4000` by default.

## Endpoints
- `POST /submit`
- `GET /history`
- `POST /save`
- `POST /feedback`


## KPI logging (simple)
- `generated_at` is recorded when `/submit` creates a draft.
- `saved_at` is recorded when `/save` stores user edits.
- `GET /history` includes `draftingSeconds` to estimate time spent per draft.
