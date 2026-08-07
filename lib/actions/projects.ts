import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-peak-fitness-cutting",
    title: "Peak Fitness Commercial Apron & Sidewalk Sawing",
    category: "commercial",
    service_type: "slab_sawing",
    summary:
      "Flat slab and asphalt curb cutting for commercial entrance modifications outside Peak Fitness Athletic Training Center. Clean expansion joints and flush curb cuts for ADA-compliant ramp access.",
    image_url: "/images/projects/residential-driveway-cutting.jpg",
    location: "Airdrie Commercial Centre, AB",
    completed_on: "2026-02-15T00:00:00.000Z",
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "proj-mckee-homes-driveway",
    title: "McKee Homes Residential Driveway & Apron Cutting",
    category: "residential",
    service_type: "slab_sawing",
    summary:
      "Precision contraction joint cutting and perimeter slab sawing for a newly poured residential driveway in a McKee Homes community. Delivered clean edge cuts without surface spalling.",
    image_url: "/images/projects/commercial-site-pad-sawing.jpg",
    location: "Cooper's Crossing, Airdrie, AB",
    completed_on: "2026-03-01T00:00:00.000Z",
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "proj-balzac-industrial-floor",
    title: "Balzac Industrial Distribution Centre Floor Jointing",
    category: "industrial",
    service_type: "slab_sawing",
    summary:
      "High-production indoor slab sawing for high-traffic warehouse floor expansion joints. Utilized zero-emission electric flat saws with continuous water suppression to eliminate site dust.",
    image_url: "/images/projects/precision-slab-sawing.jpg",
    location: "Balzac Distribution Park, Rocky View County, AB",
    completed_on: "2026-03-20T00:00:00.000Z",
    is_featured: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "proj-downtown-core-drilling",
    title: "Commercial Tower Mechanical Core Drilling",
    category: "commercial",
    service_type: "core_drilling",
    summary:
      "Precision 12\" and 18\" core drilling penetrations through 14-inch reinforced concrete floor slabs for new HVAC and electrical conduit risers in a 12-storey commercial office tower.",
    image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    location: "Downtown Calgary, AB",
    completed_on: "2026-01-10T00:00:00.000Z",
    is_featured: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "proj-substation-wall-sawing",
    title: "Electrical Substation Vault Track Wall Sawing",
    category: "industrial",
    service_type: "wall_sawing",
    summary:
      "Track-mounted hydraulic wall sawing through 20-inch reinforced concrete vault walls for heavy utility cable ducting. Cut clean 6x8 ft wall openings without over-cutting.",
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?q=80&w=1200&auto=format&fit=crop",
    location: "East Shepard Industrial Area, Calgary, AB",
    completed_on: "2026-02-05T00:00:00.000Z",
    is_featured: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "proj-egress-window-cutting",
    title: "Residential Basement Egress Window Concrete Cutting",
    category: "residential",
    service_type: "wall_sawing",
    summary:
      "Precision hydraulic wall sawing through 10-inch poured concrete basement foundation to install egress window units and window wells. Completely dust-free wet cutting process.",
    image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
    location: "Signal Hill, Calgary, AB",
    completed_on: "2026-02-28T00:00:00.000Z",
    is_featured: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "proj-loading-dock-demolition",
    title: "Commercial Warehouse Loading Dock Breakout & Haul-Away",
    category: "commercial",
    service_type: "demolition_removal",
    summary:
      "Selective concrete demolition and hydraulic breaker breakout for a deteriorated loading dock slab, followed by Bobcat loader cleanup and 14,000 lb dump trailer haul-away.",
    image_url: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=1200&auto=format&fit=crop",
    location: "Northeast Industrial Corridor, Calgary, AB",
    completed_on: "2026-03-12T00:00:00.000Z",
    is_featured: false,
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: "proj-loop-detector-cutting",
    title: "Security Gate Induction Loop Slot Cutting & Sealing",
    category: "industrial",
    service_type: "additional_property_services",
    summary:
      "Precision asphalt & concrete trench sawing for automated vehicle induction loops at a logistics facility entrance gate, followed by heavy-duty sealant installation.",
    image_url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=1200&auto=format&fit=crop",
    location: "Great Plains Industrial Area, Calgary, AB",
    completed_on: "2026-03-25T00:00:00.000Z",
    is_featured: false,
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
];

export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_PROJECTS;
    }
    return data as Project[];
  } catch (err) {
    console.error("Failed to load projects, using default project portfolio:", err);
    return DEFAULT_PROJECTS;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .limit(6);

    if (error || !data || data.length === 0) {
      return DEFAULT_PROJECTS.filter((p) => p.is_featured);
    }
    return data as Project[];
  } catch (err) {
    console.error("Failed to load featured projects, using default project portfolio:", err);
    return DEFAULT_PROJECTS.filter((p) => p.is_featured);
  }
}
