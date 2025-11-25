# Sudan Embassy Backend API

Node.js/Express backend API for the Sudan Embassy website. Provides RESTful endpoints for content management, file uploads, and admin functionality.

## 🚀 Live API

- **Production API**: [https://sudan-embassy-api-919606479278.europe-west1.run.app](https://sudan-embassy-api-919606479278.europe-west1.run.app)

## 🛠️ Prerequisites

- **Node.js** v18.19.0 or higher
- **npm** or **yarn**
- **Google Cloud CLI** (for deployment)
- **Firebase project** with Firestore and Storage enabled

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
GOOGLE_APPLICATION_CREDENTIALS="./credentials/firebase-sa-key.json"
FIREBASE_BUCKET="gs://your-project-id.firebasestorage.app"
UPLOAD_DIR="./uploads"
```

### 3. Firebase Service Account Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `server/credentials/firebase-sa-key.json`

### 4. Create Required Directories

```bash
mkdir -p credentials
mkdir -p uploads
```

### 5. Development

```bash
npm start
```

The API will be available at `http://localhost:3000`

### 6. Production Deployment

```bash
# Deploy to Google Cloud Run
gcloud run deploy sudan-embassy-api \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080
```

## 📝 API Endpoints

### Public Endpoints

#### Site Configuration

- `GET /api/settings` - Get site configuration (header, hero, hours, etc.)

#### Consular Services

- `GET /api/consular-services` - List all consular services
- `GET /api/consular-services/:id` - Get specific service details

#### News & Announcements

- `GET /api/news` - List all news articles
- `GET /api/news/:id` - Get specific news article

#### Alerts

- `GET /api/alerts` - List all alerts
- `GET /api/alerts?active=true` - Get only active alerts

#### Forms

- `GET /api/forms` - List all available forms

#### Appointments

- `POST /api/appointments` - Book a new appointment

#### Submissions

- `POST /api/submissions` - Submit forms or documents

#### File Upload

- `POST /api/upload` - Upload files to Firebase Storage

### Admin Endpoints (Authentication Required)

#### Authentication

- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/me` - Get current user info

#### Content Management

- `POST /api/consular-services` - Create new consular service
- `PUT /api/consular-services/:id` - Update consular service
- `DELETE /api/consular-services/:id` - Delete consular service

- `POST /api/news` - Create news article
- `PUT /api/news/:id` - Update news article
- `DELETE /api/news/:id` - Delete news article

- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

- `POST /api/forms` - Upload new form
- `DELETE /api/forms/:id` - Delete form

#### Settings

- `PUT /api/settings` - Update site settings

#### Submissions Management

- `GET /api/submissions` - List all submissions
- `PATCH /api/submissions/:id` - Update submission status

## 🔧 Environment Variables

| Variable                         | Description                                | Required | Example                                  |
| -------------------------------- | ------------------------------------------ | -------- | ---------------------------------------- |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account JSON      | Yes      | `./credentials/firebase-sa-key.json`     |
| `FIREBASE_BUCKET`                | Firebase Storage bucket name               | Yes      | `gs://sudan-embassy.firebasestorage.app` |
| `UPLOAD_DIR`                     | Local directory for temporary file storage | Yes      | `./uploads`                              |
| `PORT`                           | Server port (set by Cloud Run)             | No       | `8080`                                   |
| `NODE_ENV`                       | Environment mode                           | No       | `production`                             |

## 📁 Project Structure

```
server/
├── credentials/           # Firebase service account
│   └── firebase-sa-key.json
├── uploads/              # Temporary file storage
├── index.js              # Main server file
├── firebaseAdmin.js      # Firebase Admin SDK setup
├── package.json          # Dependencies
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore file
└── README.md            # This file
```

## 🔐 Authentication

The API uses Firebase Authentication for admin access:

1. **Public endpoints** are accessible without authentication
2. **Admin endpoints** require Firebase ID token in Authorization header
3. **Token format**: `Authorization: Bearer <firebase-id-token>`

## 📤 File Upload

The API supports file uploads with the following features:

- **Supported formats**: Images (JPG, PNG, GIF), PDFs, documents
- **Storage**: Files are uploaded to Firebase Storage
- **Access**: Files are made publicly accessible
- **Cleanup**: Temporary local files are automatically removed

### Upload Endpoint Usage

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf" \
  -F "folder=forms" \
  http://localhost:3000/api/upload
```

## 🚀 Deployment

### Google Cloud Run Deployment

1. **Install Google Cloud CLI**
2. **Authenticate**: `gcloud auth login`
3. **Set project**: `gcloud config set project your-project-id`
4. **Deploy**:

```bash
gcloud run deploy sudan-embassy-api \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

### Environment Variables in Cloud Run

Set these environment variables in the Cloud Run service:

```bash
gcloud run services update sudan-embassy-api \
  --update-env-vars \
  GOOGLE_APPLICATION_CREDENTIALS="./credentials/firebase-sa-key.json",\
  FIREBASE_BUCKET="gs://your-project-id.firebasestorage.app",\
  UPLOAD_DIR="./uploads"
```

## 🔍 Monitoring & Logs

### View Logs

```bash
gcloud logs read --service=sudan-embassy-api --limit=50
```

### Monitor Performance

```bash
gcloud run services describe sudan-embassy-api --region=europe-west1
```

## 🛡️ Security Considerations

1. **CORS**: Configured to allow specific origins
2. **File Upload**: Validates file types and sizes
3. **Authentication**: Firebase ID token validation
4. **Rate Limiting**: Consider implementing rate limiting for production
5. **HTTPS**: All production traffic is HTTPS

## 🐛 Troubleshooting

### Common Issues

1. **Firebase credentials not found**

   - Ensure `firebase-sa-key.json` exists in `credentials/` directory
   - Check file permissions

2. **Upload directory not writable**

   - Ensure `uploads/` directory exists and is writable
   - Check directory permissions

3. **CORS errors**

   - Verify frontend URL is in CORS configuration
   - Check browser console for specific error details

4. **Authentication failures**
   - Verify Firebase project configuration
   - Check token expiration
   - Ensure correct Firebase project ID

### Debug Mode

Enable debug logging by setting:

```bash
export DEBUG=*
npm start
```

## 📞 Support

For technical support or questions about the backend API, please contact the development team.
