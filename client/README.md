# Sudan Embassy Frontend

This is the frontend part of our Sudan Embassy website project. We built it using React with Vite, and made sure it works smoothly in three languages with a clean, modern design.

## 👥 Frontend Team

- **Al-Khalidy Essam** - UI components, styling, and user experience
- **Sakka Mohamad-Mario** - Architecture, Firebase integration, and deployment

## 🚀 Live Site

Check it out: [https://sudan-embassy.web.app](https://sudan-embassy.web.app)

## ✨ What We Built

Here's what we're most proud of:

- **Three Languages**: Full support for English, Romanian, and Arabic (with proper right-to-left layout for Arabic!)
- **Mobile-First Design**: We designed everything to look perfect on phones first, then scaled up
- **Real-Time Updates**: Using Firebase Firestore, so content updates instantly when someone changes it
- **Admin Portal**: Complete content management system - embassy staff can update everything without coding
- **File Uploads**: Images and PDFs upload straight to Firebase Storage
- **Appointment System**: People can book appointments online instead of calling
- **Modern UI**: Smooth animations, clean design, glass morphism effects - we wanted it to feel premium
- **Secure Auth**: Only authorized users can access the admin panel

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

## 🚦 What You Need

- **Node.js** v18.19.0 or higher
- **npm** (comes with Node)
- **Firebase CLI** for deployment: `npm install -g firebase-tools`
- A **Firebase project** with Authentication, Firestore, and Storage enabled

## 🔧 Getting Started

### 1. Install Everything

```bash
cd client
npm install
```

### 2. Set Up Firebase

1. Head to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or pick an existing one
3. Turn on these services:
   - **Authentication**: Enable sign-in methods (we use Email/Password)
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable Firebase Storage for images and PDFs

### 3. Configure Firebase

1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll down to **Your apps** and click **Add app** → **Web**
3. Register your app and copy the config they give you
4. Put your config in `src/lib/firebase.js`:

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

### 4. Set Up Environment Variables

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

### 5. Run It!

```bash
npm run dev
```

Open your browser to `http://localhost:5173` and you should see the site!

### 6. Build for Production

When you're ready to deploy:

```bash
npm run build
```

Everything you need will be in the `dist/` folder.

## 🚀 How We Deploy

### First Time Setup

```bash
# Login to Firebase
firebase login

# Set up hosting
firebase init hosting
# Pick your Firebase project from the list
# Public directory: dist
# Single-page app: Yes
# GitHub auto-deploy: No
```

### Deploying Updates

```bash
# Build the latest version
npm run build

# Push it live
firebase deploy --only hosting
```

Your site goes live at `https://your-project-id.web.app`

## 🔄 How We Work

### Adding New Pages

1. Create your page component in `src/pages/`
2. Add the route in `src/App.jsx`:
   ```jsx
   <Route path="/your-page" element={<YourPage />} />
   ```
3. Add a nav link in `src/components/Header.jsx`

### Adding Translations

1. Add the text to all three language files:
   - `src/locales/en.json`
   - `src/locales/ro.json`
   - `src/locales/ar.json`

2. Use it in your component:
   ```jsx
   import { useTranslation } from 'react-i18next';
   
   function MyComponent() {
     const { t } = useTranslation();
     return <h1>{t('your.translation.key')}</h1>;
   }
   ```

### Fetching Content from the Backend

Always include the language parameter so you get translations:

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

### Using the Admin Portal

The admin portal is where embassy staff can update content. It's protected by Firebase Authentication:

1. Go to `/admin-login`
2. Sign in with your Firebase credentials
3. Access the dashboard at `/admin`
4. You'll see four sections:
   - **Consular Services** - visa info, passport services, etc.
   - **News & Announcements** - latest updates
   - **Alerts** - urgent notifications
   - **Forms** - downloadable PDF forms

Each section lets you:

- Create: Add new items with translations in all three languages
- Read: View items and switch between languages
- Update: Edit existing items
- Delete: Remove items (cleans up files too)
- File Upload: Attach images or PDFs

### How We Organized the Code

- **Reusable Components**: In `src/components/` - stuff we use everywhere
- **Page Components**: In `src/pages/` - full page views
- **Admin Components**: In `src/components/admin/` - admin portal stuff
- **EditForms**: Centralized edit forms in `EditForms.jsx` so we don't repeat code

### State Management

We keep it simple:

- **Local State**: React `useState` for component stuff
- **Forms**: React Hook Form with Zod validation (keeps forms clean)
- **Authentication**: Firebase Auth handles user state
- **Data Fetching**: useEffect with fetch API
- **Language**: i18next manages which language is active

## 🎨 Styling

### Tailwind Custom Utilities

We added some custom effects to Tailwind:

- `glass`: Glass morphism effect (that frosted glass look)
- `ripple`: Material Design ripple when you click
- `kenburns`: Ken Burns zoom animation
- `bg-blob`: Animated gradient blobs in the background
- `tilt`: 3D tilt effect

### Sudan Colors

We use the colors from the Sudanese flag:

```javascript
colors: {
  'sudan-green': '#007A3D',
  'sudan-blue': '#0051BA',
  'sudan-red': '#D21034',
  'sudan-black': '#111827',
}
```

### Arabic RTL Support

When someone switches to Arabic, the layout flips automatically:

```javascript
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
});
```

## 🐛 Common Problems We Fixed

### API calls not working?

**Fix**: Check that `VITE_API_BASE_URL` in `.env.local` matches your backend URL.

### Firebase authentication issues?

**Fix**:
1. Verify the config in `src/lib/firebase.js`
2. Check Firebase Console → Authentication is enabled
3. Make sure you've set up sign-in methods

### Translations not showing up?

**Fix**:
1. Check all three locale files have the translation keys
2. Verify i18next setup in `src/lib/i18n.js`
3. Make sure you're using `useTranslation()` hook correctly

### Images not loading from Firebase?

**Fix**:
1. Check Firebase Storage rules allow public read access
2. Verify the storage bucket name in Firebase config
3. Make sure files are uploading to the right bucket

### Admin portal won't let you in?

**Fix**:
1. Make sure you're authenticated with Firebase
2. Check route protection in `App.jsx`
3. Verify Firebase Authentication is properly configured

## 📝 Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔐 Security Notes

- Never commit `.env.local` or real Firebase config with credentials to git
- Set up proper Firebase Security Rules for Firestore and Storage
- Admin routes are protected by Firebase Authentication
- API calls to admin endpoints require valid auth tokens

## 📚 Resources That Helped Us

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [i18next Documentation](https://www.i18next.com/)
- [React Router Documentation](https://reactrouter.com/)

## 📄 License

This is proprietary software we developed for the Embassy of the Republic of Sudan in Bucharest, Romania.

## 👥 Questions?

Check out the main [project README](../README.md) or reach out to the team!
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
