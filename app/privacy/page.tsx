import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Mountain View Concrete Cutting Inc. Details on how we collect, store, and protect client and project contact information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">Legal &amp; Compliance</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">Privacy Policy</h1>
        </div>
      </section>

      <section className="bg-fog py-16 md:py-20">
        <div className="container-page max-w-4xl rounded-sm border border-steel-light/30 bg-white p-8 text-charcoal md:p-12">
          <p className="font-mono text-xs uppercase text-steel">Last Updated: August 2026</p>

          <div className="mt-6 space-y-6 text-sm leading-relaxed text-steel">
            <p>
              Mountain View Concrete Cutting Inc. (&quot;2549952 Alberta Inc.&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) values your privacy and is committed to protecting the personal information collected through our website. This Privacy Policy outlines how we collect, use, store, and safeguard your data under applicable Canadian and Alberta privacy laws (including PIPA).
            </p>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              1. Information We Collect
            </h2>
            <p>
              When you submit a quote request, contact inquiry, or customer review through our website, we collect personal information necessary to respond to your request and scope your job, including:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-charcoal">
              <li>Full Name</li>
              <li>Phone Number and Email Address</li>
              <li>Project Details, Preferred Schedule, and Site Location Specs</li>
              <li>Customer Testimonial Feedback (if voluntarily submitted)</li>
            </ul>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              2. How We Use Your Information
            </h2>
            <p>We collect and use your information strictly for legitimate business purposes:</p>
            <ul className="list-disc space-y-1 pl-5 text-charcoal">
              <li>To evaluate job specifications and provide accurate concrete cutting quotes.</li>
              <li>To contact you regarding your scheduled project or emergency service request.</li>
              <li>To publish client-approved reviews and project testimonials on our website.</li>
              <li>To send automated transactional email notifications concerning your submitted leads.</li>
            </ul>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              3. Data Storage &amp; Security
            </h2>
            <p>
              Your contact and project submission data is stored securely in our managed cloud database infrastructure (Supabase) protected by Row Level Security (RLS) policies. Access to lead details is strictly limited to authorized administrative personnel. We do not sell, rent, or trade client information to third parties or advertisers.
            </p>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              4. Analytics &amp; Cookies
            </h2>
            <p>
              Our website uses basic functional session state to support administrative authentication and user interactions. <em>(Note: Website performance analytics and conversion measurement tracking may be implemented in future website updates to improve user experience.)</em>
            </p>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              5. Privacy Contact Inquiries
            </h2>
            <p>
              If you have any questions about this Privacy Policy or wish to request the removal or update of your personal contact information, please contact us:
            </p>
            <div className="space-y-1 rounded-sm bg-fog p-4 font-mono text-xs text-charcoal">
              <p><strong>Mountain View Concrete Cutting Inc.</strong></p>
              <p>3904 3A Street NE, Calgary, Alberta T2E 6R4</p>
              <p>Phone: 825-734-1419</p>
              <p>Email: crafuse0@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
