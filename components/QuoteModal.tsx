"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Loader2, Send } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<QuoteFormValues>({
    ...EMPTY_FORM,
    serviceType: defaultServiceType ?? EMPTY_FORM.serviceType,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!open || !mounted) return null;

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
    setTimeout(() => {
      setStatus("idle");
      setStatusMessage("");
    }, 200);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
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
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden border-2 border-slurry/60 bg-aggregate-deep text-chalk shadow-[6px_6px_0px_#0F1115]"
      >
        <div className="flex shrink-0 items-center justify-between border-b-2 border-slurry/40 bg-aggregate px-6 py-4">
          <div>
            <span className="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-flame">
              {"// PROJECT INQUIRY"}
            </span>
            <h2 id="quote-modal-title" className="font-display text-2xl uppercase tracking-wide text-chalk leading-tight">
              REQUEST A QUOTE
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center border border-slurry/50 bg-slurry/20 text-steel-light hover:border-flame hover:text-flame transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center overflow-y-auto">
            <CheckCircle2 size={48} className="text-ochre" aria-hidden="true" />
            <p className="font-display text-2xl uppercase tracking-wide text-chalk">Request Received</p>
            <p className="max-w-sm font-body text-sm text-steel-light">{statusMessage}</p>
            <button type="button" onClick={handleClose} className="btn-secondary mt-4">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
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

            <Field label="Full Name" htmlFor="name" error={errors.name} required>
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
              <Field label="Phone Number" htmlFor="phone" error={errors.phone} required>
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
              <Field label="Email Address" htmlFor="email" error={errors.email} required>
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

            <Field label="Service Required" htmlFor="serviceType" error={errors.serviceType} required>
              <select
                id="serviceType"
                required
                value={values.serviceType}
                onChange={(e) => updateField("serviceType", e.target.value as ServiceType)}
                className={inputClass(!!errors.serviceType)}
              >
                {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="bg-aggregate text-chalk">
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Project Details & Scope"
              htmlFor="projectDescription"
              error={errors.projectDescription}
              required
            >
              <textarea
                id="projectDescription"
                required
                rows={4}
                placeholder="Job location, concrete depth/thickness, timeline, site access constraints..."
                value={values.projectDescription}
                onChange={(e) => updateField("projectDescription", e.target.value)}
                className={inputClass(!!errors.projectDescription)}
              />
            </Field>

            <Field label="Preferred Date (Optional)" htmlFor="preferredDate" error={errors.preferredDate}>
              <input
                id="preferredDate"
                type="date"
                value={values.preferredDate}
                onChange={(e) => updateField("preferredDate", e.target.value)}
                className={inputClass(!!errors.preferredDate)}
              />
            </Field>

            {status === "error" && statusMessage && (
              <p role="alert" className="border border-flame bg-flame/10 p-3 font-tech text-xs text-flame font-bold">
                {statusMessage}
              </p>
            )}

            <button type="submit" disabled={status === "submitting"} className="btn-primary mt-2 justify-center text-lg disabled:opacity-70">
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
            <p className="text-center font-tech text-xs text-steel-light mt-1">
              Need immediate emergency service?{" "}
              <a href="tel:8257341419" className="font-bold text-flame underline">
                Call 825-734-1419
              </a>
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

function inputClass(hasError: boolean) {
  return `w-full border-2 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk
    focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40
    ${hasError ? "border-flame" : "border-slurry/60"}`;
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
      <label htmlFor={htmlFor} className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
        {label} {required && <span className="text-flame">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 font-tech text-xs font-bold text-flame">
          {error}
        </p>
      )}
    </div>
  );
}
