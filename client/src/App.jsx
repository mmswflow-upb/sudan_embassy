import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import AlertBar from './components/AlertBar'
import StatusBar from './components/StatusBar'
import Hero from './components/Hero'
import Services from './components/Services'
import News from './components/News'
import InfoGrids from './components/InfoGrids'
import Forms from './components/Forms'
import MapSection from './components/MapSection'
import Footer from './components/Footer'
import HelpButton from './components/HelpButton'
import AppointCTA from './components/AppointCTA'
import HomePage from './pages/HomePage'
import ConsularPage from './pages/ConsularPage'
import AppointmentsPage from './pages/AppointmentsPage'
import NewsPage from './pages/NewsPage'
import AboutPage from './pages/AboutPage'
import AboutBrief from './pages/AboutBrief'
import AboutTravel from './pages/AboutTravel'
import AboutCulture from './pages/AboutCulture'
import AboutTourism from './pages/AboutTourism'
import AboutVisiting from './pages/AboutVisiting'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/Admin'
import ConsularDetail from './pages/ConsularDetail'
import NewsDetail from './pages/NewsDetail'
import FormsPage from './pages/FormsPage'
import AlertsPage from './pages/AlertsPage'

function App() {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <AlertBar />
      <div key={location.pathname} className="page-fade-enter page-fade-enter-active flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/consular-services" element={<ConsularPage />} />
        <Route path="/consular/:id" element={<ConsularDetail />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/about-sudan" element={<AboutPage />} />
        <Route path="/about/in-brief" element={<AboutBrief />} />
        <Route path="/about/travel" element={<AboutTravel />} />
        <Route path="/about/culture" element={<AboutCulture />} />
        <Route path="/about/tourism" element={<AboutTourism />} />
        <Route path="/about/visiting" element={<AboutVisiting />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
