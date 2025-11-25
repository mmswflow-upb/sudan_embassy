# Sudan Embassy Website

A modern, multilingual website for the Embassy of the Republic of Sudan in Bucharest, Romania. Built with React (frontend) and Node.js/Express (backend), featuring Firebase integration for authentication, storage, and database.

## 🚀 Live Demo

- **Frontend**: [https://sudan-embassy.web.app](https://sudan-embassy.web.app)
- **Backend API**: [https://sudan-embassy-api-919606479278.europe-west1.run.app](https://sudan-embassy-api-919606479278.europe-west1.run.app)

## 📁 Project Structure

```
sudan_embassy/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Firebase configuration
│   │   └── config.js      # API configuration
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Backend Node.js/Express API
│   ├── credentials/       # Firebase service account
│   ├── uploads/          # File upload directory
│   ├── index.js          # Main server file
│   └── package.json
└── README.md
```

## 🛠️ Prerequisites

- **Node.js** v18.19.0 or higher
- **npm** or **yarn**
- **Firebase CLI** (for deployment)
- **Google Cloud CLI** (for backend deployment)
- **Firebase project** with Firestore and Storage enabled

## 🔧 Frontend Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

For production, create a `.env.production` file:

```env
VITE_API_BASE_URL=https://your-backend-url.europe-west1.run.app
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

### 3. Firebase Configuration

1. Go to your Firebase Console
2. Add a web app to your project
3. Copy the Firebase config and update `client/src/lib/firebase.js`

### 4. Development

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

### 6. Deploy to Firebase Hosting

```bash
firebase login
firebase init hosting
firebase deploy --only hosting
```

## 🔧 Backend Setup

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

### 3. Firebase Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key
3. Save the JSON file as `server/credentials/firebase-sa-key.json`

### 4. Development

```bash
npm start
```

The API will be available at `http://localhost:3000`

### 5. Deploy to Google Cloud Run

```bash
# Build and deploy
gcloud run deploy sudan-embassy-api \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080
```

## 🌐 Features

### Frontend Features

- **Multilingual Support**: English, Romanian, Arabic
- **Responsive Design**: Mobile-first approach
- **Consular Services**: Service listings and details
- **News & Announcements**: Dynamic content management
- **Appointment Booking**: Online appointment system
- **Forms Download**: PDF forms with submission
- **Admin Panel**: Content management interface
- **File Upload**: Document submission system

### Backend Features

- **RESTful API**: Express.js server
- **Firebase Integration**: Authentication, Firestore, Storage
- **File Upload**: Multer middleware with Firebase Storage
- **CORS Support**: Cross-origin resource sharing
- **Environment Configuration**: Flexible deployment settings
- **Admin Authentication**: Secure admin access

## 🔐 Admin Access

1. Access the admin panel at `/admin`
2. Use Firebase Authentication to log in
3. Manage content through the admin interface

## 📝 API Endpoints

### Public Endpoints

- `GET /api/settings` - Site configuration
- `GET /api/consular-services` - List consular services
- `GET /api/news` - News and announcements
- `GET /api/alerts` - Active alerts
- `GET /api/forms` - Available forms
- `POST /api/appointments` - Book appointments
- `POST /api/submissions` - Submit forms/documents

### Admin Endpoints (Authentication Required)

- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/me` - Current user info
- `POST /api/consular-services` - Create service
- `POST /api/news` - Create news
- `POST /api/alerts` - Create alert
- `POST /api/forms` - Upload form
- `PUT /api/settings` - Update settings

## 🚀 Deployment

### Frontend Deployment (Firebase Hosting)

```bash
cd client
npm run build
firebase deploy --only hosting
```

### Backend Deployment (Google Cloud Run)

```bash
cd server
gcloud run deploy sudan-embassy-api \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080
```

## 🔧 Environment Variables Reference

### Frontend (.env.local / .env.production)

| Variable                   | Description         | Example                 |
| -------------------------- | ------------------- | ----------------------- |
| `VITE_API_BASE_URL`        | Backend API URL     | `http://localhost:3000` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `sudan-embassy`         |

### Backend (.env)

| Variable                         | Description                   | Example                                  |
| -------------------------------- | ----------------------------- | ---------------------------------------- |
| `GOOGLE_APPLICATION_CREDENTIALS` | Firebase service account path | `./credentials/firebase-sa-key.json`     |
| `FIREBASE_BUCKET`                | Firebase Storage bucket       | `gs://sudan-embassy.firebasestorage.app` |
| `UPLOAD_DIR`                     | Local upload directory        | `./uploads`                              |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for the Embassy of the Republic of Sudan.

## 📞 Support

For technical support or questions, please contact the development team.
