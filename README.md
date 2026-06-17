# Sprint Blocker Tracker API

API REST para el seguimiento de impedimentos (blockers) durante sprints de desarrollo.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Swagger para documentación

## Setup

```bash
npm install
cp .env.sample .env
# Completar variables en .env
npm run dev
```

## Endpoints principales

| Método | Ruta | Rol requerido |
|--------|------|---------------|
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| GET | /api/blockers | dev, pm |
| POST | /api/blockers | dev |
| PUT | /api/blockers/:id | dev (propio), pm |
| PATCH | /api/blockers/:id/status | pm |
| DELETE | /api/blockers/:id | pm |
| GET | /api/users | pm |
