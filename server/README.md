# Sudan Embassy Backend

Node.js/Express API for the Sudan Embassy website. Handles all data, file uploads, and admin stuff.

## 👥 Backend Team

- **Zafar Azzam** - API endpoints, database design, file handling
- **Sakka Mohamad-Mario** - Firebase integration, authentication, deployment

## 🚀 Live API

[https://sudan-embassy-api-919606479278.europe-west1.run.app](https://sudan-embassy-api-919606479278.europe-west1.run.app)

## 🛠️ Tech Stack

- Node.js 18+ with Express.js
- Firebase Firestore (database) + Cloud Storage (files)
- Firebase Admin SDK for auth
- Multer for file uploads

## ⚡ Quick Start

```bash
cd server
npm install

# Create .env file
echo 'GOOGLE_APPLICATION_CREDENTIALS="./credentials/firebase-sa-key.json"' > .env
echo 'FIREBASE_BUCKET="gs://your-project.firebasestorage.app"' >> .env
echo 'UPLOAD_DIR="./uploads"' >> .env
echo 'PORT=3000' >> .env

# Get Firebase service account key from Firebase Console → Project Settings → Service Accounts
# Save it as credentials/firebase-sa-key.json

# Create directories
mkdir -p credentials uploads

# Seed database with sample data (optional)
npm run seed

# Start server
npm start
```

Server runs at `http://localhost:3000`

## 📡 Key Endpoints

### Public
- `GET /api/settings?lang=en` - Site settings
- `GET /api/consular-services?lang=en` - Consular services
- `GET /api/news?lang=en` - News articles
- `GET /api/alerts?active=true&lang=en` - Alerts
- `GET /api/forms?lang=en` - Downloadable forms
- `POST /api/appointments` - Book appointment
- `POST /api/contact` - Contact form

### Admin (Auth Required)
- `POST /api/login` - Admin login
- `POST /api/consular-services` - Create service
- `PUT /api/consular-services/:id` - Update service
- `DELETE /api/consular-services/:id` - Delete service
- Same CRUD for `/api/news`, `/api/alerts`, `/api/forms`
- `PUT /api/settings` - Update site settings

All content endpoints support `?lang=en|ro|ar` for multilingual content.

## 🚀 Deploy to Cloud Run

```bash
gcloud run deploy sudan-embassy-api \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_BUCKET="gs://your-bucket"
```

## 🔐 Security

- Never commit `firebase-sa-key.json` (it's in `.gitignore`)
- All admin endpoints require Firebase Authentication
- CORS configured for frontend origin
- Files validated before upload

## 📝 Commands

- `npm start` - Start server
- `npm run dev` - Dev mode with auto-restart
- `npm run seed` - Seed database

