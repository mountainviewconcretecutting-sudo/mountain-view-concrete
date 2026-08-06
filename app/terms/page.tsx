import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Mountain View Concrete Cutting Inc. Guidelines governing website use, quote requests, and contractual service agreements.",
};

export default function TermsPage() {
  return (
    <>
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">Legal &amp; Compliance</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">Terms of Service</h1>
        </div>
      </section>

      <section className="bg-fog py-16 md:py-20">
        <div className="container-page max-w-4xl rounded-sm border border-steel-light/30 bg-white p-8 text-charcoal md:p-12">
          <p className="font-mono text-xs uppercase text-steel">Last Updated: August 2026</p>

          <div className="mt-6 space-y-6 text-sm leading-relaxed text-steel">
            <p>
              Welcome to the website of Mountain View Concrete Cutting Inc. (&quot;2549952 Alberta Inc.&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our website, requesting a quote, or submitting project information, you agree to comply with and be bound by the following Terms of Service.
            </p>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              1. Services &amp; Job Estimates
            </h2>
            <p>
              All online quote submissions, price estimates, and scheduling requests provided through this website are preliminary inquiries. Binding agreements for concrete sawing, wall sawing, core drilling, or demolition services are subject to formal site inspection, job specification confirmation, and written agreement.
            </p>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              2. Website Content &amp; Intellectual Property
            </h2>
            <p>
              The content, images, text, design logos, and project portfolio materials featured on this website are the property of Mountain View Concrete Cutting Inc. and protected by applicable copyright and trademark laws. You may not reproduce, copy, or redistribute any site content without prior written permission.
            </p>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              3. User Submissions &amp; Testimonials
            </h2>
            <p>
              By submitting project comments, reviews, or customer testimonials on our website, you grant Mountain View Concrete Cutting Inc. a non-exclusive, royalty-free right to publish and feature your submitted feedback on our public marketing channels following administrative review.
            </p>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              4. Limitation of Liability
            </h2>
            <p>
              While we strive to ensure all information on this website is accurate and up to date, the website content is provided on an &quot;as-is&quot; basis. Mountain View Concrete Cutting Inc. shall not be liable for any direct, indirect, or consequential damages resulting from your use of this website.
            </p>

            <h2 className="border-t border-steel-light/20 pt-4 font-display text-xl uppercase text-charcoal">
              5. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the Province of Alberta and the federal laws of Canada applicable therein.
            </p>

            <div className="mt-6 rounded-sm bg-fog p-4 font-mono text-xs text-charcoal space-y-1">
              <p><strong>Mountain View Concrete Cutting Inc. (2549952 Alberta Inc.)</strong></p>
              <p>3904 3A Street NE, Calgary, Alberta T2E 6R4</p>
              <p>Direct Line: 825-734-1419 | Email: crafuse0@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
