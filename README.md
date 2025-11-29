# Sudan Embassy Website

A modern, multilingual website for the Embassy of the Republic of Sudan in Bucharest, Romania. Built with React (frontend) and Node.js/Express (backend), featuring Firebase integration for authentication, storage, and database.

## 🚀 Live Demo

- **Frontend**: [https://sudan-embassy.web.app](https://sudan-embassy.web.app)
- **Backend API**: [https://sudan-embassy-api-919606479278.europe-west1.run.app](https://sudan-embassy-api-919606479278.europe-west1.run.app)

## ✨ Key Features

- **Multilingual Support**: Full internationalization (i18n) in English, Romanian, and Arabic with RTL support
- **Content Management**: Admin portal for managing consular services, news, alerts, and forms
- **File Management**: Upload and manage documents, images, and PDFs with Firebase Storage
- **Appointment Booking**: Public-facing appointment booking system
- **Form Submissions**: Contact forms and custom form submissions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Firebase Firestore for real-time data synchronization
- **Secure Authentication**: Firebase Authentication for admin access
- **Cloud Deployment**: Frontend on Firebase Hosting, Backend on Google Cloud Run

## 📁 Project Structure

```
sudan_embassy/
├── client/                        # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── admin/           # Admin portal components
│   │   │   │   ├── EditForms.jsx      # Edit form components
│   │   │   │   ├── ConsularSection.jsx
│   │   │   │   ├── NewsSection.jsx
│   │   │   │   ├── AlertsSection.jsx
│   │   │   │   └── FormsSection.jsx
│   │   │   ├── Header.jsx        # Navigation header
│   │   │   ├── Footer.jsx        # Site footer
│   │   │   ├── Hero.jsx          # Hero banner
│   │   │   ├── PromoCarousel.jsx # Promotional slides
│   │   │   ├── Services.jsx      # Services grid
│   │   │   ├── News.jsx          # News section
│   │   │   ├── MapSection.jsx    # Google Maps integration
│   │   │   └── ...               # Other components
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ConsularPage.jsx
│   │   │   ├── ConsularDetail.jsx
│   │   │   ├── NewsPage.jsx
│   │   │   ├── NewsDetail.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AboutBrief.jsx
│   │   │   ├── AboutTravel.jsx
│   │   │   ├── AboutCulture.jsx
│   │   │   ├── AboutTourism.jsx
│   │   │   ├── AboutVisiting.jsx
│   │   │   ├── Admin.jsx          # Admin dashboard
│   │   │   └── AdminLogin.jsx
│   │   ├── lib/                   # Utility libraries
│   │   │   ├── firebase.js        # Firebase client config
│   │   │   ├── i18n.js           # i18next configuration
│   │   │   └── storage.js        # Firebase Storage helpers
│   │   ├── locales/              # Translation files
│   │   │   ├── en.json           # English translations
│   │   │   ├── ro.json           # Romanian translations
│   │   │   └── ar.json           # Arabic translations
│   │   ├── config.js             # API base URL configuration
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # App entry point
│   ├── public/                   # Static assets
│   │   └── images/               # Image assets
│   ├── firebase.json             # Firebase Hosting config
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   └── package.json
├── server/                        # Backend Node.js/Express API
│   ├── credentials/              # Firebase service account keys
│   │   └── firebase-sa-key.json  # Service account (gitignored)
│   ├── uploads/                  # Temporary file upload directory
│   ├── index.js                  # Main server file
│   ├── firebaseAdmin.js          # Firebase Admin SDK setup
│   ├── seed.js                   # Database seeding script
│   ├── settings.json             # Site settings (runtime)
│   ├── app.yaml                  # Google Cloud Run config
│   ├── Dockerfile                # Docker configuration
│   └── package.json
├── DEPLOYMENT.md                 # Deployment documentation
└── README.md                     # This file
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: i18next with react-i18next
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Animations**: AOS (Animate On Scroll)

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **File Upload**: Multer middleware
- **Authentication**: Firebase Admin SDK
- **CORS**: CORS middleware
- **Environment**: dotenv

### Deployment
- **Frontend**: Firebase Hosting
- **Backend**: Google Cloud Run
- **CI/CD**: Firebase CLI & Google Cloud CLI

## 🚦 Prerequisites

- **Node.js** v18.19.0 or higher
- **npm** or **yarn**
- **Firebase CLI** (for frontend deployment)
- **Google Cloud CLI** (for backend deployment)
- **Firebase project** with Firestore, Storage, and Authentication enabled

## 📋 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mmswflow-upb/sudan_embassy.git
cd sudan_embassy
```

### 2. Frontend Setup

```bash
cd client
npm install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local with your Firebase project ID and API URL

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Backend Setup

```bash
cd server
npm install

# Create environment file
cp .env.example .env
# Edit .env with your Firebase credentials

# Add Firebase service account
# Download from Firebase Console → Project Settings → Service Accounts
# Save as server/credentials/firebase-sa-key.json

# Seed the database (optional)
npm run seed

# Start server
npm start
```

The API will be available at `http://localhost:3000`

## 🔄 Development Workflow

### Frontend Development

1. **Component Structure**: Components are organized by feature in `client/src/components/`
   - `admin/` - Admin-specific components
   - Shared components (Header, Footer, Hero, etc.)

2. **Page Routes**: All pages are in `client/src/pages/`
   - Public pages (HomePage, NewsPage, ConsularPage, etc.)
   - Admin pages (Admin, AdminLogin)

3. **Internationalization**: 
   - Add translations to `client/src/locales/*.json`
   - Use `useTranslation()` hook in components
   - Support for RTL languages (Arabic)

4. **API Integration**:
   - Configure base URL in `client/src/config.js`
   - All API calls should use `getApiUrl()` helper
   - Pass `lang` query parameter for i18n content

### Backend Development

1. **API Endpoints**: All routes defined in `server/index.js`
   - Public endpoints (no auth required)
   - Admin endpoints (Firebase auth required)

2. **Data Model**: Firestore collections
   - `consularServices` - Consular service offerings
   - `news` - News articles and announcements
   - `alerts` - System alerts and notifications
   - `forms` - Downloadable forms
   - `appointments` - Appointment bookings
   - `submissions` - Form submissions
   - `settings` - Site-wide configuration

3. **Internationalization**:
   - All content has `i18n` field with translations
   - `resolveI18n()` helper merges language-specific content
   - API accepts `lang` query parameter (en, ro, ar)

4. **File Management**:
   - Uploads handled by Multer
   - Files stored in Firebase Storage
   - Automatic cleanup on document deletion

### Database Schema

#### Consular Services
```javascript
{
  id: "auto-generated",
  icon: "fa-solid fa-passport",
  image: "https://...",
  attachmentUrl: "https://...",
  attachmentType: "image|pdf",
  fileName: "passport.jpg",
  createdAt: "2025-11-29T...",
  i18n: {
    en: { name: "...", details: "..." },
    ro: { name: "...", details: "..." },
    ar: { name: "...", details: "..." }
  }
}
```

#### News Articles
```javascript
{
  id: "auto-generated",
  image: "https://...",
  attachmentUrl: "https://...",
  attachmentType: "image|pdf",
  fileName: "article.jpg",
  createdAt: "2025-11-29T...",
  i18n: {
    en: { title: "...", summary: "...", tag: "Update" },
    ro: { title: "...", summary: "...", tag: "Actualizare" },
    ar: { title: "...", summary: "...", tag: "تحديث" }
  }
}
```

#### Alerts
```javascript
{
  id: "auto-generated",
  level: "info|warning|error",
  active: true|false,
  attachmentUrl: "https://...",
  attachmentType: "image|pdf",
  fileName: "alert.jpg",
  createdAt: "2025-11-29T...",
  i18n: {
    en: { message: "..." },
    ro: { message: "..." },
    ar: { message: "..." }
  }
}
```

#### Settings
```javascript
{
  header: { phone: "...", email: "..." },
  receiveEmail: "embassy@...",
  address: "...",
  hero: { title: "...", subtitle: "...", cta1: "...", cta2: "..." },
  hours: { monThu: "9:00 AM - 4:00 PM", fri: "9:00 AM - 1:00 PM" },
  statusBar: { status: "...", holiday: "...", nextAppointment: "..." },
  emergency: { phone: "...", note: "..." },
  contacts: [["icon", "text"], ...],
  map: { lat: 44.4467127, lng: 26.1035968, placeLink: "..." },
  promoSlides: {
    slide1: { title: "...", subtitle: "...", cta: "...", href: "...", image: "..." },
    slide2: { ... }
  },
  i18n: {
    en: { address: "...", hero: {...}, hours: {...}, ... },
    ro: { ... },
    ar: { ... }
  }
}
```

## 📝 API Documentation

### Public Endpoints

#### Settings
- `GET /api/settings?lang=en` - Get site configuration with translations

#### Consular Services
- `GET /api/consular-services?lang=en` - List all services with translations
- `GET /api/consular-services/:id?lang=en` - Get specific service

#### News
- `GET /api/news?lang=en` - List all news articles with translations
- `GET /api/news/:id?lang=en` - Get specific news article

#### Alerts
- `GET /api/alerts?lang=en` - List all alerts
- `GET /api/alerts?active=true&lang=en` - Get only active alerts

#### Forms
- `GET /api/forms?lang=en` - List all forms

#### Appointments
- `POST /api/appointments` - Book appointment
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "service": "Passport Services",
    "date": "2025-12-01",
    "message": "Additional info"
  }
  ```

#### Submissions
- `POST /api/submissions` - Submit form (multipart/form-data)

#### Contact
- `POST /api/contact` - Send contact message
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello..."
  }
  ```

### Admin Endpoints (Authentication Required)

All admin endpoints require Firebase Authentication token in the `Authorization` header.

#### Authentication
- `POST /api/login` - Login with Firebase token
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user info

#### Content Management
- `POST /api/consular-services` - Create service (multipart/form-data)
- `PUT /api/consular-services/:id` - Update service
- `DELETE /api/consular-services/:id` - Delete service

- `POST /api/news` - Create news article (multipart/form-data)
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

- `POST /api/alerts` - Create alert (multipart/form-data)
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

- `POST /api/forms` - Create form (multipart/form-data)
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

#### Settings
- `PUT /api/settings` - Update site settings

#### Data Management
- `GET /api/appointments` - List all appointments
- `GET /api/submissions` - List all submissions

## 🔐 Authentication & Authorization

### Admin Access

1. Navigate to `/admin-login`
2. Sign in with Firebase Authentication (Google, Email/Password, etc.)
3. Only authenticated users can access `/admin` dashboard
4. All admin API endpoints require valid Firebase auth token

### Setting Up Admin Users

```bash
# In Firebase Console:
# 1. Go to Authentication → Users
# 2. Add user manually or use Authentication methods
# 3. Users can then login through /admin-login page
```

## 🌍 Internationalization (i18n)

### Supported Languages

- **English (en)** - Default language
- **Romanian (ro)** - Secondary language
- **Arabic (ar)** - RTL support enabled

### Adding Translations

1. **Frontend translations**: Edit `client/src/locales/*.json`
   ```json
   {
     "nav": {
       "home": "Home"
     }
   }
   ```

2. **Backend content**: Use `i18n` field in Firestore documents
   ```javascript
   {
     i18n: {
       en: { title: "News Title" },
       ro: { title: "Titlu Știri" },
       ar: { title: "عنوان الأخبار" }
     }
   }
   ```

3. **Settings translations**: Add to `settings.i18n` in Firestore
   ```javascript
   {
     i18n: {
       en: { hero: { title: "Embassy of Sudan" } },
       ro: { hero: { title: "Ambasada Sudanului" } },
       ar: { hero: { title: "سفارة السودان" } }
     }
   }
   ```

### Language Switching

Language preference is stored in `localStorage` and applied across the entire application. The language selector is available in the header.

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

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

## 🧪 Testing & Development

### Seeding the Database

```bash
cd server
npm run seed
```

This will populate Firestore with sample data including:
- 2 consular services
- 2 news articles
- 2 alerts
- Site settings with all translations

### Environment Variables

#### Frontend (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_PROJECT_ID=your-project-id
```

#### Backend (`.env`)
```env
GOOGLE_APPLICATION_CREDENTIALS="./credentials/firebase-sa-key.json"
FIREBASE_BUCKET="gs://your-project-id.firebasestorage.app"
UPLOAD_DIR="./uploads"
PORT=3000
```

## 🐛 Troubleshooting

### Frontend Issues

**Issue**: API calls failing with CORS errors
- **Solution**: Check that backend URL is correct in `.env.local`
- Ensure backend has CORS enabled for frontend origin

**Issue**: Firebase auth not working
- **Solution**: Verify Firebase config in `client/src/lib/firebase.js`
- Check Firebase Console → Authentication is enabled

### Backend Issues

**Issue**: Firebase Admin SDK errors
- **Solution**: Verify service account key exists at correct path
- Check `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

**Issue**: File uploads failing
- **Solution**: Ensure `uploads/` directory exists and is writable
- Check Firebase Storage bucket name is correct

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [i18next Documentation](https://www.i18next.com/)

## 📄 License

This project is proprietary software developed for the Embassy of the Republic of Sudan in Bucharest, Romania.

## 👥 Contributors

- Development Team: [mmswflow-upb](https://github.com/mmswflow-upb)

## 📞 Support

For technical support or questions, please contact the development team or refer to the documentation in individual README files:
- Frontend: [client/README.md](./client/README.md)
- Backend: [server/README.md](./server/README.md)
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
