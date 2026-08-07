"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminLogin } from "@/lib/actions/admin";
import type { ActionResult } from "@/lib/types";

const initialState: ActionResult = { success: false, message: "" };

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(adminLogin, initialState);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-fog px-4 py-16">
      <div className="w-full max-w-sm rounded-sm bg-white p-8 shadow-md border border-slate-200">
        <h1 className="font-display text-2xl uppercase tracking-wide text-charcoal font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-600 font-medium">Mountain View Concrete Cutting Inc.</p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-charcoal">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-charcoal">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>

          {!state.success && state.message && (
            <p role="alert" className="text-sm font-semibold text-flame">
              {state.message}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary mt-2 disabled:opacity-70">
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}
