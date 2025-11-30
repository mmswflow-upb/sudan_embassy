# Sudan Embassy Frontend

React + Vite frontend for the Sudan Embassy website with multilingual support (English, Romanian, Arabic).

## 👥 Frontend Team

- **Al-Khalidy Essam** - UI components, styling, user experience
- **Sakka Mohamad-Mario** - Architecture, Firebase integration, deployment

## 🚀 Live Site

[https://sudan-embassy.web.app](https://sudan-embassy.web.app)

## 🛠️ Tech Stack

- React 18.3 with Vite 5.4
- Tailwind CSS for styling
- React Router v6 for navigation
- i18next for multilingual support (en, ro, ar with RTL)
- Firebase (Authentication, Firestore, Storage)
- React Hook Form + Zod validation

## ⚡ Quick Start

```bash
cd client
npm install

# Create .env.local
echo 'VITE_API_BASE_URL=http://localhost:3000' > .env.local
echo 'VITE_FIREBASE_PROJECT_ID=your-project-id' >> .env.local

# Update Firebase config in src/lib/firebase.js with your credentials

# Run it
npm run dev
```

Opens at `http://localhost:5173`

## 🚀 Deploy

```bash
# First time setup
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy --only hosting
```

## 📝 Key Features

- **Multilingual**: Switch between English, Romanian, and Arabic (auto RTL)
- **Admin Portal**: Full content management system at `/admin`
- **Real-time Updates**: Firebase Firestore sync
- **File Uploads**: Images and PDFs to Firebase Storage
- **Appointment Booking**: Online appointment system
- **Mobile-First**: Responsive design with Tailwind

## 🎨 Custom Styles

We use Sudan flag colors:

```javascript
colors: {
  'sudan-green': '#007A3D',
  'sudan-blue': '#0051BA',
  'sudan-red': '#D21034',
  'sudan-black': '#111827',
}
```

Custom Tailwind utilities: `glass`, `ripple`, `kenburns`, `bg-blob`, `tilt`

## 🔐 Admin Access

1. Go to `/admin-login`
2. Sign in with Firebase
3. Manage content at `/admin`:
   - Consular Services
   - News & Announcements
   - Alerts
   - Forms

## 📝 Commands

- `npm run dev` - Dev server (port 5173)
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - ESLint

## 🔧 Common Issues

**API not working?** Check `VITE_API_BASE_URL` in `.env.local`

**Firebase auth issues?** Verify config in `src/lib/firebase.js` and enable Authentication in Firebase Console

**Translations missing?** Make sure keys exist in all three files: `src/locales/en.json`, `ro.json`, `ar.json`

