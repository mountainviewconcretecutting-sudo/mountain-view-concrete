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
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">What We Do</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">Concrete Cutting &amp; Property Services</h1>
        </div>
      </section>

      {/* Cutting Services Grid */}
      <section id="cutting" className="scroll-mt-20 bg-fog py-16 md:py-20">
        <div className="container-page grid grid-cols-1 gap-6 md:grid-cols-2">
          {cuttingServices.map((service) => {
            const Icon = getServiceIcon(service.icon_name);
            return (
              <div
                key={service.id}
                id={service.slug}
                className="scroll-mt-20 rounded-sm border border-steel-light/30 bg-white p-7"
              >
                <Icon size={30} className="text-orange" aria-hidden="true" />
                <h2 className="mt-4 text-2xl text-charcoal">{service.title}</h2>
                <p className="mt-2 leading-relaxed text-steel">{service.description}</p>
                {service.spec_list && service.spec_list.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2 border-t border-steel-light/20 pt-3">
                    {service.spec_list.map((spec) => (
                      <li
                        key={spec}
                        className="rounded-xs bg-fog px-2.5 py-1 font-mono text-xs text-steel"
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
      <section id="equipment" className="scroll-mt-20 bg-white py-16 md:py-20">
        <div className="container-page">
          <div className="flex items-center gap-3">
            <WrenchIcon size={28} className="text-orange" aria-hidden="true" />
            <div>
              <p className="eyebrow">Machinery &amp; Fleet</p>
              <h2 className="text-2xl text-charcoal md:text-3xl">Equipment &amp; Fleet Inventory</h2>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentList.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-sm border border-steel-light/30 bg-fog p-5"
              >
                <div>
                  {item.image_url ? (
                    <div className="relative mb-4 h-36 w-full overflow-hidden rounded-sm border border-steel-light/30">
                      <ImageWithFallback
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-lg font-medium text-charcoal">{item.name}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-normal text-steel">{item.description}</p>
                  )}
                </div>
                {item.specs && item.specs.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-steel-light/30 pt-3 text-xs text-steel">
                    {item.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange" />
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
          className="scroll-mt-20 cut-above bg-charcoal py-16 text-white md:py-20"
        >
          <div className="container-page">
            <div className="flex items-start gap-3">
              <Wrench size={28} className="mt-1 text-orange" aria-hidden="true" />
              <div>
                <h2 className="text-2xl md:text-3xl">{propertyService.title}</h2>
                <p className="mt-2 max-w-2xl text-white/70">{propertyService.description}</p>
              </div>
            </div>
            {propertyService.spec_list && propertyService.spec_list.length > 0 && (
              <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-3">
                {propertyService.spec_list.map((item) => (
                  <li key={item} className="border-b border-white/10 pb-3">
                    {item}
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
