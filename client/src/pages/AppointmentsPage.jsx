import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function AppointmentsPage() {
  const { t } = useTranslation();
  async function submit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch(getApiUrl("/api/appointments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { type: "success", text: "Appointment submitted" },
        })
      );
      formEl.reset();
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { type: "error", text: err.message },
        })
      );
    }
  }
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-6">
        {t("pages.book_appointment")}
      </h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-700 mb-4">{t("pages.choose_service")}</p>
        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("pages.full_name")}
            </label>
            <input
              name="name"
              className="w-full border rounded px-3 py-2"
              placeholder={t("contact.your_name")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("forms.email")}
            </label>
            <input
              name="email"
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("appointments.service")}
            </label>
            <select
              name="service"
              className="w-full border rounded px-3 py-2"
              required
            >
              <option>{t("appointments.opt_passport")}</option>
              <option>{t("appointments.opt_visa")}</option>
              <option>{t("appointments.opt_authentication")}</option>
              <option>{t("appointments.opt_national_number")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("pages.preferred_date")}
            </label>
            <input
              name="date"
              type="date"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("contact.message")}
            </label>
            <textarea
              name="notes"
              className="w-full border rounded px-3 py-2"
              rows="4"
              placeholder={t("pages.any_additional")}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="bg-sudan-green text-white px-6 py-2 rounded hover:bg-green-700">
              {t("pages.submit")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
