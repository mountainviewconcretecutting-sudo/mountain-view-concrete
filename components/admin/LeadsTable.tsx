"use client";

import { useTransition, useOptimistic } from "react";
import { Trash2 } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/lib/actions/admin";
import { SERVICE_TYPE_LABELS, type Lead, type LeadStatus } from "@/lib/types";

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-flame text-white font-bold",
  contacted: "bg-mtnGreen text-white font-bold",
  quoted: "bg-slurry/40 text-chalk font-bold border border-slurry/80",
  won: "bg-emerald-600 text-white font-bold",
  lost: "bg-slurry/20 text-steel-light border border-slurry/40",
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLeads, setOptimisticLeads] = useOptimistic(
    leads,
    (current, deletedId: string) => current.filter((l) => l.id !== deletedId)
  );

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete the quote request from "${name}"? This cannot be undone.`)) return;
    startTransition(() => {
      setOptimisticLeads(id);
      deleteLead(id);
    });
  }

  if (optimisticLeads.length === 0) {
    return (
      <p className="border-2 border-dashed border-slurry/50 bg-aggregate-deep p-8 text-center font-body text-sm text-steel-light">
        No quote requests yet. New submissions from the site will show up here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-slurry/50 bg-aggregate-deep shadow-[3px_3px_0px_#0F1115]">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b-2 border-slurry/50 bg-slurry/20 font-tech text-xs uppercase tracking-wider text-flame">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Received</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slurry/30">
          {optimisticLeads.map((lead) => (
            <tr key={lead.id} className="align-top hover:bg-slurry/10 transition-colors">
              <td className="px-4 py-3.5 font-display text-base uppercase text-chalk font-bold">{lead.name}</td>
              <td className="px-4 py-3.5 text-steel-light font-body">
                <div className="font-semibold text-chalk">{lead.phone}</div>
                <div className="text-xs text-steel-light">{lead.email}</div>
              </td>
              <td className="px-4 py-3.5 font-tech text-xs uppercase font-bold text-flame">{SERVICE_TYPE_LABELS[lead.service_type]}</td>
              <td className="max-w-xs px-4 py-3.5 font-body text-sm text-steel-light">
                <p className="line-clamp-3 leading-relaxed">{lead.project_description}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-steel-light">
                {new Date(lead.created_at).toLocaleDateString("en-CA")}
              </td>
              <td className="px-4 py-3.5">
                <select
                  aria-label={`Status for ${lead.name}`}
                  defaultValue={lead.status}
                  disabled={isPending}
                  onChange={(e) =>
                    startTransition(() => {
                      updateLeadStatus(lead.id, e.target.value as LeadStatus);
                    })
                  }
                  className={`rounded-none border border-slurry/60 bg-aggregate px-3 py-1.5 font-tech text-xs uppercase tracking-wider ${STATUS_STYLES[lead.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-aggregate-deep text-chalk">
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-right">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(lead.id, lead.name)}
                  className="flex h-8 w-8 items-center justify-center border border-flame/40 bg-flame/10 text-flame hover:bg-flame hover:text-white transition-colors disabled:opacity-50 inline-flex"
                  title="Delete quote request"
                  aria-label={`Delete quote request from ${lead.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
