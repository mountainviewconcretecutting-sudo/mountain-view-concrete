"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { submitQuote } from "@/lib/actions/submitQuote";
import { SERVICE_TYPE_LABELS, type QuoteFormValues, type ServiceType } from "@/lib/types";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  defaultServiceType?: ServiceType;
}

const EMPTY_FORM: QuoteFormValues = {
  name: "",
  phone: "",
  email: "",
  serviceType: "wall_sawing",
  projectDescription: "",
  preferredDate: "",
  companyWebsite: "",
};

export default function QuoteModal({ open, onClose, defaultServiceType }: QuoteModalProps) {
  const [values, setValues] = useState<QuoteFormValues>({
    ...EMPTY_FORM,
    serviceType: defaultServiceType ?? EMPTY_FORM.serviceType,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Close on Escape, trap focus within the dialog while open.
  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function updateField<K extends keyof QuoteFormValues>(key: K, value: QuoteFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setStatusMessage("");

    const result = await submitQuote(values);

    if (result.success) {
      setStatus("success");
      setStatusMessage(result.message);
      setValues(EMPTY_FORM);
    } else {
      setStatus("error");
      setStatusMessage(result.message);
      setErrors(result.fieldErrors ?? {});
    }
  }

  function handleClose() {
    onClose();
    // Reset success/error state after the close animation would run.
    setTimeout(() => {
      setStatus("idle");
      setStatusMessage("");
    }, 200);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-hard/70 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-steel-light/30 px-6 py-4">
          <h2 id="quote-modal-title" className="font-display text-xl uppercase tracking-wide text-charcoal">
            Request a Quote
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="rounded p-1 text-steel hover:bg-fog hover:text-charcoal"
          >
            <X size={22} />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <CheckCircle2 size={44} className="text-mtnGreen" aria-hidden="true" />
            <p className="font-display text-lg uppercase text-charcoal">Request Received</p>
            <p className="max-w-sm text-sm text-steel">{statusMessage}</p>
            <button type="button" onClick={handleClose} className="btn-secondary mt-2">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-6 py-6">
            {/* Honeypot — hidden from real users, visible to bots that fill every field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="companyWebsite">Company website</label>
              <input
                id="companyWebsite"
                name="companyWebsite"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.companyWebsite}
                onChange={(e) => updateField("companyWebsite", e.target.value)}
              />
            </div>

            <Field label="Full name" htmlFor="name" error={errors.name} required>
              <input
                ref={firstFieldRef}
                id="name"
                type="text"
                required
                autoComplete="name"
                value={values.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass(!!errors.name)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone" htmlFor="phone" error={errors.phone} required>
                <input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={inputClass(!!errors.phone)}
                />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email} required>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClass(!!errors.email)}
                />
              </Field>
            </div>

            <Field label="Service type" htmlFor="serviceType" error={errors.serviceType} required>
              <select
                id="serviceType"
                required
                value={values.serviceType}
                onChange={(e) => updateField("serviceType", e.target.value as ServiceType)}
                className={inputClass(!!errors.serviceType)}
              >
                {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Project description"
              htmlFor="projectDescription"
              error={errors.projectDescription}
              required
            >
              <textarea
                id="projectDescription"
                required
                rows={4}
                placeholder="Tell us about the job: location, concrete thickness, timeline, access constraints..."
                value={values.projectDescription}
                onChange={(e) => updateField("projectDescription", e.target.value)}
                className={inputClass(!!errors.projectDescription)}
              />
            </Field>

            <Field label="Preferred date (optional)" htmlFor="preferredDate" error={errors.preferredDate}>
              <input
                id="preferredDate"
                type="date"
                value={values.preferredDate}
                onChange={(e) => updateField("preferredDate", e.target.value)}
                className={inputClass(!!errors.preferredDate)}
              />
            </Field>

            {status === "error" && statusMessage && (
              <p role="alert" className="rounded-sm bg-orange-soft px-3 py-2 text-sm text-orange-hover">
                {statusMessage}
              </p>
            )}

            <button type="submit" disabled={status === "submitting"} className="btn-primary mt-2 disabled:opacity-70">
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
            <p className="text-center text-xs text-steel">
              Prefer to talk now?{" "}
              <a href="tel:8257341419" className="font-medium text-orange underline">
                Call 825-734-1419
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-sm border bg-white px-3 py-2.5 text-sm text-charcoal shadow-sm
    focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30
    ${hasError ? "border-orange-hover" : "border-steel-light/50"}`;
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-charcoal">
        {label} {required && <span className="text-orange">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-orange-hover">
          {error}
        </p>
      )}
    </div>
  );
}
