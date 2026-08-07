"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateAdminPassword } from "@/lib/actions/admin";

export default function ChangePasswordPanel() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const res = await updateAdminPassword({ newPassword, confirmPassword });

    if (res.success) {
      setStatus("success");
      setMessage(res.message);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setStatus("error");
      setMessage(res.message);
    }
  }

  return (
    <div className="rounded-sm border border-steel-light/30 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound size={20} className="text-orange" aria-hidden="true" />
        <div>
          <h3 className="font-display text-base uppercase tracking-wide text-charcoal">
            Update Admin Password
          </h3>
          <p className="text-xs text-steel">
            Set a new secure password for your administrator account.
          </p>
        </div>
      </div>

      {status === "success" && (
        <div className="mb-4 flex items-center gap-2 rounded-sm border border-mtnGreen/30 bg-mtnGreen-soft p-3 text-xs text-mtnGreen font-medium">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && message && (
        <div className="mb-4 flex items-center gap-2 rounded-sm border border-orange/30 bg-orange-soft p-3 text-xs text-orange-hover font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-steel mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              className="w-full rounded-sm border border-steel-light/50 bg-white px-3 py-2 pl-9 text-sm text-charcoal focus:border-orange focus:outline-none"
            />
            <Lock size={15} className="absolute left-3 top-2.5 text-steel-light" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-steel mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={8}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              className="w-full rounded-sm border border-steel-light/50 bg-white px-3 py-2 pl-9 text-sm text-charcoal focus:border-orange focus:outline-none"
            />
            <Lock size={15} className="absolute left-3 top-2.5 text-steel-light" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary flex items-center gap-2 text-xs py-2 px-4 disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Updating...
              </>
            ) : (
              <>
                <KeyRound size={14} /> Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
