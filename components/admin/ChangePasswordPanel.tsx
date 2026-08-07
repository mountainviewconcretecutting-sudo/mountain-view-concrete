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
    <div className="border-2 border-slurry/50 bg-aggregate-deep p-6 text-chalk shadow-[3px_3px_0px_#0F1115]">
      <div className="flex items-center gap-2 mb-4 border-b border-slurry/40 pb-3">
        <KeyRound size={20} className="text-flame" aria-hidden="true" />
        <div>
          <h3 className="font-display text-xl uppercase tracking-wider text-chalk font-bold">
            Update Admin Password
          </h3>
          <p className="font-body text-xs text-steel-light">
            Set a new secure password for your administrator account.
          </p>
        </div>
      </div>

      {status === "success" && (
        <div className="mb-4 flex items-center gap-2 border border-mtnGreen bg-mtnGreen/10 p-3 font-tech text-xs text-mtnGreen font-bold">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && message && (
        <div className="mb-4 flex items-center gap-2 border border-flame bg-flame/10 p-3 font-tech text-xs text-flame font-bold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="block font-tech text-xs font-bold uppercase tracking-wider text-chalk mb-1">
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
              className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 pl-10 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none"
            />
            <Lock size={15} className="absolute left-3.5 top-3.5 text-steel-light" />
          </div>
        </div>

        <div>
          <label className="block font-tech text-xs font-bold uppercase tracking-wider text-chalk mb-1">
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
              className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 pl-10 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none"
            />
            <Lock size={15} className="absolute left-3.5 top-3.5 text-steel-light" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary flex items-center gap-2 py-2.5 px-5 disabled:opacity-60"
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
