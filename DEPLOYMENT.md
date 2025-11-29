# Sudan Embassy Deployment Guide

## Prerequisites

### Install Required Tools
1. **Node.js 18+**: [Download](https://nodejs.org/)
2. **Firebase CLI**: `npm install -g firebase-tools`
3. **Google Cloud CLI**: [Install gcloud](https://cloud.google.com/sdk/docs/install)

### Authentication
```bash
# Login to Firebase
firebase login

# Login to Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

---

## Backend Deployment (Google Cloud Run)

### Option 1: Deploy with Cloud Run (Recommended)

```bash
cd server

# Build and deploy to Cloud Run
gcloud run deploy sudan-embassy-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1
```

### Option 2: Deploy with App Engine

```bash
cd server

# Deploy to App Engine
gcloud app deploy app.yaml
```

### Set Environment Variables (Secrets)

Use Secret Manager for sensitive data:

```bash
# Create secrets
echo -n "your-smtp-password" | gcloud secrets create smtp-pass --data-file=-
echo -n "your-smtp-user@gmail.com" | gcloud secrets create smtp-user --data-file=-

# Grant access to Cloud Run service
gcloud secrets add-iam-policy-binding smtp-pass \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT@YOUR_PROJECT.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Update CORS Origins

After deploying frontend, update the backend CORS_ORIGINS environment variable:

```bash
gcloud run services update sudan-embassy-api \
  --set-env-vars CORS_ORIGINS="https://your-app.web.app,https://your-app.firebaseapp.com"
```

---

## Frontend Deployment (Firebase Hosting)

```bash
cd client

# Install dependencies
npm install

# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Set Environment Variables

Create `.env.production` in the client folder:

```env
VITE_API_URL=https://your-backend-url.run.app
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important**: Update `client/src/config.js` with your backend API URL:
```javascript
export const API_URL = 'https://your-backend-url.run.app';
```

---

## Post-Deployment Steps

### 1. Test Backend Health
```bash
curl https://your-backend-url.run.app/health
```

### 2. Test Frontend
Visit: `https://your-app.web.app`

### 3. Update Firebase Security Rules
Ensure Firestore and Storage rules are properly configured in Firebase Console.

### 4. Set Up Custom Domain (Optional)
- **Frontend**: Firebase Hosting → Connect custom domain
- **Backend**: Cloud Run → Map custom domain

---

## Monitoring & Logs

### Backend Logs (Cloud Run)
```bash
gcloud run services logs read sudan-embassy-api --limit 50
```

### Frontend Logs
View in Firebase Console → Hosting → Usage tab

---

## CI/CD Setup (Optional)

### GitHub Actions for Backend
Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to Cloud Run

on:
  push:
    branches: [main]
    paths:
      - 'server/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: sudan-embassy-api
          region: us-central1
          source: ./server
```

### GitHub Actions for Frontend
Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to Firebase

on:
  push:
    branches: [main]
    paths:
      - 'client/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd client && npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: your-project-id
```

---

## Troubleshooting

### Backend Issues
- Check Cloud Run logs: `gcloud run services logs read sudan-embassy-api`
- Verify environment variables are set correctly
- Ensure service account has proper permissions for Firebase Admin SDK

### Frontend Issues
- Clear build cache: `rm -rf client/dist client/node_modules && cd client && npm install && npm run build`
- Verify API_URL in config.js points to correct backend
- Check browser console for CORS errors

### CORS Errors
Update backend CORS_ORIGINS to include your Firebase Hosting URLs.

---

## Cost Optimization

- Cloud Run: Set `--min-instances 0` to scale to zero when idle
- Firebase Hosting: Use CDN caching (already configured)
- Firestore: Set up proper indexes for query optimization
- Storage: Enable lifecycle policies to auto-delete old files

---

## Security Checklist

- ✅ Environment variables stored in Secret Manager
- ✅ Firebase credentials NOT committed to git
- ✅ CORS configured to only allow your domains
- ✅ Cloud Run service uses non-root user
- ✅ Firestore security rules properly configured
- ✅ Storage security rules properly configured
- ✅ Admin authentication enabled

---

## Quick Reference

```bash
# Backend Deploy
cd server && gcloud run deploy sudan-embassy-api --source .

# Frontend Deploy
cd client && npm run build && firebase deploy --only hosting

# View Backend Logs
gcloud run services logs read sudan-embassy-api --limit 50

# Update Backend Environment
gcloud run services update sudan-embassy-api --set-env-vars KEY=VALUE
```
