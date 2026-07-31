"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/lib/actions/admin";
import { SERVICE_TYPE_LABELS, type Lead, type LeadStatus } from "@/lib/types";

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-orange-soft text-orange-hover",
  contacted: "bg-mtnGreen-soft text-mtnGreen",
  quoted: "bg-fog text-charcoal",
  won: "bg-mtnGreen text-white",
  lost: "bg-steel-light/30 text-steel",
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [isPending, startTransition] = useTransition();

  if (leads.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-steel-light/50 bg-white p-8 text-center text-sm text-steel">
        No quote requests yet. New submissions from the site will show up here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-steel-light/30 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-steel-light/30 bg-fog text-xs uppercase tracking-wide text-steel">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Received</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-steel-light/20 align-top last:border-0">
              <td className="px-4 py-3 font-medium text-charcoal">{lead.name}</td>
              <td className="px-4 py-3 text-steel">
                <div>{lead.phone}</div>
                <div className="text-xs">{lead.email}</div>
              </td>
              <td className="px-4 py-3 text-steel">{SERVICE_TYPE_LABELS[lead.service_type]}</td>
              <td className="max-w-xs px-4 py-3 text-steel">
                <p className="line-clamp-3">{lead.project_description}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-steel">
                {new Date(lead.created_at).toLocaleDateString("en-CA")}
              </td>
              <td className="px-4 py-3">
                <select
                  aria-label={`Status for ${lead.name}`}
                  defaultValue={lead.status}
                  disabled={isPending}
                  onChange={(e) =>
                    startTransition(() => {
                      updateLeadStatus(lead.id, e.target.value as LeadStatus);
                    })
                  }
                  className={`rounded-full border-0 px-3 py-1 text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[lead.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
