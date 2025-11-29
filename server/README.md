# Sudan Embassy Backend

This is the backend API we built for the Sudan Embassy website. It's a Node.js/Express server that handles all the data, file uploads, and admin functionality.

## 👥 Backend Team

- **Zafar Azzam** - API endpoints, database design, file handling
- **Sakka Mohamad-Mario** - Firebase integration, authentication, deployment

## 🚀 Live API

Check it out: [https://sudan-embassy-api-919606479278.europe-west1.run.app](https://sudan-embassy-api-919606479278.europe-west1.run.app)

## ✨ What We Built

Here's what our backend does:

- **RESTful API**: Clean Express.js endpoints for everything the frontend needs
- **Three Languages**: Returns content in English, Romanian, or Arabic based on the request
- **Firebase Integration**: Uses Firestore for the database and Cloud Storage for files
- **File Uploads**: Handles images and PDFs with Multer, stores them in Firebase automatically
- **Authentication**: Firebase Admin SDK secures the admin endpoints
- **CORS Setup**: Properly configured so the frontend can talk to us
- **Sessions**: Cookie-based sessions for keeping admins logged in
- **Smart Cleanup**: When you delete something, it cleans up the associated files too
- **Settings API**: Dynamic configuration so embassy staff can control site behavior
- **Notifications**: Sends emails for contact forms and appointment requests

## 🛠️ Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.21
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Admin SDK 13.0
- **File Upload**: Multer 1.4
- **Environment**: dotenv 16.4
- **CORS**: cors middleware
- **Session**: cookie-session

## 📁 Project Structure

```text
server/
├── credentials/
│   └── firebase-sa-key.json        # Firebase service account (gitignored)
├── uploads/                        # Temporary file upload directory
├── index.js                        # Main Express server
├── firebaseAdmin.js                # Firebase Admin SDK initialization
├── seed.js                         # Database seeding script
├── settings.json                   # Runtime settings cache
├── app.yaml                        # Google Cloud Run configuration
├── Dockerfile                      # Docker containerization
├── .env                            # Environment variables (gitignored)
├── .gitignore                      # Git ignore rules
└── package.json                    # Dependencies and scripts
```

## 🚦 What You Need

- **Node.js** v18.19.0 or higher
- **npm** (comes with Node)
- **Google Cloud CLI** for deploying to Cloud Run
- A **Firebase project** with Firestore and Storage enabled

## 🔧 Getting Started

### 1. Install Everything

```bash
cd server
npm install
```

### 2. Set Up Firebase

1. Head to [Firebase Console](https://console.firebase.google.com/)
2. Pick your project (or create a new one)
3. Turn on **Firestore Database** (use production mode)
4. Turn on **Cloud Storage**

### 3. Get Service Account Credentials

This is important - the server needs these credentials to talk to Firebase:

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file as `server/credentials/firebase-sa-key.json`

**Important**: Never commit this file to git! It's already in `.gitignore`.

### 4. Configure Environment Variables

Create a `.env` file in the `server` folder:

```env
GOOGLE_APPLICATION_CREDENTIALS="./credentials/firebase-sa-key.json"
FIREBASE_BUCKET="gs://your-project-id.firebasestorage.app"
UPLOAD_DIR="./uploads"
PORT=3000
```

### 5. Create Folders

Make sure these directories exist:

```bash
mkdir -p credentials
mkdir -p uploads
```

### 6. Seed the Database (Optional)

Want some test data to work with? Run our seeder:

```bash
npm run seed
```

This creates sample data:

- 2 consular services with translations
- 2 news articles with translations
- 2 alerts with translations
- Site settings with full i18n support

### 7. Run It

```bash
npm start
```

The API is now running at `http://localhost:3000`

## 📝 API Documentation

### Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://sudan-embassy-api-919606479278.europe-west1.run.app`

### Language Support

All content endpoints understand the `lang` query parameter:

- `lang=en` - English (default)
- `lang=ro` - Romanian
- `lang=ar` - Arabic

Example: `/api/news?lang=ro`

---

### Public Endpoints

#### Settings

```http
GET /api/settings?lang=en
```

Get site configuration with translations including:
- Header (phone, email)
- Hero section
- Opening hours
- Status bar messages
- Emergency contacts
- Map coordinates
- Promotional slides

**Response**:
```json
{
  "header": { "phone": "...", "email": "..." },
  "hero": { "title": "...", "subtitle": "...", "cta1": "...", "cta2": "..." },
  "hours": { "monThu": "...", "fri": "..." },
  "statusBar": { "status": "...", "holiday": "...", "nextAppointment": "..." },
  "emergency": { "phone": "...", "note": "..." },
  "contacts": [["icon", "text"], ...],
  "map": { "lat": 44.4467127, "lng": 26.1035968, "placeLink": "..." },
  "promoSlides": {
    "slide1": { "title": "...", "subtitle": "...", "cta": "...", "href": "...", "image": "..." }
  }
}
```

#### Consular Services

```http
GET /api/consular-services?lang=en
```

List all consular services with translations.

**Response**:
```json
[
  {
    "id": "doc-id",
    "icon": "fa-solid fa-passport",
    "image": "https://...",
    "attachmentUrl": "https://...",
    "attachmentType": "image",
    "fileName": "passport.jpg",
    "name": "Passport Renewal",
    "details": "Service details...",
    "createdAt": "2025-11-29T..."
  }
]
```

```http
GET /api/consular-services/:id?lang=en
```

Get specific consular service with translations.

#### News & Announcements

```http
GET /api/news?lang=en
```

List all news articles with translations.

**Response**:
```json
[
  {
    "id": "doc-id",
    "image": "https://...",
    "title": "News Title",
    "summary": "Article summary...",
    "tag": "Update",
    "createdAt": "2025-11-29T..."
  }
]
```

```http
GET /api/news/:id?lang=en
```

Get specific news article with translations.

#### Alerts

```http
GET /api/alerts?lang=en
GET /api/alerts?active=true&lang=en
```

List alerts. Use `active=true` to get only active alerts.

**Response**:
```json
[
  {
    "id": "doc-id",
    "message": "Alert message",
    "level": "info",
    "active": true,
    "createdAt": "2025-11-29T..."
  }
]
```

#### Forms

```http
GET /api/forms?lang=en
```

List all downloadable forms with translations.

**Response**:
```json
[
  {
    "id": "doc-id",
    "name": "Visa Application Form",
    "description": "Form description...",
    "attachmentUrl": "https://...",
    "fileName": "visa-form.pdf",
    "createdAt": "2025-11-29T..."
  }
]
```

#### Appointments

```http
POST /api/appointments
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "service": "Passport Services",
  "date": "2025-12-01",
  "message": "Additional information"
}
```

Book a new appointment. Sends email notification to embassy.

#### Form Submissions

```http
POST /api/submissions
Content-Type: multipart/form-data

name: John Doe
email: john@example.com
phone: +40 123 456 789
message: Message text
file: [binary file data]
```

Submit a form with optional file upload.

#### Contact

```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Contact message"
}
```

Send contact message to embassy email.

---

### Admin Endpoints (Authentication Required)

All admin endpoints require Firebase Authentication token in cookies or `Authorization` header.

#### Authentication

```http
POST /api/login
Content-Type: application/json

{
  "idToken": "firebase-id-token"
}
```

Login with Firebase ID token. Sets session cookie.

```http
POST /api/logout
```

Logout and clear session.

```http
GET /api/me
```

Get current authenticated user info.

#### Content Management - Consular Services

```http
POST /api/consular-services
Content-Type: multipart/form-data

icon: fa-solid fa-passport
i18n: {"en":{"name":"...","details":"..."},"ro":{...},"ar":{...}}
file: [image or PDF file]
```

Create new consular service with translations and optional file.

```http
PUT /api/consular-services/:id
Content-Type: application/json

{
  "icon": "fa-solid fa-passport",
  "i18n": {
    "en": { "name": "Updated Name", "details": "..." },
    "ro": { "name": "...", "details": "..." },
    "ar": { "name": "...", "details": "..." }
  }
}
```

Update existing consular service.

```http
DELETE /api/consular-services/:id
```

Delete consular service and associated files.

#### Content Management - News

```http
POST /api/news
Content-Type: multipart/form-data

i18n: {"en":{"title":"...","summary":"...","tag":"Update"},...}
file: [image file]
```

Create news article with translations.

```http
PUT /api/news/:id
```

Update news article.

```http
DELETE /api/news/:id
```

Delete news article and associated files.

#### Content Management - Alerts

```http
POST /api/alerts
Content-Type: multipart/form-data

level: info|warning|error
active: true|false
i18n: {"en":{"message":"..."},...}
file: [optional image]
```

Create alert with translations.

```http
PUT /api/alerts/:id
```

Update alert.

```http
DELETE /api/alerts/:id
```

Delete alert and associated files.

#### Content Management - Forms

```http
POST /api/forms
Content-Type: multipart/form-data

i18n: {"en":{"name":"...","description":"..."},...}
file: [PDF or image file]
```

Create form with translations.

```http
PUT /api/forms/:id
```

Update form.

```http
DELETE /api/forms/:id
```

Delete form and associated files.

#### Settings Management

```http
PUT /api/settings
Content-Type: application/json

{
  "header": { "phone": "...", "email": "..." },
  "hero": { "title": "...", "subtitle": "...", "cta1": "...", "cta2": "..." },
  "i18n": {
    "en": { "hero": { "title": "..." }, ... },
    "ro": { ... },
    "ar": { ... }
  }
}
```

Update site settings with translations.

#### Data Retrieval

```http
GET /api/appointments
```

List all appointments (admin only).

```http
GET /api/submissions
```

List all form submissions (admin only).

## 🔄 Development Workflow

### Database Schema

All content documents use the following i18n pattern:

```javascript
{
  id: "auto-generated-by-firestore",
  // Common fields
  icon: "fa-solid fa-icon",
  image: "https://storage.url/image.jpg",
  attachmentUrl: "https://storage.url/file.pdf",
  attachmentType: "image" | "pdf",
  fileName: "file-name.ext",
  createdAt: "ISO-8601-timestamp",
  
  // Multilingual content
  i18n: {
    en: {
      name: "English Name",
      details: "English Details",
      // ... other translated fields
    },
    ro: {
      name: "Nume Română",
      details: "Detalii Română",
      // ... other translated fields
    },
    ar: {
      name: "الاسم بالعربية",
      details: "التفاصيل بالعربية",
      // ... other translated fields
    }
  }
}
```

### Adding New Endpoints

1. Define route in `index.js`:
   ```javascript
   app.get("/api/your-endpoint", async (req, res) => {
     const lang = (req.query.lang || "").trim();
     // Implementation
   });
   ```

2. For admin endpoints, add `requireAnyAuth` middleware:
   ```javascript
   app.post("/api/admin-endpoint", requireAnyAuth, async (req, res) => {
     // Implementation
   });
   ```

3. For i18n content, use `resolveI18n` helper:
   ```javascript
   const data = resolveI18n(doc.data(), lang, ["name", "details"]);
   ```

### File Upload Handling

Files are uploaded using Multer and stored in Firebase Storage:

1. **Temporary Storage**: Files first saved to `./uploads/`
2. **Firebase Upload**: Uploaded to Firebase Storage bucket
3. **Public URL**: Generated and stored in Firestore
4. **Cleanup**: Temporary file deleted after upload

### Authentication Flow

1. Client obtains Firebase ID token
2. Sends token to `/api/login`
3. Server verifies token with Firebase Admin SDK
4. Creates session cookie
5. Subsequent requests authenticated via session

## 🚀 Deployment

### Google Cloud Run

```bash
# Build and deploy
gcloud run deploy sudan-embassy-api \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars FIREBASE_BUCKET="gs://your-bucket"
```

### Docker Deployment

```bash
# Build image
docker build -t sudan-embassy-api .

# Run container
docker run -p 8080:8080 \
  -e FIREBASE_BUCKET="gs://your-bucket" \
  sudan-embassy-api
```

### Environment Variables

Set these in your deployment platform:

```env
FIREBASE_BUCKET=gs://your-project-id.firebasestorage.app
PORT=8080
```

The service account is automatically provided by Google Cloud Run.

## 🐛 Troubleshooting

### Issue: Firebase Admin SDK initialization fails

**Solution**:
1. Verify service account file exists at correct path
2. Check `GOOGLE_APPLICATION_CREDENTIALS` environment variable
3. Ensure service account has required permissions

### Issue: File uploads failing

**Solution**:
1. Check `uploads/` directory exists and is writable
2. Verify Firebase Storage bucket name is correct
3. Ensure service account has Storage Object Creator role

### Issue: CORS errors from frontend

**Solution**:
1. Check CORS configuration in `index.js`
2. Add frontend origin to allowed origins
3. Verify credentials are included in requests

### Issue: Authentication not working

**Solution**:
1. Verify Firebase project ID matches
2. Check service account has required permissions
3. Ensure client sends valid ID token

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-restart)
- `npm run seed` - Seed database with sample data

## 🔐 Security Considerations

- **Service Account**: Never commit `firebase-sa-key.json` to git
- **Environment Variables**: Use `.env` for local, platform secrets for production
- **Authentication**: All admin endpoints protected by Firebase Auth
- **File Upload**: Validate file types and sizes
- **CORS**: Configure allowed origins carefully
- **Firestore Rules**: Set appropriate security rules in Firebase Console

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Multer Documentation](https://github.com/expressjs/multer)

## 📄 License

This project is proprietary software developed for the Embassy of the Republic of Sudan in Bucharest, Romania.

## 👥 Support

For technical issues or questions, refer to the main [project README](../README.md) or contact the development team.

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

## 🚀 How We Deploy

We use Google Cloud Run because it scales automatically and we only pay when people use it.

### Deploy to Cloud Run

1. **Install Google Cloud CLI** (if you haven't already)
2. **Login**: `gcloud auth login`
3. **Set your project**: `gcloud config set project your-project-id`
4. **Deploy it**:

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

### Set Environment Variables

After deploying, set the environment variables:

```bash
gcloud run services update sudan-embassy-api \
  --update-env-vars \
  GOOGLE_APPLICATION_CREDENTIALS="./credentials/firebase-sa-key.json",\
  FIREBASE_BUCKET="gs://your-project-id.firebasestorage.app",\
  UPLOAD_DIR="./uploads"
```

## 🔍 Monitoring

### Check the Logs

```bash
gcloud logs read --service=sudan-embassy-api --limit=50
```

### See How It's Performing

```bash
gcloud run services describe sudan-embassy-api --region=europe-west1
```

## 🛡️ Security Stuff

1. **CORS**: We allow specific origins only
2. **File Upload**: Validates file types and sizes
3. **Authentication**: Firebase ID token validation on admin routes
4. **Rate Limiting**: Should add this for production (we haven't yet)
5. **HTTPS**: Cloud Run handles this automatically

## 🐛 Common Problems We Fixed

### Firebase credentials not found?

**Fix**:

- Make sure `firebase-sa-key.json` exists in `credentials/` folder
- Check file permissions

### Upload directory not writable?

**Fix**:

- Make sure `uploads/` directory exists and is writable
- Check folder permissions

### CORS errors?

**Fix**:

- Verify frontend URL is in CORS configuration in `index.js`
- Check browser console for details

### Authentication failures?

**Fix**:

- Verify Firebase project configuration
- Check if token is expired
- Make sure you're using the correct Firebase project ID

### Debug Mode

If something's really broken, turn on debug logging:

```bash
export DEBUG=*
npm start
```

## 📝 Available Commands

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-restarts when you change code)
- `npm run seed` - Seed database with sample data

## 🔐 Security Notes

- **Service Account**: Never commit `firebase-sa-key.json` to git (it's in `.gitignore`)
- **Environment Variables**: Use `.env` locally, platform secrets in production
- **Authentication**: All admin endpoints are protected by Firebase Auth
- **File Upload**: We validate file types and sizes
- **CORS**: Carefully configured allowed origins
- **Firestore Rules**: Set proper security rules in Firebase Console

## 📚 Resources That Helped Us

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Multer Documentation](https://github.com/expressjs/multer)

## 📄 License

This is proprietary software we developed for the Embassy of the Republic of Sudan in Bucharest, Romania.

## 👥 Questions?

Check out the main [project README](../README.md) or reach out to the team!
