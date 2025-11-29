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
  const [i18nVals, setI18nVals] = useState({
    ro: { name: "", details: "" },
    ar: { name: "", details: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
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
      <Field label={t('admin.consular.name')}>
        <TextInput {...register("name")} />
        {errors.name && (
          <div className="text-red-600 text-xs mt-1">{errors.name.message}</div>
        )}
      </Field>
      <Field label={t('admin.consular.icon')}>
        <TextInput {...register("icon")} />
        {errors.icon && (
          <div className="text-red-600 text-xs mt-1">{errors.icon.message}</div>
        )}
      </Field>
      <Field label={t('admin.consular.details')}>
        <TextArea rows={4} {...register("details")} />
        {errors.details && (
          <div className="text-red-600 text-xs mt-1">
            {errors.details.message}
          </div>
        )}
      </Field>
      <Field label={t('admin.consular.attachment')}>
        <Upload onFile={setFile} accept="image/*,application/pdf" />
        {progress > 0 && (
          <div className="text-sm text-gray-600 mt-1">{t('admin.common.upload_progress', { progress })}</div>
        )}
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">{t('admin.i18n.romanian')}</div>
          <Field label={t('admin.i18n.name_ro')}>
            <TextInput
              value={i18nVals.ro.name}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ro: { ...s.ro, name: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t('admin.i18n.details_ro')}>
            <TextArea
              rows={3}
              value={i18nVals.ro.details}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ro: { ...s.ro, details: e.target.value },
                }))
              }
            />
          </Field>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">{t('admin.i18n.arabic')}</div>
          <Field label={t('admin.i18n.name_ar')}>
            <TextInput
              value={i18nVals.ar.name}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ar: { ...s.ar, name: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t('admin.i18n.details_ar')}>
            <TextArea
              rows={3}
              value={i18nVals.ar.details}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ar: { ...s.ar, details: e.target.value },
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

function withTokenHeaders(init = {}) {
  const token = localStorage.getItem("fbToken") || "";
  return {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
  };
}

function useAdminList(path) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(getApiUrl(path), withTokenHeaders())
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
  const [i18nVals, setI18nVals] = useState({
    ro: { title: "", summary: "", tag: "" },
    ar: { title: "", summary: "", tag: "" },
  });
  const onSubmit = handleSubmit(async (values) => {
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
      <Field label={t('admin.news.news_title')}>
        <TextInput {...register("title")} />
        {errors.title && (
          <div className="text-red-600 text-xs mt-1">
            {errors.title.message}
          </div>
        )}
      </Field>
      <Field label={t('admin.news.summary')}>
        <TextArea rows={3} {...register("summary")} />
        {errors.summary && (
          <div className="text-red-600 text-xs mt-1">
            {errors.summary.message}
          </div>
        )}
      </Field>
      <Field label={t('admin.news.tag')}>
        <TextInput {...register("tag")} />
        {errors.tag && (
          <div className="text-red-600 text-xs mt-1">{errors.tag.message}</div>
        )}
      </Field>
      <Field label={t('admin.news.attachment')}>
        <Upload onFile={setFile} accept="image/*,application/pdf" />
        {progress > 0 && (
          <div className="text-sm text-gray-600 mt-1">{t('admin.common.upload_progress', { progress })}</div>
        )}
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">{t('admin.i18n.romanian')}</div>
          <Field label={t('admin.i18n.title_ro')}>
            <TextInput
              value={i18nVals.ro.title}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ro: { ...s.ro, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t('admin.i18n.summary_ro')}>
            <TextArea
              rows={3}
              value={i18nVals.ro.summary}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ro: { ...s.ro, summary: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t('admin.i18n.tag_ro')}>
            <TextInput
              value={i18nVals.ro.tag}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ro: { ...s.ro, tag: e.target.value },
                }))
              }
            />
          </Field>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">{t('admin.i18n.arabic')}</div>
          <Field label={t('admin.i18n.title_ar')}>
            <TextInput
              value={i18nVals.ar.title}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ar: { ...s.ar, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t('admin.i18n.summary_ar')}>
            <TextArea
              rows={3}
              value={i18nVals.ar.summary}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ar: { ...s.ar, summary: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t('admin.i18n.tag_ar')}>
            <TextInput
              value={i18nVals.ar.tag}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ar: { ...s.ar, tag: e.target.value },
                }))
              }
            />
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
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("info");
  const [active, setActive] = useState(true);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [i18nVals, setI18nVals] = useState({
    ro: { message: "" },
    ar: { message: "" },
  });

  async function submit(e) {
    e.preventDefault();
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
        message,
        level,
        active,
        attachmentUrl,
        attachmentType,
        fileName,
        i18n: i18nVals,
      }),
    });
    setMessage("");
    setLevel("info");
    setActive(true);
    setFile(null);
    setProgress(0);
    toast.success(t('admin.alerts.created'));
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.alerts.message')}</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">{t('admin.i18n.romanian')}</div>
          <label className="block text-sm font-medium mb-1">{t('admin.i18n.message_ro')}</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={i18nVals.ro.message}
            onChange={(e) =>
              setI18nVals((s) => ({ ...s, ro: { message: e.target.value } }))
            }
          />
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">{t('admin.i18n.arabic')}</div>
          <label className="block text-sm font-medium mb-1">{t('admin.i18n.message_ar')}</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={i18nVals.ar.message}
            onChange={(e) =>
              setI18nVals((s) => ({ ...s, ar: { message: e.target.value } }))
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [i18nVals, setI18nVals] = useState({
    ro: { title: "", description: "" },
    ar: { title: "", description: "" },
  });
  async function submit(e) {
    e.preventDefault();
    if (!file) return toast.error(t('admin.forms.select_pdf'));
    const { downloadURL } = await uploadToStorage("forms", file, setProgress);
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl("/api/forms"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        fileUrl: downloadURL,
        fileType: file.type,
        fileName: file.name,
        i18n: i18nVals,
      }),
    });
    setTitle("");
    setDescription("");
    setFile(null);
    setProgress(0);
    toast.success(t('admin.forms.uploaded'));
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label={t('admin.forms.form_title')}>
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label={t('admin.forms.description')}>
        <TextArea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>
      <Field label={t('admin.forms.pdf')}>
        <Upload onFile={setFile} accept="application/pdf" />
        {progress > 0 && (
          <div className="text-sm text-gray-600 mt-1">{t('admin.common.upload_progress', { progress })}</div>
        )}
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">{t('admin.i18n.romanian')}</div>
          <Field label={t('admin.i18n.title_ro')}>
            <TextInput
              value={i18nVals.ro.title}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ro: { ...s.ro, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t('admin.i18n.description_ro')}>
            <TextArea
              rows={3}
              value={i18nVals.ro.description}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ro: { ...s.ro, description: e.target.value },
                }))
              }
            />
          </Field>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">{t('admin.i18n.arabic')}</div>
          <Field label={t('admin.i18n.title_ar')}>
            <TextInput
              value={i18nVals.ar.title}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ar: { ...s.ar, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t('admin.i18n.description_ar')}>
            <TextArea
              rows={3}
              value={i18nVals.ar.description}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  ar: { ...s.ar, description: e.target.value },
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
        {active === "Services" && (
          <>
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-4">
                {t('admin.consular.title')}
              </h2>
              <ConsularForm />
            </div>
            <div className="col-span-1">
              <ConsularList />
            </div>
          </>
        )}
        {active === "News" && (
          <>
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-4">{t('admin.news.title')}</h2>
              <NewsForm />
            </div>
            <div className="col-span-1">
              <NewsList />
            </div>
          </>
        )}
        {active === "Alerts" && (
          <>
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-4">{t('admin.alerts.title')}</h2>
              <AlertsForm />
            </div>
            <div className="col-span-1">
              <AlertsList />
            </div>
          </>
        )}
        {active === "Appointments" && (
          <>
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">{t('admin.appointments.title')}</h2>
              <AppointmentsListAdvanced />
            </div>
          </>
        )}
        {active === "Forms" && (
          <>
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-4">{t('admin.forms.title')}</h2>
              <FormsCreate />
            </div>
            <div className="col-span-1">
              <FormsList />
            </div>
          </>
        )}
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
              <h2 className="text-xl font-semibold mb-4">{t('admin.settings.title')}</h2>
              <SettingsForm />
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
                {s.email} • {s.phone}
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

function SettingsForm() {
  const { t } = useTranslation();
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
    contacts: [
      [
        "fa-solid fa-location-dot",
        "123 Diplomatic Street, Sector 1, Bucharest, Romania",
      ],
      ["fa-solid fa-phone", "+40 21 123 4567"],
      ["fa-solid fa-envelope", "info@sudanembassy.ro"],
    ],
    map: {
      lat: 44.4467127,
      lng: 26.1035968,
      placeLink:
        "https://www.google.com/maps/place/Ambasada+Republicii+Sudan/@44.447707,26.1031946,17.77z/data=!4m6!3m5!1s0x40b1ff8fd7ba51a9:0x1bea18766dc4de4c!8m2!3d44.4467127!4d26.1035968!16s%2Fg%2F11vbypp9cb?entry=ttu",
    },
    promoSlides: [
      {
        title: "Hidden Treasures Cultural Tourism",
        subtitle: "—",
        cta: "Click Here",
        href: "https://artsexperiments.withgoogle.com/meroe/",
        image: "/images/1ss.jpg",
      },
      {
        title: "Using the Sudanese Police Electronic Reporting Platform",
        subtitle: "—",
        cta: "Click Here",
        href: "https://www.sudanpolice.net/",
        image: "/images/2ss.jpg",
      },
    ],
  });
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((d) => d && setSettings((s) => ({ ...s, ...d })));
  }, []);

  function updateContactRow(idx, field, value) {
    setSettings((s) => {
      const next = [...s.contacts];
      const row = [...next[idx]];
      if (field === "icon") row[0] = value;
      else row[1] = value;
      next[idx] = row;
      return { ...s, contacts: next };
    });
  }
  function addContactRow() {
    setSettings((s) => ({
      ...s,
      contacts: [...s.contacts, ["fa-solid fa-circle-info", "New line"]],
    }));
  }
  function removeContactRow(idx) {
    setSettings((s) => ({
      ...s,
      contacts: s.contacts.filter((_, i) => i !== idx),
    }));
  }

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
    <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">{t('admin.settings.header_section')}</h3>
        <label className="block text-sm mb-1">{t('admin.settings.phone')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.header.phone}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              header: { ...s.header, phone: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.email')}</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={settings.header.email}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              header: { ...s.header, email: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1 mt-3">
          {t('admin.settings.receive_email')}
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          value={settings.receiveEmail}
          onChange={(e) =>
            setSettings((s) => ({ ...s, receiveEmail: e.target.value }))
          }
        />
        <label className="block text-sm mb-1 mt-3">{t('admin.settings.address')}</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={settings.address}
          onChange={(e) =>
            setSettings((s) => ({ ...s, address: e.target.value }))
          }
        />
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">{t('admin.settings.hero_section')}</h3>
        <label className="block text-sm mb-1">{t('admin.settings.hero_title')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.hero.title}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              hero: { ...s.hero, title: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.hero_subtitle')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.hero.subtitle}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              hero: { ...s.hero, subtitle: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.hero_cta1')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.hero.cta1}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              hero: { ...s.hero, cta1: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.hero_cta2')}</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={settings.hero.cta2}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              hero: { ...s.hero, cta2: e.target.value },
            }))
          }
        />
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">{t('admin.settings.status_bar')}</h3>
        <label className="block text-sm mb-1">{t('admin.settings.status')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.statusBar.status}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              statusBar: { ...s.statusBar, status: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.holiday')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.statusBar.holiday}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              statusBar: { ...s.statusBar, holiday: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.next_appointment')}</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={settings.statusBar.nextAppointment}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              statusBar: { ...s.statusBar, nextAppointment: e.target.value },
            }))
          }
        />
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">{t('admin.settings.emergency_section')}</h3>
        <label className="block text-sm mb-1">{t('admin.settings.emergency_phone')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.emergency.phone}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              emergency: { ...s.emergency, phone: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.emergency_note')}</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={settings.emergency.note}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              emergency: { ...s.emergency, note: e.target.value },
            }))
          }
        />
      </div>

      <div className="bg-gray-50 p-4 rounded md:col-span-2">
        <h3 className="font-semibold mb-2">{t('admin.settings.hours_section')}</h3>
        <label className="block text-sm mb-1">{t('admin.settings.mon_thu')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.hours.monThu}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              hours: { ...s.hours, monThu: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.fri')}</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={settings.hours.fri}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              hours: { ...s.hours, fri: e.target.value },
            }))
          }
        />
      </div>

      <div className="bg-gray-50 p-4 rounded md:col-span-2">
        <h3 className="font-semibold mb-3">
          {t('admin.settings.contacts_section')}
        </h3>
        <div className="space-y-2">
          {settings.contacts.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
            >
              <input
                className="md:col-span-4 border rounded px-3 py-2"
                value={row[0]}
                onChange={(e) => updateContactRow(idx, "icon", e.target.value)}
              />
              <input
                className="md:col-span-7 border rounded px-3 py-2"
                value={row[1]}
                onChange={(e) => updateContactRow(idx, "text", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeContactRow(idx)}
                className="md:col-span-1 text-red-600"
              >
                {t('admin.settings.remove')}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <button
            type="button"
            onClick={addContactRow}
            className="text-sudan-blue"
          >
            {t('admin.settings.add_line')}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">{t('admin.settings.map_section')}</h3>
        <label className="block text-sm mb-1">{t('admin.settings.latitude')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.map.lat}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              map: { ...s.map, lat: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.longitude')}</label>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={settings.map.lng}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              map: { ...s.map, lng: e.target.value },
            }))
          }
        />
        <label className="block text-sm mb-1">{t('admin.settings.place_link')}</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={settings.map.placeLink}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              map: { ...s.map, placeLink: e.target.value },
            }))
          }
        />
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">{t('admin.settings.promo_section')}</h3>
        <div className="space-y-3">
          {settings.promoSlides.map((ps, idx) => (
            <div key={idx} className="border rounded p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="border rounded px-3 py-2"
                  placeholder={t('admin.settings.promo_title')}
                  value={ps.title}
                  onChange={(e) =>
                    setSettings((s) => {
                      const arr = [...s.promoSlides];
                      arr[idx] = { ...arr[idx], title: e.target.value };
                      return { ...s, promoSlides: arr };
                    })
                  }
                />
                <input
                  className="border rounded px-3 py-2"
                  placeholder={t('admin.settings.promo_cta')}
                  value={ps.cta}
                  onChange={(e) =>
                    setSettings((s) => {
                      const arr = [...s.promoSlides];
                      arr[idx] = { ...arr[idx], cta: e.target.value };
                      return { ...s, promoSlides: arr };
                    })
                  }
                />
                <input
                  className="border rounded px-3 py-2 md:col-span-2"
                  placeholder={t('admin.settings.promo_subtitle')}
                  value={ps.subtitle}
                  onChange={(e) =>
                    setSettings((s) => {
                      const arr = [...s.promoSlides];
                      arr[idx] = { ...arr[idx], subtitle: e.target.value };
                      return { ...s, promoSlides: arr };
                    })
                  }
                />
                <input
                  className="border rounded px-3 py-2"
                  placeholder={t('admin.settings.promo_link')}
                  value={ps.href}
                  onChange={(e) =>
                    setSettings((s) => {
                      const arr = [...s.promoSlides];
                      arr[idx] = { ...arr[idx], href: e.target.value };
                      return { ...s, promoSlides: arr };
                    })
                  }
                />
                <input
                  className="border rounded px-3 py-2"
                  placeholder={t('admin.settings.promo_image')}
                  value={ps.image}
                  onChange={(e) =>
                    setSettings((s) => {
                      const arr = [...s.promoSlides];
                      arr[idx] = { ...arr[idx], image: e.target.value };
                      return { ...s, promoSlides: arr };
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      promoSlides: s.promoSlides.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  {t('admin.settings.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <button
            type="button"
            className="text-sudan-blue"
            onClick={() =>
              setSettings((s) => ({
                ...s,
                promoSlides: [
                  ...s.promoSlides,
                  {
                    title: "",
                    subtitle: "",
                    cta: "Click Here",
                    href: "#",
                    image: "/images/1ss.jpg",
                  },
                ],
              }))
            }
          >
            {t('admin.settings.add_slide')}
          </button>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button className="bg-sudan-green text-white px-6 py-2 rounded">
          {t('admin.settings.save_settings')}
        </button>
      </div>
    </form>
  );
}
