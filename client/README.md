# Sudan Embassy Frontend

Modern React frontend for the Sudan Embassy website. Built with Vite, featuring multilingual support, responsive design, and Firebase integration.

## 🚀 Live Demo

- **Production**: [https://sudan-embassy.web.app](https://sudan-embassy.web.app)

## 🛠️ Prerequisites

- **Node.js** v18.19.0 or higher
- **npm** or **yarn**
- **Firebase CLI** (for deployment)
- **Firebase project** with Authentication, Firestore, and Storage enabled

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `client` directory for development:

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

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **General**
4. Scroll down to **Your apps** section
5. Click **Add app** → **Web**
6. Copy the Firebase config and update `src/lib/firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
```

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
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## 📁 Project Structure

```
client/
├── public/                 # Static assets
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
