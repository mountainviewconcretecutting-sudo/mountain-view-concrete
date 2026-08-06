import type { Metadata } from "next";
import { Scissors, CircleDot, HardHat, Wrench, WrenchIcon } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getServices, getEquipment } from "@/lib/actions/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services & Equipment",
  description:
    "Wall sawing, slab sawing, core drilling up to 22 inches, demolition, removal, equipment fleet, and additional property services in Calgary and Western Alberta.",
};

const ICON_MAP: Record<string, typeof Scissors> = {
  Scissors,
  CircleDot,
  HardHat,
  Wrench,
};

function getServiceIcon(iconName: string | null) {
  if (iconName && ICON_MAP[iconName]) {
    return ICON_MAP[iconName];
  }
  return Scissors;
}

export default async function ServicesPage() {
  const [services, equipmentList] = await Promise.all([
    getServices(),
    getEquipment(),
  ]);

  const cuttingServices = services.filter((s) => s.slug !== "property-services");
  const propertyService = services.find((s) => s.slug === "property-services");

  return (
    <>
      <section className="border-b-4 border-slurry/40 bg-aggregate-deep py-16 text-chalk md:py-24">
        <div className="container-page">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// WHAT WE DO"}
          </span>
          <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
            CONCRETE CUTTING &amp; PROPERTY SERVICES
          </h1>
        </div>
      </section>

      {/* Cutting Services Grid */}
      <section id="cutting" className="scroll-mt-20 bg-aggregate py-16 md:py-20 border-b-2 border-slurry/40">
        <div className="container-page grid grid-cols-1 gap-6 md:grid-cols-2">
          {cuttingServices.map((service) => {
            const Icon = getServiceIcon(service.icon_name);
            return (
              <div
                key={service.id}
                id={service.slug}
                className="scroll-mt-20 border-2 border-slurry/50 bg-aggregate-deep p-8 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115]"
              >
                <div className="flex h-12 w-12 items-center justify-center border border-flame/40 bg-flame/10 text-flame mb-4">
                  <Icon size={26} aria-hidden="true" />
                </div>
                <h2 className="font-display text-3xl uppercase tracking-wide text-chalk">{service.title}</h2>
                <p className="mt-3 font-body text-base leading-relaxed text-steel-light">{service.description}</p>
                {service.spec_list && service.spec_list.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2 border-t border-slurry/40 pt-4">
                    {service.spec_list.map((spec) => (
                      <li
                        key={spec}
                        className="border border-slurry/60 bg-slurry/20 px-3 py-1 font-tech text-xs font-bold uppercase tracking-wider text-flame"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Equipment Fleet Section */}
      <section id="equipment" className="scroll-mt-20 bg-aggregate-deep py-16 md:py-20 border-b-2 border-slurry/40">
        <div className="container-page">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center border border-ochre/40 bg-ochre/10 text-ochre">
              <WrenchIcon size={26} aria-hidden="true" />
            </div>
            <div>
              <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-ochre">
                {"// MACHINERY & FLEET"}
              </span>
              <h2 className="font-display text-3xl uppercase tracking-wide text-chalk md:text-4xl">EQUIPMENT &amp; FLEET INVENTORY</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentList.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between border-2 border-slurry/50 bg-aggregate p-6 shadow-[3px_3px_0px_#0F1115]"
              >
                <div>
                  {item.image_url ? (
                    <div className="relative mb-4 h-40 w-full overflow-hidden border border-slurry/50 bg-slurry/30">
                      <ImageWithFallback
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <h3 className="font-display text-2xl uppercase tracking-wide text-chalk">{item.name}</h3>
                  {item.description && (
                    <p className="mt-2 font-body text-sm leading-normal text-steel-light">{item.description}</p>
                  )}
                </div>
                {item.specs && item.specs.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-slurry/40 pt-4 font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                    {item.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-flame" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Property Services Section */}
      {propertyService && (
        <section
          id="property-services"
          className="scroll-mt-20 bg-aggregate py-16 text-chalk md:py-20 border-b-2 border-slurry/40"
        >
          <div className="container-page">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center border border-flame/40 bg-flame/10 text-flame shrink-0 mt-1">
                <Wrench size={26} aria-hidden="true" />
              </div>
              <div>
                <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
                  {"// ADDITIONAL CAPABILITIES"}
                </span>
                <h2 className="font-display text-4xl uppercase tracking-tight text-chalk">{propertyService.title}</h2>
                <p className="mt-2 max-w-2xl font-body text-base text-steel-light leading-relaxed">{propertyService.description}</p>
              </div>
            </div>
            {propertyService.spec_list && propertyService.spec_list.length > 0 && (
              <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 font-tech text-sm font-bold uppercase tracking-wider text-chalk sm:grid-cols-2 lg:grid-cols-3">
                {propertyService.spec_list.map((item) => (
                  <li key={item} className="border-b border-slurry/40 pb-3 flex items-center gap-2">
                    <span className="text-flame">▶</span> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </>
  );
}
