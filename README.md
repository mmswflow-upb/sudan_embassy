# Sudan Embassy Website

Hey! This is our team project for the Embassy of the Republic of Sudan in Bucharest, Romania. We built this from scratch as a modern, multilingual website using React for the frontend and Node.js/Express for the backend, with Firebase handling authentication, storage, and the database.

## 👥 Our Team

- **Sakka Mohamad-Mario** - Frontend, Backend, and Deployment
- **Zafar Azzam** - Backend Development  
- **Al-Khalidy Essam** - Frontend Development

## 🚀 Live Demo

- **Frontend**: [https://sudan-embassy.web.app](https://sudan-embassy.web.app)
- **Backend API**: [https://sudan-embassy-api-919606479278.europe-west1.run.app](https://sudan-embassy-api-919606479278.europe-west1.run.app)

## ✨ What We Built

We wanted to create something really useful for the embassy, so here's what we included:

- **Multilingual Support**: The whole site works in English, Romanian, and Arabic (with proper RTL support for Arabic!)
- **Content Management**: We built an admin portal where embassy staff can easily manage services, news, alerts, and forms without touching any code
- **File Management**: Upload documents, images, and PDFs - everything gets stored securely in Firebase Storage
- **Appointment Booking**: People can book appointments online instead of having to call
- **Form Submissions**: Contact forms and custom form submissions that go straight to the embassy
- **Responsive Design**: Works perfectly on phones, tablets, and desktops - we made sure of that
- **Real-time Updates**: Using Firebase Firestore, so content updates instantly
- **Secure Authentication**: Only authorized staff can access the admin panel
- **Cloud Deployment**: We deployed the frontend on Firebase Hosting and the backend on Google Cloud Run

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

## 📋 Getting Started

Want to run this locally? Here's how we set it up:

### 1. Clone the Repository

```bash
git clone https://github.com/mmswflow-upb/sudan_embassy.git
cd sudan_embassy
```

### 2. Frontend Setup

```bash
cd client
npm install

# Create your environment file
cp .env.local.example .env.local
# Edit .env.local with your Firebase project ID and API URL

# Start the dev server
npm run dev
```

You'll see the frontend at `http://localhost:5173`

### 3. Backend Setup

```bash
cd server
npm install

# Set up your environment
cp .env.example .env
# Edit .env with your Firebase credentials

# Add Firebase service account key
# Download it from Firebase Console → Project Settings → Service Accounts
# Save it as server/credentials/firebase-sa-key.json

# Seed the database with some sample data (optional but helpful)
npm run seed

# Fire up the server
npm start
```

The API will be running at `http://localhost:3000`

## 🔄 How We Organized Everything

### Frontend Development (Essam & Mario)

1. **Component Structure**: We organized components by feature in `client/src/components/`
   - `admin/` - Everything for the admin portal
   - Shared components like Header, Footer, Hero, etc.

2. **Page Routes**: All pages live in `client/src/pages/`
   - Public pages (HomePage, NewsPage, ConsularPage, etc.)
   - Admin pages (Admin dashboard, AdminLogin)

3. **Internationalization**: 
   - We put all translations in `client/src/locales/*.json` files
   - Use the `useTranslation()` hook in components
   - Arabic gets RTL support automatically

4. **API Integration**:
   - Set the base URL in `client/src/config.js`
   - Always use `getApiUrl()` helper for API calls
   - Don't forget to pass the `lang` query parameter for multilingual content

### Backend Development (Azzam & Mario)

1. **API Endpoints**: Everything's defined in `server/index.js`
   - Public endpoints (anyone can access)
   - Admin endpoints (need Firebase auth)

2. **Data Model**: We use these Firestore collections
   - `consularServices` - All the services the embassy offers
   - `news` - News articles and announcements
   - `alerts` - Important alerts and notifications
   - `forms` - Downloadable forms
   - `appointments` - Appointment bookings
   - `submissions` - Form submissions from users
   - `settings` - Site-wide configuration

3. **Internationalization**:
   - Every piece of content has an `i18n` field with translations
   - The `resolveI18n()` helper merges language-specific content
   - API accepts `lang` query parameter (en, ro, ar)

4. **File Management**:
   - We use Multer to handle uploads
   - Files get stored in Firebase Storage
   - When you delete something, we automatically clean up the associated files

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

## 🌍 How We Handled Multiple Languages

### Supported Languages

- **English (en)** - Default language
- **Romanian (ro)** - For Romanian speakers
- **Arabic (ar)** - With full RTL support

### Adding Translations

When we add new text, we have to update it in three places:

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

We save the language preference in `localStorage` so it persists across sessions. The language selector is in the header.

## 🚀 How We Deployed Everything

We wrote detailed deployment instructions in [DEPLOYMENT.md](./DEPLOYMENT.md), but here's the quick version:

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

## 🐛 Common Issues We Ran Into

### Frontend Issues

**Problem**: API calls fail with CORS errors
- **Fix**: Double-check the backend URL in `.env.local`
- Make sure the backend has CORS enabled for your frontend origin

**Problem**: Firebase authentication not working
- **Fix**: Verify the Firebase config in `client/src/lib/firebase.js`
- Check that Authentication is enabled in Firebase Console

### Backend Issues

**Problem**: Firebase Admin SDK errors
- **Fix**: Make sure the service account key file exists at the right path
- Check `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

**Problem**: File uploads failing
- **Fix**: Make sure the `uploads/` directory exists and is writable
- Verify the Firebase Storage bucket name is correct

## 📚 Resources We Found Helpful

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [i18next Documentation](https://www.i18next.com/)

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

## 📄 License

This is proprietary software we developed for the Embassy of the Republic of Sudan in Bucharest, Romania.

## 👥 The Team

We're a team of students who worked together on this project:
- **Sakka Mohamad-Mario** - Led frontend and backend development, handled all deployment
- **Zafar Azzam** - Focused on backend architecture and API development
- **Al-Khalidy Essam** - Worked on frontend components and user interface

Feel free to check out our work on [GitHub](https://github.com/mmswflow-upb)

## 📞 Questions?

If you need help or have questions about the project, you can:
- Check out the detailed docs in individual README files:
  - Frontend: [client/README.md](./client/README.md)
  - Backend: [server/README.md](./server/README.md)
- Reach out to any of us on the team
