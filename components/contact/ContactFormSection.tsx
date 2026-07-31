"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
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
      <div className="flex flex-col items-center gap-3 rounded-sm border border-steel-light/30 bg-white p-10 text-center">
        <CheckCircle2 size={40} className="text-mtnGreen" aria-hidden="true" />
        <p className="font-display text-lg uppercase text-charcoal">Request Received</p>
        <p className="max-w-sm text-sm text-steel">{message}</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-2">
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-sm border border-steel-light/30 bg-white p-6">
      <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">Request a Quote</h2>

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

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <option key={value} value={value}>
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
        <p role="alert" className="mt-4 rounded-sm bg-orange-soft px-3 py-2 text-sm text-orange-hover">
          {message}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-5 disabled:opacity-70">
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending...
          </>
        ) : (
          "Submit Request"
        )}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-sm border bg-white px-3 py-2.5 text-sm text-charcoal shadow-sm
    focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30
    ${hasError ? "border-orange-hover" : "border-steel-light/50"}`;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-charcoal">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-orange-hover">{error}</p>}
    </div>
  );
}
