# Medical Management System — Frontend

React + Vite client for the Facade pattern workshop. It consumes the clinic backend (`/api/clinica`) to let patients:

- Register and log in with their document number
- See upcoming appointments and latest lab results on the dashboard
- Request lab exams and create prescriptions (allergy conflicts are reported by the backend)
- Schedule appointments by specialty, doctor and available slot
- Browse their medical history (consultations, prescriptions, lab results)

## Tech stack

- React + Vite (JavaScript)
- react-router-dom
- Plain CSS and `fetch`

## Getting started

```bash
npm install
npm run dev
```

Create a `.env.local` file with the backend URL (no trailing slash):

```
VITE_API_URL=http://localhost:8080
```

Build for production:

```bash
npm run build
```

## Environment variables

| Name | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend, e.g. `https://<backend>.up.railway.app` |

## Project structure

```
src/
├── api/clinicApi.js     # All backend calls
├── components/          # Navbar, LabResultBadge
├── pages/               # Login, Register, Dashboard, ScheduleAppointment, MedicalHistory
├── constants.js         # Specialties, exams and formatters
├── session.js           # Patient session in localStorage
├── App.jsx              # Routes
└── main.jsx
```

## Deployment

Deployed on Vercel. `vercel.json` rewrites every route to `index.html` so client-side routes work on reload.

Production URL: _TBD_
