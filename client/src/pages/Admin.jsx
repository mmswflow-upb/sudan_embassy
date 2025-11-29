import { useEffect, useState } from "react";
import { uploadToStorage } from "../lib/storage";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  PageToaster,
  Field,
  TextInput,
  TextArea,
  Button,
} from "../components/UI";
import Upload from "../components/Upload";
import AdminLogin from "./AdminLogin";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";

import { getApiUrl } from "../config.js";

// Import section components
import ConsularSection from "../components/admin/ConsularSection.jsx";
import NewsSection from "../components/admin/NewsSection.jsx";
import AlertsSection from "../components/admin/AlertsSection.jsx";
import FormsSection from "../components/admin/FormsSection.jsx";
import SettingsSection from "../components/admin/SettingsSection.jsx";

async function api(path, options = {}) {
  const res = await fetch(getApiUrl(path), {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).error || "Request failed");
  return res.json();
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const { t } = useTranslation();

  if (!authenticated) {
    return <AdminLogin onAuthed={() => setAuthenticated(true)} />;
  }

  return (
    <main className="container mx-auto px-4 py-10 space-y-6">
      <PageToaster />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-sudan-black">{t('admin.dashboard')}</h1>
        <button
          className="bg-sudan-black text-white px-4 py-2 rounded"
          onClick={() => {
            signOut(auth).catch(() => {});
            setAuthenticated(false);
          }}
        >
          {t('admin.logout')}
        </button>
      </div>

      <AdminTabs />
    </main>
  );
}

function FileInput({ onChange }) {
  return (
    <input
      type="file"
      className="w-full"
      onChange={(e) => onChange(e.target.files?.[0] || null)}
    />
  );
}

function ConsularForm() {
  const { t } = useTranslation();
  const schema = z.object({
    name: z.string().min(2),
    icon: z.string().min(1),
    details: z.string().min(5),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", icon: "fa-solid fa-passport", details: "" },
  });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedLang, setSelectedLang] = useState("en");
  const [i18nVals, setI18nVals] = useState({
    en: { name: "", details: "" },
    ro: { name: "", details: "" },
    ar: { name: "", details: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    // Validate all languages are filled
    const missingLangs = [];
    if (!i18nVals.en.name || !i18nVals.en.details) missingLangs.push('English');
    if (!i18nVals.ro.name || !i18nVals.ro.details) missingLangs.push('Romanian');
    if (!i18nVals.ar.name || !i18nVals.ar.details) missingLangs.push('Arabic');
    
    if (missingLangs.length > 0) {
      toast.error(`Please fill all fields for: ${missingLangs.join(', ')}`);
      return;
    }

    let image = null;
    let attachmentUrl = null,
      attachmentType = null,
      fileName = null;
    if (file) {
      const { downloadURL } = await uploadToStorage(
        "consular",
        file,
        setProgress
      );
      attachmentUrl = downloadURL;
      fileName = file.name;
      attachmentType = file.type?.includes("pdf")
        ? "pdf"
        : file.type?.startsWith("image/")
        ? "image"
        : "file";
    }
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl("/api/consular-services"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...values,
        image: attachmentType === "image" ? attachmentUrl : null,
        attachmentUrl,
        attachmentType,
        fileName,
        i18n: i18nVals,
      }),
    });
    reset();
    setFile(null);
    setProgress(0);
    toast.success(t('admin.consular.saved'));
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Field label={t('admin.consular.icon')}>
        <TextInput {...register("icon")} />
        {errors.icon && (
          <div className="text-red-600 text-xs mt-1">{errors.icon.message}</div>
        )}
      </Field>
      <Field label={t('admin.consular.attachment')}>
        <Upload onFile={setFile} accept="image/*,application/pdf" />
        {progress > 0 && (
          <div className="text-sm text-gray-600 mt-1">{t('admin.common.upload_progress', { progress })}</div>
        )}
      </Field>
      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2 mb-3">
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
        <div className="bg-gray-50 p-4 rounded">
          <Field label={t(`admin.i18n.name_${selectedLang}`)}>
            <TextInput
              value={i18nVals[selectedLang].name}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], name: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t(`admin.i18n.details_${selectedLang}`)}>
            <TextArea
              rows={4}
              value={i18nVals[selectedLang].details}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], details: e.target.value },
                }))
              }
            />
          </Field>
        </div>
      </div>
      <Button disabled={isSubmitting}>
        {isSubmitting ? t('admin.consular.saving') : t('admin.consular.save')}
      </Button>
    </form>
  );
}

export function withTokenHeaders(init = {}) {
  const token = localStorage.getItem("fbToken") || "";
  return {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
  };
}

function useAdminList(path) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const url = path.includes('?') ? `${path}&lang=en` : `${path}?lang=en`;
    fetch(getApiUrl(url), withTokenHeaders())
      .then((r) => r.json())
      .then(setItems);
  }, []);
  return [items, setItems];
}

function NewsForm() {
  const { t } = useTranslation();
  const schema = z.object({
    title: z.string().min(3),
    summary: z.string().min(10),
    tag: z.string().min(2),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", summary: "", tag: "Official" },
  });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedLang, setSelectedLang] = useState("en");
  const [i18nVals, setI18nVals] = useState({
    en: { title: "", summary: "", tag: "" },
    ro: { title: "", summary: "", tag: "" },
    ar: { title: "", summary: "", tag: "" },
  });
  const onSubmit = handleSubmit(async (values) => {
    // Validate all languages are filled
    const missingLangs = [];
    if (!i18nVals.en.title || !i18nVals.en.summary || !i18nVals.en.tag) missingLangs.push('English');
    if (!i18nVals.ro.title || !i18nVals.ro.summary || !i18nVals.ro.tag) missingLangs.push('Romanian');
    if (!i18nVals.ar.title || !i18nVals.ar.summary || !i18nVals.ar.tag) missingLangs.push('Arabic');
    
    if (missingLangs.length > 0) {
      toast.error(`Please fill all fields for: ${missingLangs.join(', ')}`);
      return;
    }

    let image = null;
    let attachmentUrl = null,
      attachmentType = null,
      fileName = null;
    if (file) {
      const { downloadURL } = await uploadToStorage("news", file, setProgress);
      attachmentUrl = downloadURL;
      fileName = file.name;
      attachmentType = file.type?.includes("pdf")
        ? "pdf"
        : file.type?.startsWith("image/")
        ? "image"
        : "file";
    }
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl("/api/news"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...values,
        image: attachmentType === "image" ? attachmentUrl : null,
        attachmentUrl,
        attachmentType,
        fileName,
        i18n: i18nVals,
      }),
    });
    reset();
    setFile(null);
    setProgress(0);
    toast.success(t('admin.news.published'));
  });
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Field label={t('admin.news.attachment')}>
        <Upload onFile={setFile} accept="image/*,application/pdf" />
        {progress > 0 && (
          <div className="text-sm text-gray-600 mt-1">{t('admin.common.upload_progress', { progress })}</div>
        )}
      </Field>
      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2 mb-3">
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
        <div className="bg-gray-50 p-4 rounded">
          <Field label={t(`admin.i18n.title_${selectedLang}`)}>
            <TextInput
              value={i18nVals[selectedLang].title}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t(`admin.i18n.summary_${selectedLang}`)}>
            <TextArea
              rows={3}
              value={i18nVals[selectedLang].summary}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], summary: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t(`admin.i18n.tag_${selectedLang}`)}>
            <select
              value={i18nVals[selectedLang].tag}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], tag: e.target.value },
                }))
              }
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">-- {t('common.select')} --</option>
              <option value="Official">{t('news.tags.Official')}</option>
              <option value="Announcement">{t('news.tags.Announcement')}</option>
              <option value="Event">{t('news.tags.Event')}</option>
              <option value="Update">{t('news.tags.Update')}</option>
              <option value="Holiday">{t('news.tags.Holiday')}</option>
              <option value="Important">{t('news.tags.Important')}</option>
            </select>
          </Field>
        </div>
      </div>
      <Button
        className="bg-sudan-blue hover:bg-blue-800"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('admin.news.publishing') : t('admin.news.publish')}
      </Button>
    </form>
  );
}

function AlertsForm() {
  const { t } = useTranslation();
  const [level, setLevel] = useState("info");
  const [active, setActive] = useState(true);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedLang, setSelectedLang] = useState("en");
  const [i18nVals, setI18nVals] = useState({
    en: { message: "" },
    ro: { message: "" },
    ar: { message: "" },
  });

  async function submit(e) {
    e.preventDefault();
    
    // Validate all languages are filled
    const missingLangs = [];
    if (!i18nVals.en.message) missingLangs.push('English');
    if (!i18nVals.ro.message) missingLangs.push('Romanian');
    if (!i18nVals.ar.message) missingLangs.push('Arabic');
    
    if (missingLangs.length > 0) {
      toast.error(`Please fill message for: ${missingLangs.join(', ')}`);
      return;
    }

    let attachmentUrl = null,
      attachmentType = null,
      fileName = null;
    if (file) {
      const { downloadURL } = await uploadToStorage(
        "alerts",
        file,
        setProgress
      );
      attachmentUrl = downloadURL;
      fileName = file.name;
      attachmentType = file.type?.includes("pdf")
        ? "pdf"
        : file.type?.startsWith("image/")
        ? "image"
        : "file";
    }
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl("/api/alerts"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: i18nVals.en.message, // Use English as default
        level,
        active,
        attachmentUrl,
        attachmentType,
        fileName,
        i18n: i18nVals,
      }),
    });
    setI18nVals({
      en: { message: "" },
      ro: { message: "" },
      ar: { message: "" },
    });
    setLevel("info");
    setActive(true);
    setFile(null);
    setProgress(0);
    toast.success(t('admin.alerts.created'));
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">{t('admin.alerts.level')}</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="danger">danger</option>
          </select>
        </div>
        <label className="flex items-center gap-2 mt-6 sm:mt-0">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />{" "}
          {t('admin.alerts.active')}
        </label>
      </div>
      <Field label={t('admin.alerts.attachment')}>
        <Upload onFile={setFile} accept="image/*,application/pdf" />
        {progress > 0 && (
          <div className="text-sm text-gray-600 mt-1">{t('admin.common.upload_progress', { progress })}</div>
        )}
      </Field>
      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2 mb-3">
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
        <div className="bg-gray-50 p-4 rounded">
          <label className="block text-sm font-medium mb-1">{t(`admin.i18n.message_${selectedLang}`)}</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={i18nVals[selectedLang].message}
            onChange={(e) =>
              setI18nVals((s) => ({ ...s, [selectedLang]: { message: e.target.value } }))
            }
          />
        </div>
      </div>
      <button className="bg-sudan-black text-white px-6 py-2 rounded">
        {t('admin.alerts.create')}
      </button>
    </form>
  );
}

function AppointmentsList() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(getApiUrl("/api/appointments"), {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fbToken") || ""}`,
      },
    })
      .then((r) => r.json())
      .then(setItems);
  }, []);
  return (
    <div className="space-y-2 max-h-[360px] overflow-auto">
      {items.map((a) => (
        <div key={a.id} className="border rounded p-3 text-sm">
          <div className="font-medium">
            {a.service} — {a.name}
          </div>
          <div className="text-gray-600">
            {a.email} • {a.date}
          </div>
          {a.notes && <div className="text-gray-700 mt-1">{a.notes}</div>}
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-gray-500">No appointments yet.</div>
      )}
    </div>
  );
}

function ConsularList() {
  const { t } = useTranslation();
  const [items, setItems] = useAdminList("/api/consular-services");
  async function remove(id) {
    await fetch(
      getApiUrl(`/api/consular-services/${id}`),
      withTokenHeaders({ method: "DELETE" })
    );
    setItems(items.filter((i) => i.id !== id));
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{t('admin.consular.list_title')}</h2>
      <div className="space-y-2 max-h-[360px] overflow-auto">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between border rounded p-3 text-sm"
          >
            <div className="flex items-center gap-2">
              <i className={`${i.icon} w-5`} />
              <span className="font-medium">{i.name}</span>
            </div>
            <button className="text-red-600" onClick={() => remove(i.id)}>
              {t('admin.consular.delete')}
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">{t('admin.consular.no_services')}</div>
        )}
      </div>
    </div>
  );
}

function NewsList() {
  const { t } = useTranslation();
  const [items, setItems] = useAdminList("/api/news");
  async function remove(id) {
    await fetch(
      getApiUrl(`/api/news/${id}`),
      withTokenHeaders({ method: "DELETE" })
    );
    setItems(items.filter((i) => i.id !== id));
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{t('admin.news.list_title')}</h2>
      <div className="space-y-2 max-h-[360px] overflow-auto">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between border rounded p-3 text-sm"
          >
            <div className="font-medium">{i.title}</div>
            <button className="text-red-600" onClick={() => remove(i.id)}>
              {t('admin.news.delete')}
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">{t('admin.news.no_news')}</div>
        )}
      </div>
    </div>
  );
}

function AlertsList() {
  const { t } = useTranslation();
  const [items, setItems] = useAdminList("/api/alerts");
  async function remove(id) {
    await fetch(
      getApiUrl(`/api/alerts/${id}`),
      withTokenHeaders({ method: "DELETE" })
    );
    setItems(items.filter((i) => i.id !== id));
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{t('admin.alerts.list_title')}</h2>
      <div className="space-y-2 max-h-[360px] overflow-auto">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between border rounded p-3 text-sm"
          >
            <div>{i.message}</div>
            <button className="text-red-600" onClick={() => remove(i.id)}>
              {t('admin.alerts.delete')}
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">{t('admin.alerts.no_alerts')}</div>
        )}
      </div>
    </div>
  );
}

function FormsCreate() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedLang, setSelectedLang] = useState("en");
  const [i18nVals, setI18nVals] = useState({
    en: { title: "", description: "" },
    ro: { title: "", description: "" },
    ar: { title: "", description: "" },
  });
  async function submit(e) {
    e.preventDefault();
    if (!file) return toast.error(t('admin.forms.select_pdf'));
    
    // Validate all languages are filled
    const missingLangs = [];
    if (!i18nVals.en.title || !i18nVals.en.description) missingLangs.push('English');
    if (!i18nVals.ro.title || !i18nVals.ro.description) missingLangs.push('Romanian');
    if (!i18nVals.ar.title || !i18nVals.ar.description) missingLangs.push('Arabic');
    
    if (missingLangs.length > 0) {
      toast.error(`Please fill all fields for: ${missingLangs.join(', ')}`);
      return;
    }

    const { downloadURL } = await uploadToStorage("forms", file, setProgress);
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl("/api/forms"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: i18nVals.en.title, // Use English as default
        description: i18nVals.en.description,
        fileUrl: downloadURL,
        fileType: file.type,
        fileName: file.name,
        i18n: i18nVals,
      }),
    });
    setI18nVals({
      en: { title: "", description: "" },
      ro: { title: "", description: "" },
      ar: { title: "", description: "" },
    });
    setFile(null);
    setProgress(0);
    toast.success(t('admin.forms.uploaded'));
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label={t('admin.forms.pdf')}>
        <Upload onFile={setFile} accept="application/pdf" />
        {progress > 0 && (
          <div className="text-sm text-gray-600 mt-1">{t('admin.common.upload_progress', { progress })}</div>
        )}
      </Field>
      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2 mb-3">
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
        <div className="bg-gray-50 p-4 rounded">
          <Field label={t(`admin.i18n.title_${selectedLang}`)}>
            <TextInput
              value={i18nVals[selectedLang].title}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t(`admin.i18n.description_${selectedLang}`)}>
            <TextArea
              rows={3}
              value={i18nVals[selectedLang].description}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], description: e.target.value },
                }))
              }
            />
          </Field>
        </div>
      </div>
      <Button>{t('admin.forms.save')}</Button>
    </form>
  );
}

function FormsList() {
  const { t } = useTranslation();
  const [items, setItems] = useAdminList("/api/forms");
  async function remove(id) {
    await fetch(
      getApiUrl(`/api/forms/${id}`),
      withTokenHeaders({ method: "DELETE" })
    );
    setItems(items.filter((i) => i.id !== id));
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{t('admin.forms.list_title')}</h2>
      <div className="space-y-2 max-h-[360px] overflow-auto">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between border rounded p-3 text-sm"
          >
            <div className="font-medium">{i.title}</div>
            <div className="flex items-center gap-3">
              <a
                href={i.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sudan-blue"
              >
                {t('admin.forms.download')}
              </a>
              <button className="text-red-600" onClick={() => remove(i.id)}>
                {t('admin.forms.delete')}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">{t('admin.forms.no_forms')}</div>
        )}
      </div>
    </div>
  );
}

function AdminTabs() {
  const { t } = useTranslation();
  const tabGroups = [
    {
      name: t('admin.tabs.content_management'),
      tabs: [
        { key: "Services", label: t('admin.tabs.services') },
        { key: "News", label: t('admin.tabs.news') },
        { key: "Alerts", label: t('admin.tabs.alerts') },
        { key: "Forms", label: t('admin.tabs.forms') },
      ]
    },
    {
      name: t('admin.tabs.user_data'),
      tabs: [
        { key: "Appointments", label: t('admin.tabs.appointments') },
        { key: "Submissions", label: t('admin.tabs.submissions') },
      ]
    },
    {
      name: t('admin.tabs.configuration'),
      tabs: [
        { key: "Settings", label: t('admin.tabs.settings') },
      ]
    }
  ];
  const [active, setActive] = useState("Services");
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b px-4">
        <nav className="flex flex-col gap-4 py-2">
          {tabGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                {group.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      active === tab.key
                        ? "bg-sudan-green text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActive(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {active === "Services" && <ConsularSection />}
        {active === "News" && <NewsSection />}
        {active === "Alerts" && <AlertsSection />}
        {active === "Appointments" && (
          <>
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">{t('admin.appointments.title')}</h2>
              <AppointmentsListAdvanced />
            </div>
          </>
        )}
        {active === "Forms" && <FormsSection />}
        {active === "Submissions" && (
          <>
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">{t('admin.submissions.title')}</h2>
              <SubmissionsList />
            </div>
          </>
        )}
        {active === "Settings" && (
          <>
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">{t('admin.settings.site_settings')}</h2>
              <SettingsSection />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SubmissionsList() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("fbToken") || "";
    const url = getApiUrl(
      `/api/submissions${filter ? `?type=${encodeURIComponent(filter)}` : ""}`
    );
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .catch(() => setItems([]));
  }, [filter]);
  async function setStatus(id, status) {
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl(`/api/submissions/${id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{t('admin.submissions.title')}</h3>
        <select
          className="border rounded px-2 py-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">{t('admin.submissions.all_types')}</option>
          <option value="consular">{t('admin.submissions.consular')}</option>
          <option value="form">{t('admin.submissions.forms')}</option>
        </select>
      </div>
      <div className="space-y-2 max-h-[480px] overflow-auto">
        {items.map((s) => (
          <div
            key={s.id}
            className="border rounded p-3 text-sm flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="font-medium truncate">
                {s.type.toUpperCase()} — {s.name}{" "}
                <span className="text-gray-500">
                  ({new Date(s.createdAt).toLocaleString()})
                </span>
              </div>
              <div className="text-gray-600 truncate">
                {s.email} • <span dir="ltr">{s.phone}</span>
              </div>
              {s.notes && (
                <div className="text-gray-700 mt-1">{t('admin.submissions.notes')}: {s.notes}</div>
              )}
              {s.fileUrl && (
                <a
                  className="text-sudan-blue"
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('admin.submissions.view_file')}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  s.status === "done"
                    ? "bg-green-100 text-green-700"
                    : s.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {s.status}
              </span>
              <button
                className="text-sudan-green"
                onClick={() => setStatus(s.id, "done")}
              >
                {t('admin.submissions.mark_done')}
              </button>
              <button
                className="text-red-600"
                onClick={() => setStatus(s.id, "rejected")}
              >
                {t('admin.submissions.reject')}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">{t('admin.submissions.no_submissions')}</div>
        )}
      </div>
    </div>
  );
}

function AppointmentsListAdvanced() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("fbToken") || "";
    fetch(getApiUrl("/api/appointments"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .catch(() => setItems([]));
  }, []);
  async function setStatus(id, status) {
    await fetch(
      getApiUrl(`/api/appointments/${id}`),
      withTokenHeaders({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
    );
    setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
  }
  async function remove(id) {
    await fetch(
      getApiUrl(`/api/appointments/${id}`),
      withTokenHeaders({ method: "DELETE" })
    );
    setItems(items.filter((i) => i.id !== id));
  }
  return (
    <div className="space-y-2 max-h-[480px] overflow-auto">
      {items.map((a) => (
        <div
          key={a.id}
          className="border rounded p-3 text-sm flex items-center justify-between"
        >
          <div>
            <div className="font-medium">
              {a.service} — {a.name}
            </div>
            <div className="text-gray-600">
              {a.email} • {a.date}
            </div>
            {a.notes && <div className="text-gray-700 mt-1">{a.notes}</div>}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                a.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : a.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {a.status}
            </span>
            <button
              className="text-sudan-green"
              onClick={() => setStatus(a.id, "approved")}
            >
              {t('admin.appointments.approve')}
            </button>
            <button
              className="text-red-600"
              onClick={() => setStatus(a.id, "rejected")}
            >
              {t('admin.appointments.reject')}
            </button>
            <button className="text-gray-500" onClick={() => remove(a.id)}>
              {t('admin.appointments.delete')}
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-gray-500">{t('admin.appointments.no_appointments')}</div>
      )}
    </div>
  );
}
