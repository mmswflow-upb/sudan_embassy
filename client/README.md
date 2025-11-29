# Sudan Embassy Frontend

Modern React frontend for the Sudan Embassy website in Bucharest, Romania. Built with Vite, featuring multilingual support (English, Romanian, Arabic), responsive design, and Firebase integration.

## 🚀 Live Demo

- **Production**: [https://sudan-embassy.web.app](https://sudan-embassy.web.app)

## ✨ Features

- **Multilingual Support**: Full i18n with English, Romanian, and Arabic (RTL support)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Content**: Real-time updates from Firebase Firestore
- **Admin Portal**: Content management for services, news, alerts, and forms
- **File Management**: Upload and display images/PDFs from Firebase Storage
- **Appointment Booking**: Public appointment booking system
- **Form Submissions**: Contact forms and document submission
- **Secure Authentication**: Firebase Authentication for admin access
- **Modern UI**: Animations, glass morphism effects, smooth transitions

## 🛠️ Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router v6.28
- **Forms**: React Hook Form 7.54 + Zod validation
- **Internationalization**: i18next 23.16 + react-i18next
- **Authentication**: Firebase Authentication 10.14
- **Database**: Firebase Firestore 10.14
- **Storage**: Firebase Storage 10.14
- **Animations**: AOS (Animate On Scroll)
- **Icons**: Font Awesome

## 📁 Project Structure

```text
client/
├── public/
│   └── images/              # Static images
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin portal components
│   │   │   ├── EditForms.jsx         # Reusable edit form components
│   │   │   ├── ConsularSection.jsx   # Manage consular services
│   │   │   ├── NewsSection.jsx       # Manage news articles
│   │   │   ├── AlertsSection.jsx     # Manage alerts
│   │   │   └── FormsSection.jsx      # Manage forms
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Site footer
│   │   ├── Hero.jsx         # Hero banner with flag animation
│   │   ├── PromoCarousel.jsx # Promotional slides carousel
│   │   ├── Services.jsx     # Services grid display
│   │   ├── News.jsx         # Latest news section
│   │   ├── AlertBar.jsx     # Alert notifications bar
│   │   ├── StatusBar.jsx    # Embassy status (open/closed)
│   │   ├── MapSection.jsx   # Google Maps integration
│   │   ├── Forms.jsx        # Forms listing
│   │   ├── InfoGrids.jsx    # Info cards grid
│   │   ├── AppointCTA.jsx   # Appointment call-to-action
│   │   ├── HelpButton.jsx   # Floating help button
│   │   ├── Upload.jsx       # File upload component
│   │   └── UI.jsx           # Reusable UI components
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx
│   │   ├── ConsularPage.jsx        # List all services
│   │   ├── ConsularDetail.jsx      # Service details
│   │   ├── NewsPage.jsx            # All news
│   │   ├── NewsDetail.jsx          # News article details
│   │   ├── AlertsPage.jsx          # All alerts
│   │   ├── FormsPage.jsx           # Downloadable forms
│   │   ├── AppointmentsPage.jsx    # Book appointment
│   │   ├── ContactPage.jsx         # Contact form
│   │   ├── AboutPage.jsx           # About Sudan overview
│   │   ├── AboutBrief.jsx          # Sudan in brief
│   │   ├── AboutTravel.jsx         # Travel methods
│   │   ├── AboutCulture.jsx        # Sudanese culture
│   │   ├── AboutTourism.jsx        # Tourism attractions
│   │   ├── AboutVisiting.jsx       # Visiting Sudan info
│   │   ├── Admin.jsx               # Admin dashboard
│   │   └── AdminLogin.jsx          # Admin login page
│   ├── lib/                 # Utility libraries
│   │   ├── firebase.js      # Firebase client configuration
│   │   ├── i18n.js         # i18next configuration
│   │   └── storage.js      # Firebase Storage helpers
│   ├── locales/            # Translation files
│   │   ├── en.json         # English translations
│   │   ├── ro.json         # Romanian translations
│   │   └── ar.json         # Arabic translations
│   ├── App.jsx             # Main app component with routes
│   ├── App.css             # Global styles
│   ├── config.js           # API configuration
│   ├── index.css           # Tailwind imports
│   └── main.jsx            # App entry point
├── .env.local              # Local environment variables
├── .env.production         # Production environment variables
├── firebase.json           # Firebase Hosting configuration
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint configuration
└── package.json
```

## 🚦 Prerequisites

- **Node.js** v18.19.0 or higher
- **npm** or **yarn**
- **Firebase CLI** (for deployment): `npm install -g firebase-tools`
- **Firebase project** with Authentication, Firestore, and Storage enabled

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable the following services:
   - **Authentication**: Enable sign-in methods (Email/Password, Google, etc.)
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable Firebase Storage

### 3. Firebase Configuration

1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll to **Your apps** and click **Add app** → **Web**
3. Register your app and copy the Firebase config
4. Update `src/lib/firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 4. Environment Configuration

Create `.env.local` for development:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

Create `.env.production` for production:

```env
VITE_API_BASE_URL=https://your-backend-url.europe-west1.run.app
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 🚀 Deployment to Firebase Hosting

### Initial Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting
# Select your Firebase project
# Set public directory to: dist
# Configure as single-page app: Yes
# Set up automatic builds with GitHub: No
```

### Deploy

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your site will be live at `https://your-project-id.web.app`

## 🔄 Development Workflow

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/your-page" element={<YourPage />} />
   ```
3. Add navigation link in `src/components/Header.jsx`

### Adding Translations

1. Add keys to all locale files:
   - `src/locales/en.json`
   - `src/locales/ro.json`
   - `src/locales/ar.json`

2. Use in components:
   ```jsx
   import { useTranslation } from 'react-i18next';
   
   function MyComponent() {
     const { t } = useTranslation();
     return <h1>{t('your.translation.key')}</h1>;
   }
   ```

### Fetching Translated Content from API

Always pass the `lang` parameter:

```jsx
import { useTranslation } from 'react-i18next';
import { getApiUrl } from '../config.js';

function MyComponent() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    fetch(getApiUrl(`/api/news?lang=${i18n.language}`))
      .then(r => r.json())
      .then(data => setNews(data));
  }, [i18n.language]);
}
```

### Working with Admin Portal

The admin portal is protected by Firebase Authentication:

1. Navigate to `/admin-login`
2. Sign in with Firebase credentials
3. Access dashboard at `/admin`
4. Manage content in four sections:
   - Consular Services
   - News & Announcements
   - Alerts
   - Forms

Each section supports:
- Create: Add new items with i18n translations
- Read: View items with language selector
- Update: Edit existing items
- Delete: Remove items (with file cleanup)
- File Upload: Attach images or PDFs

### Component Architecture

- **Reusable Components**: Located in `src/components/`
- **Page Components**: Located in `src/pages/`
- **Admin Components**: Located in `src/components/admin/`
- **EditForms**: Centralized edit form components in `EditForms.jsx`

### State Management

- **Local State**: React `useState` for component-specific state
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Firebase Auth state
- **Data Fetching**: useEffect with fetch API
- **Language**: i18next manages language state

## 🎨 Styling Guide

### Tailwind CSS Utilities

The project uses custom Tailwind utilities:

- `glass`: Glass morphism effect
- `ripple`: Material Design ripple effect
- `kenburns`: Ken Burns zoom animation
- `bg-blob`: Animated gradient blobs
- `tilt`: 3D tilt effect

### Custom Colors

```javascript
colors: {
  'sudan-green': '#007A3D',
  'sudan-blue': '#0051BA',
  'sudan-red': '#D21034',
  'sudan-black': '#111827',
}
```

### RTL Support

Arabic language automatically applies RTL:

```javascript
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
});
```

## 🐛 Troubleshooting

### Issue: API calls returning 404

**Solution**: Check that `VITE_API_BASE_URL` in `.env.local` matches your backend URL.

### Issue: Firebase authentication not working

**Solution**:
1. Verify Firebase config in `src/lib/firebase.js`
2. Check Firebase Console → Authentication is enabled
3. Ensure sign-in methods are configured

### Issue: Translations not showing

**Solution**:
1. Verify translation keys exist in all locale files
2. Check i18next initialization in `src/lib/i18n.js`
3. Ensure `useTranslation()` hook is used correctly

### Issue: Images not loading from Firebase Storage

**Solution**:
1. Check Firebase Storage rules allow read access
2. Verify storage bucket name in Firebase config
3. Ensure files are uploaded to correct bucket

### Issue: Admin portal not accessible

**Solution**:
1. Verify user is authenticated
2. Check route protection in `App.jsx`
3. Ensure Firebase Authentication is configured

## 📝 Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔐 Security Considerations

- Never commit `.env.local` or Firebase config with real credentials to git
- Use Firebase Security Rules to protect Firestore and Storage
- Admin routes are protected by Firebase Authentication
- API calls to admin endpoints require auth tokens

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [i18next Documentation](https://www.i18next.com/)
- [React Router Documentation](https://reactrouter.com/)

## 📄 License

This project is proprietary software developed for the Embassy of the Republic of Sudan in Bucharest, Romania.

## 👥 Support

For technical issues or questions, refer to the main [project README](../README.md) or contact the development team.
│   ├── images/            # Image files
│   └── index.html         # HTML template
├── src/
│   ├── components/        # React components
│   │   ├── AlertBar.jsx   # Alert notifications
│   │   ├── Footer.jsx     # Footer component
│   │   ├── Forms.jsx      # Forms display
│   │   ├── Header.jsx     # Navigation header
│   │   ├── Hero.jsx       # Hero section
│   │   ├── InfoGrids.jsx  # Info cards
│   │   ├── MapSection.jsx # Map component
│   │   ├── News.jsx       # News display
│   │   ├── Services.jsx   # Services display
│   │   ├── StatusBar.jsx  # Status information
│   │   ├── UI.jsx         # UI components
│   │   └── Upload.jsx     # File upload
│   ├── pages/             # Page components
│   │   ├── AboutPage.jsx  # About page
│   │   ├── Admin.jsx      # Admin panel
│   │   ├── AdminLogin.jsx # Admin login
│   │   ├── AlertsPage.jsx # Alerts page
│   │   ├── AppointmentsPage.jsx # Appointments
│   │   ├── ConsularPage.jsx # Consular services
│   │   ├── ContactPage.jsx # Contact page
│   │   ├── FormsPage.jsx  # Forms page
│   │   ├── HomePage.jsx   # Home page
│   │   └── NewsPage.jsx   # News page
│   ├── lib/               # Library files
│   │   ├── firebase.js    # Firebase configuration
│   │   └── storage.js     # File upload utilities
│   ├── config.js          # API configuration
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── firebase.json          # Firebase hosting config
├── .firebaserc            # Firebase project config
└── README.md             # This file
```

## 🌐 Features

### Core Features

- **Multilingual Support**: English, Romanian, Arabic
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional design
- **Fast Loading**: Optimized with Vite

### Content Features

- **Consular Services**: Service listings and details
- **News & Announcements**: Dynamic content display
- **Alerts System**: Important notifications
- **Forms Download**: PDF forms with submission
- **Appointment Booking**: Online appointment system

### Admin Features

- **Admin Panel**: Content management interface
- **File Upload**: Document and image uploads
- **Content Management**: CRUD operations for all content
- **Settings Management**: Site configuration

### Technical Features

- **Firebase Integration**: Authentication, Firestore, Storage
- **API Integration**: RESTful API communication
- **File Handling**: Upload, download, and display
- **State Management**: React hooks and context
- **Routing**: React Router for navigation

## 🔧 Environment Variables

| Variable                   | Description         | Required | Example                 |
| -------------------------- | ------------------- | -------- | ----------------------- |
| `VITE_API_BASE_URL`        | Backend API URL     | Yes      | `http://localhost:3000` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes      | `sudan-embassy`         |

## 🎨 Styling

The project uses **Tailwind CSS** for styling with custom Sudan-themed colors:

```css
/* Custom colors in index.css */
:root {
  --sudan-green: #0b7a34;
  --sudan-blue: #0033a0;
  --sudan-black: #000000;
  --sudan-red: #d21034;
}
```

## 🔐 Authentication

The frontend uses Firebase Authentication for admin access:

1. **Public pages** are accessible without authentication
2. **Admin panel** requires Firebase login
3. **Token management** is handled automatically

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌍 Internationalization

The app supports multiple languages using `react-i18next`:

- **English** (en) - Default
- **Romanian** (ro)
- **Arabic** (ar) - RTL support

### Adding New Languages

1. Create translation files in `src/locales/`
2. Update language configuration
3. Add language selector in Header component

## 🚀 Performance Optimization

- **Code Splitting**: Automatic with Vite
- **Image Optimization**: WebP format support
- **Lazy Loading**: Components and images
- **Bundle Optimization**: Tree shaking and minification

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Tips

1. **Hot Reload**: Changes are reflected immediately
2. **Error Overlay**: Clear error messages in browser
3. **Source Maps**: Available for debugging
4. **Environment Variables**: Use `.env.local` for local development

## 🚀 Deployment

### Firebase Hosting Deployment

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

### Environment Configuration for Production

Ensure your `.env.production` file has the correct values:

```env
VITE_API_BASE_URL=https://your-backend-url.europe-west1.run.app
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

## 🔍 Troubleshooting

### Common Issues

1. **Environment variables not loading**

   - Ensure variables start with `VITE_`
   - Restart development server after changes

2. **Firebase configuration errors**

   - Verify Firebase project ID
   - Check API keys and configuration

3. **API connection issues**

   - Verify backend URL in environment variables
   - Check CORS configuration on backend

4. **Build errors**
   - Clear `node_modules` and reinstall
   - Check for syntax errors in components

### Debug Mode

Enable debug logging:

```bash
# In browser console
localStorage.setItem('debug', '*')
```

## 📞 Support

For technical support or questions about the frontend, please contact the development team.
