"use client";

import { Home, Building2, Factory } from "lucide-react";
import EditableText from "@/components/edit-mode/EditableText";

interface SectorOverviewProps {
  isAdmin?: boolean;
  content?: {
    sector_title?: string;
    sector_res_copy?: string;
    sector_com_copy?: string;
    sector_ind_copy?: string;
  };
}

export default function SectorOverview({
  isAdmin = false,
  content = {},
}: SectorOverviewProps) {
  const title = content.sector_title || "BUILT FOR EVERY SCALE OF PROJECT";
  const resCopy = content.sector_res_copy || "Basement retrofits, drainage cuts, and small-scale demolition handled cleanly and on schedule.";
  const comCopy = content.sector_com_copy || "Tenant improvements, mechanical penetrations, and structural openings for active commercial sites.";
  const indCopy = content.sector_ind_copy || "Heavy wall sawing, large-diameter core drilling, and haul-away for industrial-scale projects.";

  return (
    <section className="bg-aggregate py-16 md:py-24 border-b-2 border-slurry/40">
      <div className="container-page">
        <div className="flex items-center gap-2">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// SECTOR OVERVIEW"}
          </span>
        </div>
        
        <EditableText
          contentKey="sector_title"
          initialValue={title}
          isAdmin={isAdmin}
          multiline={false}
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="border-2 border-slurry/50 bg-aggregate-deep p-8 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115] transition-all hover:border-flame">
            <div className="flex h-12 w-12 items-center justify-center border border-flame/40 bg-flame/10 text-flame mb-6">
              <Home size={26} aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl uppercase tracking-wide text-chalk">Residential</h3>
            <EditableText
              contentKey="sector_res_copy"
              initialValue={resCopy}
              isAdmin={isAdmin}
              multiline={true}
            />
          </div>

          <div className="border-2 border-slurry/50 bg-aggregate-deep p-8 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115] transition-all hover:border-flame">
            <div className="flex h-12 w-12 items-center justify-center border border-flame/40 bg-flame/10 text-flame mb-6">
              <Building2 size={26} aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl uppercase tracking-wide text-chalk">Commercial</h3>
            <EditableText
              contentKey="sector_com_copy"
              initialValue={comCopy}
              isAdmin={isAdmin}
              multiline={true}
            />
          </div>

          <div className="border-2 border-slurry/50 bg-aggregate-deep p-8 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115] transition-all hover:border-flame">
            <div className="flex h-12 w-12 items-center justify-center border border-flame/40 bg-flame/10 text-flame mb-6">
              <Factory size={26} aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl uppercase tracking-wide text-chalk">Industrial</h3>
            <EditableText
              contentKey="sector_ind_copy"
              initialValue={indCopy}
              isAdmin={isAdmin}
              multiline={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
