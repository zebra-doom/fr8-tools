# FR8 Tools

AI-powered platform for querying European intermodal train connections, analyzing CO2 emissions, and optimizing freight routes — all through natural language.

## Architecture

```
                    Vercel                          Railway
              ┌─────────────────┐           ┌──────────────────────┐
  User ──────►│  Next.js 15     │──SSE──────►│  FastAPI             │
              │  + shadcn/ui    │  /api/chat │  + LangGraph agents  │
              │  + Recharts     │◄───────────│  + LangChain         │
              │  + Leaflet      │  streaming │  + SQLite             │
              └─────────────────┘           └──────────────────────┘
```

### Backend Workflow (LangGraph)

```
START → generate_sql → execute_sql → [success] → format_response → END
                                   → [error]   → fix_sql → execute_sql (retry)
                                   → [max retries] → fail → END
```

The core agent is a LangGraph `StateGraph` with conditional routing, a retry loop for SQL errors, and parallel formatting (markdown + chart + map).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Visualizations | Recharts, React-Leaflet |
| Backend | FastAPI, Python 3.12, async/await |
| AI/Agents | LangChain, LangGraph, GPT-4o |
| Database | SQLite, aiosqlite |
| Streaming | Server-Sent Events (SSE) |
| CI/CD | GitHub Actions |
| Deployment | Railway (backend), Vercel (frontend) |

## Local Development

### Prerequisites

- Python 3.12+
- Node.js 22+
- OpenAI API key

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env  # Edit with your API key
python -m data.seed   # Seed the database
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

### Verify

```bash
# Backend health
curl http://localhost:8000/health

# Run backend tests
cd backend && ruff check . && pytest

# Frontend type check
cd frontend && npx tsc --noEmit
```

## Project Structure

```
fr8-tools/
├── frontend/                   # Next.js 15 → Vercel
│   ├── src/app/                # App Router pages
│   ├── src/components/         # Chat UI, visualizations, primitives
│   ├── src/hooks/              # useChat hook
│   └── src/lib/                # SSE client, types, utils
│
├── backend/                    # FastAPI → Railway
│   ├── app/
│   │   ├── agents/             # LangChain chains (SQL, markdown, chart, map)
│   │   ├── workflow/           # LangGraph StateGraph orchestration
│   │   ├── rag/                # Prompts, schema introspection, utils
│   │   └── routes/             # API endpoints (chat, health, data)
│   ├── data/                   # Seed CSV data + migration script
│   └── tests/
│
└── .github/workflows/          # CI/CD pipelines
```

## Key Features

- **Natural Language → SQL**: Ask questions in plain English, get database results
- **Agentic AI**: LangGraph workflow with conditional routing, retry loops, and state management
- **CO2 Analysis**: Compare train vs truck emissions across European freight routes
- **Interactive Charts**: Auto-generated Recharts visualizations
- **Route Maps**: GeoJSON-powered Leaflet maps
- **SSE Streaming**: Real-time response streaming from backend to frontend

## Data

The database contains:
- **Terminals**: 500+ intermodal terminals across 15+ European countries
- **Trains**: 5,000+ train connections with schedules, distances, and CO2 data
- **Operators**: 50+ European rail freight operators

## License

MIT
