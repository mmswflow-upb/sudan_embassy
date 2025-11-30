# Sudan Embassy Website

This is a full-stack web application built for the Embassy of the Republic of Sudan in Bucharest, Romania. It provides multilingual public information and an admin portal for managing content such as services, news, alerts, and forms.

## Team

- **Sakka Mohamad-Mario** – Frontend, backend, deployment  
- **Zafar Azzam** – Backend development and API design  
- **Al-Khalidy Essam** – Frontend components and UI

## Live Demo

- Frontend: https://sudan-embassy.web.app  
- Backend API: https://sudan-embassy-api-919606479278.europe-west1.run.app  

## Main Features

- Multilingual UI: English, Romanian, and Arabic (with full RTL support for Arabic)
- Admin Portal: Manage services, news, alerts, forms, and settings without touching code
- File Management: Upload documents, PDFs, and images to Firebase Storage
- Appointment Booking: Users can book appointments online
- Forms and Contact: Custom form submissions and contact messages stored and forwarded to the embassy
- Responsive UI: Optimized for mobile, tablet, and desktop
- Real-time Updates: Content stored in Firestore and reflected immediately
- Secure Admin Access: Firebase Authentication and Admin SDK
- Cloud Deployment: Frontend on Firebase Hosting, backend on Google Cloud Run

## Tech Stack

### Frontend

- React 18 + Vite  
- Tailwind CSS  
- React Router v6  
- React Hook Form + Zod  
- i18next / react-i18next  
- Firebase Authentication, Firestore, Storage  
- AOS (Animate On Scroll)

### Backend

- Node.js (v18+)  
- Express.js  
- Firebase Firestore & Cloud Storage  
- Firebase Admin SDK  
- Multer for file uploads  
- CORS, dotenv

### Deployment

- Firebase Hosting (frontend)  
- Google Cloud Run (backend)  
- Firebase CLI / Google Cloud CLI

## Project Structure (Overview)

```text
sudan_embassy/
├── client/        # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # UI + admin components
│   │   ├── pages/       # Public and admin pages
│   │   ├── lib/         # Firebase, i18n, helpers
│   │   ├── locales/     # en, ro, ar translations
│   │   ├── App.jsx
│   │   └── main.jsx
├── server/        # Node/Express backend
│   ├── index.js   # API routes
│   ├── firebaseAdmin.js
│   ├── seed.js
│   ├── settings.json
│   ├── app.yaml
│   └── Dockerfile
└── DEPLOYMENT.md
```

## Prerequisites

- Node.js v18.19.0 or higher  
- npm or yarn  
- Firebase CLI (for frontend deployment)  
- Google Cloud CLI (for backend deployment)  
- Firebase project with Firestore, Storage, and Authentication enabled

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mmswflow-upb/sudan_embassy.git
cd sudan_embassy
```

### 2. Frontend Setup

```bash
cd client
npm install

cp .env.local.example .env.local
# Configure Firebase and API base URL

npm run dev
# App runs on http://localhost:5173
```

### 3. Backend Setup

```bash
cd server
npm install

cp .env.example .env
# Configure Firebase credentials and bucket

# Add Firebase service account key:
# server/credentials/firebase-sa-key.json

# Optional: seed Firestore
npm run seed

npm start
# API runs on http://localhost:3000
```

## Data Model (Key Collections)

- `consularServices`: consular services with localized fields and optional files  
- `news`: news articles and announcements  
- `alerts`: site-wide alerts (info/warning/error, active flag)  
- `forms`: downloadable forms  
- `appointments`: booked appointments  
- `submissions`: form submissions  
- `settings`: site-wide configuration, contact info, hero, hours, map, etc., with `i18n` subfields

All content that is user-facing uses an `i18n` field (e.g. `en`, `ro`, `ar`) and is resolved based on a `lang` query parameter in the API.

## API Overview

All endpoints are defined under `/api`.

### Public

- `GET /api/settings?lang=en`  
- `GET /api/consular-services?lang=en`  
- `GET /api/consular-services/:id?lang=en`  
- `GET /api/news?lang=en`  
- `GET /api/news/:id?lang=en`  
- `GET /api/alerts?lang=en` (supports `active=true`)  
- `GET /api/forms?lang=en`  
- `POST /api/appointments`  
- `POST /api/submissions` (multipart/form-data)  
- `POST /api/contact`

### Admin (Requires Firebase Authentication token in `Authorization` header)

- CRUD for `consular-services`, `news`, `alerts`, `forms`  
- `PUT /api/settings`  
- `GET /api/appointments`  
- `GET /api/submissions`  
- Auth helpers: `/api/login`, `/api/logout`, `/api/me`

## Internationalization

- Supported languages: English (`en`), Romanian (`ro`), Arabic (`ar`)  
- Frontend translations stored in `client/src/locales/*.json`  
- Content translations stored in Firestore `i18n` objects  
- Settings also support per-language configuration via `settings.i18n`  
- Language preference is saved in `localStorage`, with a language selector in the header

## Deployment (Summary)

### Frontend

```bash
cd client
npm run build
firebase deploy --only hosting
```

### Backend

```bash
cd server
gcloud run deploy sudan-embassy-api   --source .   --platform managed   --region europe-west1   --allow-unauthenticated   --port 8080
```

## Environment Variables

### Frontend (`.env.local` / `.env.production`)

- `VITE_API_BASE_URL` – Backend API URL  
- `VITE_FIREBASE_PROJECT_ID` – Firebase project ID  

### Backend (`.env`)

- `GOOGLE_APPLICATION_CREDENTIALS` – Path to service account key  
- `FIREBASE_BUCKET` – Firebase Storage bucket URL  
- `UPLOAD_DIR` – Local uploads directory  
- `PORT` – Server port  
