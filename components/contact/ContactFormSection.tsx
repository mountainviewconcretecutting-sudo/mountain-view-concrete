"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitQuote } from "@/lib/actions/submitQuote";
import { SERVICE_TYPE_LABELS, type QuoteFormValues } from "@/lib/types";

const EMPTY_FORM: QuoteFormValues = {
  name: "",
  phone: "",
  email: "",
  serviceType: "wall_sawing",
  projectDescription: "",
  preferredDate: "",
  companyWebsite: "",
};

export default function ContactFormSection() {
  const [values, setValues] = useState<QuoteFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function update<K extends keyof QuoteFormValues>(key: K, value: QuoteFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const result = await submitQuote(values);
    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setValues(EMPTY_FORM);
    } else {
      setStatus("error");
      setMessage(result.message);
      setErrors(result.fieldErrors ?? {});
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 border-2 border-slurry/50 bg-aggregate-deep p-10 text-center text-chalk shadow-[6px_6px_0px_#0F1115]">
        <CheckCircle2 size={44} className="text-ochre" aria-hidden="true" />
        <p className="font-display text-2xl uppercase tracking-wide text-chalk">Request Received</p>
        <p className="max-w-sm font-body text-sm text-steel-light">{message}</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-4">
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="border-2 border-slurry/50 bg-aggregate-deep p-8 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115]">
      <span className="font-tech text-xs font-bold uppercase tracking-[0.2em] text-flame">
        {"// ONLINE INQUIRY"}
      </span>
      <h2 className="font-display text-3xl uppercase tracking-wide text-chalk">REQUEST A QUOTE</h2>

      <div className="mt-2 hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={values.companyWebsite}
          onChange={(e) => update("companyWebsite", e.target.value)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass(!!errors.name)}
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input
            required
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass(!!errors.phone)}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            required
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass(!!errors.email)}
          />
        </Field>
        <Field label="Service type" error={errors.serviceType}>
          <select
            required
            value={values.serviceType}
            onChange={(e) => update("serviceType", e.target.value as QuoteFormValues["serviceType"])}
            className={inputClass(!!errors.serviceType)}
          >
            {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value} className="bg-aggregate text-chalk">
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Project description" error={errors.projectDescription}>
          <textarea
            required
            rows={4}
            value={values.projectDescription}
            onChange={(e) => update("projectDescription", e.target.value)}
            className={inputClass(!!errors.projectDescription)}
          />
        </Field>
      </div>

      <div className="mt-4 max-w-xs">
        <Field label="Preferred date (optional)" error={errors.preferredDate}>
          <input
            type="date"
            value={values.preferredDate}
            onChange={(e) => update("preferredDate", e.target.value)}
            className={inputClass(!!errors.preferredDate)}
          />
        </Field>
      </div>

      {status === "error" && message && (
        <p role="alert" className="mt-4 border border-flame bg-flame/10 p-3 font-tech text-xs text-flame font-bold">
          {message}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-6 justify-center text-lg disabled:opacity-70">
        {status === "submitting" ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending...
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" /> Submit Quote Request
          </>
        )}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full border-2 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk
    focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40
    ${hasError ? "border-flame" : "border-slurry/60"}`;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">{label}</label>
      {children}
      {error && <p className="mt-1 font-tech text-xs font-bold text-flame">{error}</p>}
    </div>
  );
}
