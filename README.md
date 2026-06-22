# Synapse Health AI

**Connecting Intelligence to Better Healthcare**

Synapse Health AI is an AI-powered healthcare decision support platform for Rwanda and beyond. It helps healthcare professionals and patients make safer, more informed treatment decisions through predictive analytics, drug interaction detection, multilingual assistance, and real-time pharmacy integration.

## Features

| Module | Description |
|--------|-------------|
| AI Symptom Analyzer | Suggests possible conditions from symptoms (decision support, not diagnosis) |
| Drug Recommendation | Treatment support based on diagnosis and patient history |
| Drug Interaction Detection | Warns about dangerous combinations with allergies and current meds |
| Patient Health Profile | Medical history, prescriptions, allergies, labs, vaccinations |
| Health Risk Prediction | Diabetes, hypertension, heart and kidney disease risk scores |
| AI Chat Assistant | Multilingual health Q&A (English, Kinyarwanda, French) |
| Pharmacy Locator | Find nearby pharmacies with Google Maps navigation |
| Medicine Availability | Real-time stock from partner pharmacies |
| Role Dashboards | Doctor, pharmacist, patient, and admin portals |
| Healthcare Analytics | Disease trends, medicine demand, regional statistics |

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, JWT, REST API
- **Database:** MySQL
- **AI:** OpenAI API
- **Maps:** Google Maps API

## Project Structure

```
synapse-health-ai/
├── frontend/          # React SPA
├── backend/           # Express REST API
├── database/          # MySQL schema & migrations
├── docs/              # Architecture, build log, API docs
└── Resources/         # Brand assets (logo)
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Database Setup

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and secrets
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `JWT_SECRET` | Secret for signing tokens |
| `OPENAI_API_KEY` | OpenAI API key (Step 4+) |
| `GOOGLE_MAPS_API_KEY` | Google Maps key (Step 7+) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps key |

## User Roles

- **Patient** — Profile, prescriptions, pharmacy search, AI chat
- **Doctor** — Patient records, prescriptions, AI recommendations
- **Pharmacist** — Inventory, prescriptions, stock updates
- **Administrator** — Users, pharmacies, hospitals, analytics

## Build Progress

See [docs/BUILD_LOG.md](docs/BUILD_LOG.md) for step-by-step engineering log.

| Step | Status | Description |
|------|--------|-------------|
| 1 | ✅ Done | Foundation, schema, backend/frontend skeleton |
| 2 | 🔜 Next | Authentication & RBAC |
| 3 | Planned | Patient health profile |
| 4 | Planned | AI symptom analyzer |
| 5 | Planned | Drug recommendation & interactions |
| 6 | Planned | Multilingual chat assistant |
| 7 | Planned | Pharmacy locator & inventory |
| 8 | Planned | Role dashboards |
| 9 | Planned | Healthcare analytics |
| 10 | Planned | Polish & deployment |

## License

MIT — See [LICENSE](LICENSE) for details.

## Disclaimer

Synapse Health AI provides clinical **decision support** only. It does not replace professional medical diagnosis, treatment, or emergency care. Always consult qualified healthcare providers.
