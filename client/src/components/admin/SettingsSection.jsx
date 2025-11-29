import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { getApiUrl } from "../../config.js";
import { withTokenHeaders } from "../../pages/Admin.jsx";
import HeroSettings from "./settings/HeroSettings.jsx";
import StatusBarSettings from "./settings/StatusBarSettings.jsx";
import PromoSlidesSettings from "./settings/PromoSlidesSettings.jsx";
import EmergencySettings from "./settings/EmergencySettings.jsx";
import HoursSettings from "./settings/HoursSettings.jsx";
import ContactsSettings from "./settings/ContactsSettings.jsx";
import MapSettings from "./settings/MapSettings.jsx";

export default function SettingsSection() {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState("en");
  const [settings, setSettings] = useState({
    header: { phone: "+40 21 123 4567", email: "info@sudanembassy.ro" },
    receiveEmail: "info@sudanembassy.ro",
    address: "123 Diplomatic Street, Sector 1, Bucharest, Romania",
    hero: {
      title: "Embassy of the Republic of Sudan",
      subtitle: "Bucharest, Romania",
      cta1: "Book Appointment",
      cta2: "Consular Services",
    },
    hours: { monThu: "9:00 AM - 4:00 PM", fri: "9:00 AM - 1:00 PM" },
    statusBar: {
      status: "Open today: 9:00 AM - 4:00 PM",
      holiday: "",
      nextAppointment: "",
    },
    emergency: {
      phone: "+40 722 123 456",
      note: "This number is for genuine emergencies only",
    },
    contacts: {
      address: ["fa-solid fa-location-dot", "123 Diplomatic Street, Sector 1, Bucharest, Romania"],
      phone: ["fa-solid fa-phone", "+40 21 123 4567"],
      email: ["fa-solid fa-envelope", "info@sudanembassy.ro"]
    },
    map: {
      lat: 44.4467127,
      lng: 26.1035968,
      placeLink:
        "https://www.google.com/maps/place/Ambasada+Republicii+Sudan/@44.447707,26.1031946,17.77z/data=!4m6!3m5!1s0x40b1ff8fd7ba51a9:0x1bea18766dc4de4c!8m2!3d44.4467127!4d26.1035968!16s%2Fg%2F11vbypp9cb?entry=ttu",
    },
    promoSlides: {
      slide1: {
        title: "Hidden Treasures Cultural Tourism",
        subtitle: "—",
        cta: "Click Here",
        href: "https://artsexperiments.withgoogle.com/meroe/",
        image: "/images/1ss.jpg"
      },
      slide2: {
        title: "Using the Sudanese Police Electronic Reporting Platform",
        subtitle: "—",
        cta: "Click Here",
        href: "https://www.sudanpolice.net/",
        image: "/images/2ss.jpg"
      }
    },
    i18n: {
      en: {
        hero: { title: "", subtitle: "", cta1: "", cta2: "" },
        statusBar: { status: "", holiday: "", nextAppointment: "" },
        emergency: { note: "" },
        promoSlides: { slide1: { title: "", subtitle: "", cta: "" }, slide2: { title: "", subtitle: "", cta: "" } }
      },
      ro: {
        hero: { title: "", subtitle: "", cta1: "", cta2: "" },
        statusBar: { status: "", holiday: "", nextAppointment: "" },
        emergency: { note: "" },
        promoSlides: { slide1: { title: "", subtitle: "", cta: "" }, slide2: { title: "", subtitle: "", cta: "" } }
      },
      ar: {
        hero: { title: "", subtitle: "", cta1: "", cta2: "" },
        statusBar: { status: "", holiday: "", nextAppointment: "" },
        emergency: { note: "" },
        promoSlides: { slide1: { title: "", subtitle: "", cta: "" }, slide2: { title: "", subtitle: "", cta: "" } }
      },
    },
  });

  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((d) => d && setSettings((s) => ({ ...s, ...d })));
  }, []);

  async function save(e) {
    e.preventDefault();
    await fetch(
      getApiUrl("/api/settings"),
      withTokenHeaders({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
    );
    toast.success(t('admin.settings.saved_settings'));
    window.dispatchEvent(
      new CustomEvent("toast", {
        detail: { type: "success", text: t('admin.settings.saved_settings') },
      })
    );
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded ${selectedLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedLang('en')}
          >
            {t('admin.i18n.english')}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${selectedLang === 'ro' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedLang('ro')}
          >
            {t('admin.i18n.romanian')}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${selectedLang === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedLang('ar')}
          >
            {t('admin.i18n.arabic')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HeroSettings 
            settings={settings} 
            setSettings={setSettings} 
            selectedLang={selectedLang} 
          />
          
          <StatusBarSettings 
            settings={settings} 
            setSettings={setSettings} 
            selectedLang={selectedLang} 
          />
          
          <PromoSlidesSettings 
            settings={settings} 
            setSettings={setSettings} 
            selectedLang={selectedLang} 
          />
        </div>
      </div>

      <EmergencySettings 
        settings={settings} 
        setSettings={setSettings} 
        selectedLang={selectedLang} 
      />

      <HoursSettings 
        settings={settings} 
        setSettings={setSettings} 
        selectedLang={selectedLang} 
      />

      <ContactsSettings 
        settings={settings} 
        setSettings={setSettings} 
        selectedLang={selectedLang} 
      />

      <MapSettings 
        settings={settings} 
        setSettings={setSettings} 
      />

      <div className="md:col-span-2 flex justify-end">
        <button className="bg-sudan-green text-white px-6 py-2 rounded">
          {t('admin.settings.save_settings')}
        </button>
      </div>
    </form>
  );
}
