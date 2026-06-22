# Synapse Health AI — Full Platform

## Docker (recommended)

```bash
# Copy and configure secrets (never commit backend/.env)
cp backend/.env.example backend/.env
# Edit backend/.env with Groq, SMTP, Twilio keys

# Fresh database + all tables + seed data
docker-compose down -v
docker-compose up --build
```

Open **http://localhost:3000**

## Admin Login

| Field | Value |
|-------|-------|
| Email | hntaganira06@gmail.com |
| Password | 62001 (stored bcrypt-hashed in DB) |

## Sign Up Rules

- **Patients only** can self-register at `/register`
- **Doctors, pharmacists, admins** are created by admin in **Admin → Users**

## Services

| Service | Technology |
|---------|------------|
| AI | Groq (llama-3.3-70b) — set `GROQ_API_KEY` |
| Email | SMTP (Gmail) — set `MAIL_*` in `.env` |
| SMS | Twilio — set `TWILIO_*` in `.env` |
| Database | MySQL 8 in Docker, password `62001` |

## Role Layouts

- **Patient** → top navbar
- **Doctor / Pharmacist / Admin** → left sidebar
- Each role has its own **Permissions** page

## Admin User Management

Create, edit, delete, activate/deactivate, block/unblock users.
