import type { ReactNode } from "react";

export interface EditableFieldConfig {
  key: string;
  label: string;       // Human-readable name, for future admin UI use
  page: string;        // Which page this field lives on, for future admin UI use
  multiline: boolean;  // Whether the edit textarea should be multi-line
  render: (text: string) => ReactNode; // How to format the saved text for display
}

export const EDITABLE_FIELDS: Record<string, EditableFieldConfig> = {
  hero_tagline: {
    key: "hero_tagline",
    label: "Hero Headline",
    page: "Homepage",
    multiline: true,
    render: (text) => {
      const normalized = (text || "").replace(/\\n/g, "\n");
      const parts = normalized.split("\n");
      return (
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold uppercase tracking-tight text-chalk leading-none sm:text-6xl md:text-7xl lg:text-8xl">
          {parts[0]}
          {parts.length > 1 && (
            <>
              <br />
              <span className="text-flame">{parts.slice(1).join(" ")}</span>
            </>
          )}
        </h1>
      );
    },
  },
  hero_subtext: {
    key: "hero_subtext",
    label: "Hero Subtext",
    page: "Homepage",
    multiline: true,
    render: (text) => (
      <p className="mt-6 max-w-2xl font-body text-base text-steel-light leading-relaxed sm:text-lg md:text-xl">
        {(text || "").replace(/\\n/g, "\n")}
      </p>
    ),
  },
  sector_title: {
    key: "sector_title",
    label: "Sector Headline",
    page: "Homepage",
    multiline: false,
    render: (text) => (
      <h2 className="mt-2 max-w-xl font-display text-4xl uppercase tracking-tight text-chalk md:text-5xl">
        {text}
      </h2>
    ),
  },
  sector_res_copy: {
    key: "sector_res_copy",
    label: "Residential Sector Description",
    page: "Homepage",
    multiline: true,
    render: (text) => (
      <p className="mt-3 font-body text-sm leading-relaxed text-steel">{text}</p>
    ),
  },
  sector_com_copy: {
    key: "sector_com_copy",
    label: "Commercial Sector Description",
    page: "Homepage",
    multiline: true,
    render: (text) => (
      <p className="mt-3 font-body text-sm leading-relaxed text-steel">{text}</p>
    ),
  },
  sector_ind_copy: {
    key: "sector_ind_copy",
    label: "Industrial Sector Description",
    page: "Homepage",
    multiline: true,
    render: (text) => (
      <p className="mt-3 font-body text-sm leading-relaxed text-steel">{text}</p>
    ),
  },
  cta_title: {
    key: "cta_title",
    label: "CTA Band Headline",
    page: "Homepage",
    multiline: false,
    render: (text) => (
      <h2 className="mt-1 font-display text-3xl uppercase tracking-tight text-chalk md:text-4xl">
        {text}
      </h2>
    ),
  },
  cta_subtext: {
    key: "cta_subtext",
    label: "CTA Band Subtext",
    page: "Homepage",
    multiline: true,
    render: (text) => (
      <p className="mt-2 max-w-xl font-body text-sm text-steel-light leading-relaxed">
        {text}
      </p>
    ),
  },
  about_headline: {
    key: "about_headline",
    label: "About Hero Headline",
    page: "About",
    multiline: true,
    render: (text) => (
      <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
        {text}
      </h1>
    ),
  },
  about_story: {
    key: "about_story",
    label: "Company Story",
    page: "About",
    multiline: true,
    render: (text) => {
      const normalized = (text || "").replace(/\\n/g, "\n");
      const paragraphs = normalized.split("\n\n").filter(Boolean);
      return (
        <>
          {paragraphs.map((p, idx) => (
            <p key={idx} className="mt-4 leading-relaxed text-steel">
              {p}
            </p>
          ))}
        </>
      );
    },
  },
  about_mission: {
    key: "about_mission",
    label: "Mission Statement",
    page: "About",
    multiline: true,
    render: (text) => (
      <p className="mt-4 leading-relaxed text-steel">{(text || "").replace(/\\n/g, "\n")}</p>
    ),
  },
  contact_headline: {
    key: "contact_headline",
    label: "Contact Page Headline",
    page: "Contact",
    multiline: true,
    render: (text) => (
      <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
        {text}
      </h1>
    ),
  },
  contact_subtext: {
    key: "contact_subtext",
    label: "Contact Page Subtext",
    page: "Contact",
    multiline: true,
    render: (text) => (
      <p className="mt-4 max-w-2xl font-body text-base text-steel-light leading-relaxed sm:text-lg">
        {text}
      </p>
    ),
  },
  contact_phone: {
    key: "contact_phone",
    label: "Contact Phone Number",
    page: "Contact",
    multiline: false,
    render: (text) => (
      <a href={`tel:${text.replace(/[^0-9]/g, "")}`} className="font-body text-base text-steel-light hover:text-flame transition-colors font-bold">
        {text}
      </a>
    ),
  },
  contact_email: {
    key: "contact_email",
    label: "Contact Email Address",
    page: "Contact",
    multiline: false,
    render: (text) => (
      <a href={`mailto:${text}`} className="font-body text-base text-steel-light hover:text-flame transition-colors font-bold">
        {text}
      </a>
    ),
  },
  contact_address: {
    key: "contact_address",
    label: "Contact Physical Address",
    page: "Contact",
    multiline: true,
    render: (text) => (
      <p className="font-body text-sm text-steel-light">{text}</p>
    ),
  },
  contact_hours: {
    key: "contact_hours",
    label: "Contact Availability & Hours",
    page: "Contact",
    multiline: false,
    render: (text) => (
      <p className="font-tech text-sm text-ochre font-bold">{text}</p>
    ),
  },
  contact_coverage_title: {
    key: "contact_coverage_title",
    label: "Coverage Region Title",
    page: "Contact",
    multiline: false,
    render: (text) => (
      <h3 className="mt-1 font-display text-2xl uppercase tracking-wide text-chalk">{text}</h3>
    ),
  },
  contact_coverage_subtext: {
    key: "contact_coverage_subtext",
    label: "Coverage Region Subtext",
    page: "Contact",
    multiline: true,
    render: (text) => (
      <p className="mt-2 font-body text-xs text-steel-light leading-relaxed">{text}</p>
    ),
  },
  services_hero_title: {
    key: "services_hero_title",
    label: "Services Page Hero Title",
    page: "Services",
    multiline: true,
    render: (text) => (
      <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
        {text}
      </h1>
    ),
  },
  services_hero_subtext: {
    key: "services_hero_subtext",
    label: "Services Page Hero Subtext",
    page: "Services",
    multiline: true,
    render: (text) => (
      <p className="mt-4 font-body text-base text-steel-light leading-relaxed max-w-2xl">
        {text}
      </p>
    ),
  },
  services_preview_title: {
    key: "services_preview_title",
    label: "Services Section Preview Title",
    page: "Homepage",
    multiline: false,
    render: (text) => (
      <h2 className="mt-2 max-w-xl font-display text-4xl uppercase tracking-tight text-chalk md:text-5xl">
        {text}
      </h2>
    ),
  },
  projects_hero_title: {
    key: "projects_hero_title",
    label: "Projects Page Hero Title",
    page: "Projects",
    multiline: true,
    render: (text) => (
      <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
        {text}
      </h1>
    ),
  },
  projects_preview_title: {
    key: "projects_preview_title",
    label: "Projects Section Preview Title",
    page: "Homepage",
    multiline: false,
    render: (text) => (
      <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-chalk md:text-5xl">
        {text}
      </h2>
    ),
  },
  updates_hero_title: {
    key: "updates_hero_title",
    label: "Updates Page Hero Title",
    page: "Updates",
    multiline: true,
    render: (text) => (
      <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
        {text}
      </h1>
    ),
  },
  updates_hero_subtext: {
    key: "updates_hero_subtext",
    label: "Updates Page Hero Subtext",
    page: "Updates",
    multiline: true,
    render: (text) => (
      <p className="mt-4 font-body text-base text-steel-light leading-relaxed max-w-2xl">
        {text}
      </p>
    ),
  },
};

/**
 * Default rendering for any key not in the registry — plain text, no formatting.
 * Keeps EditableText usable for simple fields without requiring a registry entry.
 */
export function renderEditableField(key: string, text: string): ReactNode {
  const config = EDITABLE_FIELDS[key];
  if (config?.render) return config.render(text);
  return <span>{(text || "").replace(/\\n/g, "\n")}</span>;
}
