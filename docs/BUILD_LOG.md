# Synapse Health AI — Build Log

## Step 1 — Project Foundation ✅
Monorepo structure, MySQL schema, backend skeleton, landing page.

## Step 2–10 — Full System Build ✅ (2026-06-23)

**Complete platform delivered in one release:**

### Backend (Express REST API)
- JWT authentication & RBAC (patient, doctor, pharmacist, admin)
- Patient health profile APIs (allergies, history, labs, vaccinations, prescriptions)
- Doctor portal (patients, prescriptions, lab reports, AI recommendations)
- Pharmacist portal (inventory, prescriptions, dispense workflow)
- Admin portal (users, pharmacies, hospitals, medicines, analytics)
- Public pharmacy locator & medicine availability search
- Drug interaction checker
- AI services: symptom analyzer, drug recommendations, health risk, multilingual chat
- OpenAI integration with intelligent fallback when no API key

### Frontend (React + Tailwind)
- Brand colors from logo: Navy `#002147`, Teal `#00A896`, Green `#76C043`
- **Patient layout: top navbar** navigation
- **Doctor / Pharmacist / Admin: sidebar** navigation
- Full dashboards and feature pages for all roles
- Login/Register with demo accounts

### Docker
- `docker-compose up` runs MySQL + backend + frontend (nginx)
- Auto-loads schema and seed data on first run

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Patient | patient@synapse.rw | Password123! |
| Doctor | doctor@synapse.rw | Password123! |
| Pharmacist | pharmacist@synapse.rw | Password123! |
| Admin | admin@synapse.rw | Password123! |
