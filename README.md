# Synapse Health AI

**Connecting Intelligence to Better Healthcare**

AI-powered healthcare decision support platform for Rwanda — drug interactions, pharmacy integration, multilingual chat, and role-based portals.

## Quick Start with Docker

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api/health |
| MySQL | localhost:3307 |

## Demo Login

All accounts use password: **Password123!**

| Role | Email |
|------|-------|
| Patient | patient@synapse.rw |
| Doctor | doctor@synapse.rw |
| Pharmacist | pharmacist@synapse.rw |
| Admin | admin@synapse.rw |

## UI Layout

- **Patient** → Top **navbar** navigation
- **Doctor / Pharmacist / Admin** → Left **sidebar** navigation
- Brand colors from logo: Navy, Teal, Green

## Local Development (without Docker)

### Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### Backend
```bash
cd backend && cp .env.example .env && npm install && npm run dev
```

### Frontend
```bash
cd frontend && cp .env.example .env && npm install && npm run dev
```

## Features

- AI Symptom Analyzer & Health Risk Prediction
- Drug Recommendation & Interaction Detection
- Patient Digital Health Profile
- Multilingual AI Chat (EN, Kinyarwanda, French)
- Pharmacy Locator & Medicine Availability
- Doctor, Pharmacist, Admin Dashboards
- Healthcare Analytics

## Tech Stack

React · Vite · Tailwind · Node.js · Express · MySQL · JWT · Docker · OpenAI (optional)

## Disclaimer

Clinical **decision support** only — not a substitute for professional medical care.
