export default function TermsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
      <h1 className="text-2xl font-heading text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-neutral-400 mb-10">Last updated: April 8, 2025</p>

      <div className="space-y-8 text-base font-body text-neutral-700 leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. About the Service</h2>
          <p>
            Sogon is a private diary service where an AI secret friend reacts to your daily entries.
            These terms govern your use of the Sogon service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Eligibility</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>You must sign in with a Google account to use the service.</li>
            <li>The service is intended for users aged 14 and older.</li>
            <li>Use is permitted for personal, non-commercial purposes only.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Prohibited Conduct</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Accessing or attempting to access another user's account or data</li>
            <li>Using the service for commercial purposes or reproducing/distributing it</li>
            <li>Submitting unlawful or harmful content</li>
            <li>Interfering with the normal operation of the service</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Service Changes and Termination</h2>
          <p>
            We may modify or discontinue the service at any time. Significant changes
            will be communicated through in-service notices where reasonably possible.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Disclaimer</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>AI reactions are for personal enjoyment only and do not constitute professional advice.</li>
            <li>
              We are not liable for data loss caused by circumstances beyond our control,
              such as natural disasters or system failures.
            </li>
            <li>You are solely responsible for the content of your entries.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Governing Law</h2>
          <p>These terms are governed by and construed in accordance with the laws of the Republic of Korea.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
          <p>
            For service-related inquiries, please contact us at:
            <br />
            <a
              href="mailto:astrokwak@gmail.com"
              className="text-primary-600 hover:underline"
            >
              astrokwak@gmail.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
