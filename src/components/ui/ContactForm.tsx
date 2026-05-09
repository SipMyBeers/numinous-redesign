"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECT_TYPES = [
  "Design Only",
  "Fabrication",
  "Design + Fabrication",
  "Consulting",
  "Event Production",
  "Other",
];

const BUDGETS = [
  "Under $10k",
  "$10k–$50k",
  "$50k–$100k",
  "$100k+",
  "Not Sure",
];

const TIMELINES = [
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "12+ months",
  "Flexible",
];

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.message.trim()) errs.message = "Message is required.";
    return errs;
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.error || "Something went wrong." });
      } else {
        setToast({ type: "success", message: data.message });
        setForm({
          name: "",
          email: "",
          phone: "",
          projectType: "",
          budget: "",
          timeline: "",
          message: "",
        });
      }
    } catch {
      setToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 6000);
    }
  }

  const inputBase =
    "w-full bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-numinous-ember focus:bg-white/[0.05]";
  const selectBase =
    "w-full bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white outline-none transition-colors duration-300 focus:border-numinous-ember focus:bg-white/[0.05] appearance-none cursor-pointer";
  const labelBase = "block text-xs tracking-widest uppercase text-white/40 mb-2";

  return (
    <div className="relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg backdrop-blur-xl border shadow-lg max-w-md ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name / Email / Phone — responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelBase}>
              Name <span className="text-numinous-ember">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
              className={`${inputBase} ${errors.name ? "border-red-500/60" : ""}`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={labelBase}>
              Email <span className="text-numinous-ember">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@company.com"
              className={`${inputBase} ${errors.email ? "border-red-500/60" : ""}`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className={labelBase}>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Optional"
              className={inputBase}
            />
          </div>
        </div>

        {/* Project Type / Budget / Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelBase}>Project Type</label>
            <div className="relative">
              <select
                value={form.projectType}
                onChange={(e) => update("projectType", e.target.value)}
                className={selectBase}
              >
                <option value="" className="bg-numinous-dark">
                  Select...
                </option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-numinous-dark">
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className={labelBase}>Budget Range</label>
            <div className="relative">
              <select
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
                className={selectBase}
              >
                <option value="" className="bg-numinous-dark">
                  Select...
                </option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b} className="bg-numinous-dark">
                    {b}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className={labelBase}>Timeline</label>
            <div className="relative">
              <select
                value={form.timeline}
                onChange={(e) => update("timeline", e.target.value)}
                className={selectBase}
              >
                <option value="" className="bg-numinous-dark">
                  Select...
                </option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t} className="bg-numinous-dark">
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={labelBase}>
            Message <span className="text-numinous-ember">*</span>
          </label>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell us about your project, vision, or idea..."
            rows={5}
            className={`${inputBase} resize-none ${errors.message ? "border-red-500/60" : ""}`}
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1">{errors.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="relative group px-10 py-4 bg-numinous-ember text-white font-heading font-semibold tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,107,53,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span
              className={`inline-flex items-center gap-2 transition-opacity duration-200 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
            >
              Send Message
            </span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
