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
      const parts = text.split("\n");
      return (
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold uppercase tracking-tight text-chalk animate-revealUp leading-none opacity-0 [animation-delay:0.25s] sm:text-6xl md:text-7xl lg:text-8xl">
          {parts[0]}
          {parts.length > 1 && (
            <>
              <br />
              <span className="text-orange">{parts.slice(1).join(" ")}</span>
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
      <p className="mt-6 max-w-2xl animate-revealUp font-body text-base text-steel-light leading-relaxed opacity-0 [animation-delay:0.4s] sm:text-lg md:text-xl">
        {text}
      </p>
    ),
  },
  about_story: {
    key: "about_story",
    label: "Company Story",
    page: "About",
    multiline: true,
    render: (text) => {
      const paragraphs = text.split("\n\n").filter(Boolean);
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
      <p className="mt-4 leading-relaxed text-steel">{text}</p>
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
  return <span>{text}</span>;
}
