import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Service, Equipment } from "@/lib/types";

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "default-wall-sawing",
    title: "Wall Sawing",
    slug: "wall-sawing",
    description:
      "Precision cutting through reinforced concrete walls for new openings, doorways, and mechanical penetrations — indoors or out, on active job sites.",
    spec_list: ["Up to 24\" depth", "Flush cutting capable", "Track-mounted electric/hydraulic saws"],
    icon_name: "Scissors",
    image_url: null,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-slab-sawing",
    title: "Slab Sawing",
    slug: "slab-sawing",
    description:
      "High-capacity floor and flat slab sawing for retrofits, utility trenches, and structural modifications, with clean, accurate cut lines.",
    spec_list: ["Electric & diesel flat saws", "Control joint sawing", "Trenching up to 18\" depth"],
    icon_name: "Scissors",
    image_url: null,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-core-drilling",
    title: "Core Drilling",
    slug: "core-drilling",
    description:
      "Precision core drilling capabilities up to 22 inches in diameter, for conduit runs, plumbing penetrations, anchor bolts, and structural inspections.",
    spec_list: ["Up to 22\" diameter", "Any angle / ceiling mounting", "Electric & hydraulic rigs"],
    icon_name: "CircleDot",
    image_url: null,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-demolition-removal",
    title: "Demolition & Removal",
    slug: "demolition-removal",
    description:
      "Safe concrete demolition and jackhammering, Bobcat and mini-excavator operation, and full haul-away disposal — left clean and job-site ready.",
    spec_list: ["Selective structural demolition", "Robotic/hydraulic hammering", "Full site cleanup & disposal"],
    icon_name: "HardHat",
    image_url: null,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-property-services",
    title: "Additional Property Services",
    slug: "property-services",
    description:
      "Beyond concrete, our crew handles a range of property maintenance and installation work for the same commercial and residential clients we cut for.",
    spec_list: [
      "Parking lot line painting",
      "Wall painting",
      "Furnace & AC maintenance",
      "Roof maintenance",
      "Snow removal",
      "Topsoil supply",
      "Turf installation",
      "Lawn care and fertilization",
      "Sprinkler installation and repair",
      "Bollard installation",
      "Mobile welding services",
      "Security camera installation",
      "Detector loop installation",
    ],
    icon_name: "Wrench",
    image_url: null,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_EQUIPMENT: Equipment[] = [
  {
    id: "default-eq-1",
    name: "Mini excavator (Mini Ho)",
    description: "Compact excavator for tight-access interior and exterior excavation and concrete removal.",
    specs: ["Rubber tracks", "Hydraulic breaker attachment", "Zero tail-swing"],
    image_url: null,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-eq-2",
    name: "Bobcat Skid-Steer",
    description: "High-capacity loader for efficient debris removal, gravel placement, and site grading.",
    specs: ["Heavy duty bucket", "High-flow hydraulics", "Enclosed cab"],
    image_url: null,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-eq-3",
    name: "Dump trailer",
    description: "Heavy-duty dump trailer for fast material haul-away and concrete slab disposal.",
    specs: ["14,000 lbs GVWR", "Hydraulic lift dump", "Tarp cover system"],
    image_url: null,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-eq-4",
    name: "22-inch capacity core drills",
    description: "Heavy-duty electric and hydraulic core drill rigs capable of penetrating heavily reinforced concrete up to 22\" diameter.",
    specs: ["22\" diameter capacity", "Vacuum-base and anchor-base mounts", "Multi-speed gearboxes"],
    image_url: null,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_SERVICES;
    }
    return data as Service[];
  } catch (err) {
    console.error("Failed to fetch services:", err);
    return DEFAULT_SERVICES;
  }
}

export async function getEquipment(): Promise<Equipment[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_EQUIPMENT;
    }
    return data as Equipment[];
  } catch (err) {
    console.error("Failed to fetch equipment:", err);
    return DEFAULT_EQUIPMENT;
  }
}
