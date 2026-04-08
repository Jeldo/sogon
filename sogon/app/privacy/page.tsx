export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
      <h1 className="text-2xl font-heading text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-neutral-400 mb-10">Last updated: April 8, 2025</p>

      <div className="space-y-8 text-base font-body text-neutral-700 leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>Sogon collects the following information to provide its services:</p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Email address and profile information via Google Sign-In</li>
            <li>Diary entries and attached images you create</li>
            <li>AI-generated reactions to your entries</li>
            <li>Your selected secret friend tone (warm / cool / energetic)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>To provide and maintain the diary service</li>
            <li>To generate AI friend reactions to your entries</li>
            <li>To sync your data across devices</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Third-Party Services</h2>
          <p>Sogon uses the following third-party services to operate:</p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li><strong>Supabase</strong> — Database and image storage (United States)</li>
            <li><strong>Google Gemini API</strong> — AI reaction generation (your entry content is sent to this API)</li>
            <li><strong>Google OAuth</strong> — Authentication</li>
            <li><strong>Vercel</strong> — Service hosting (United States)</li>
          </ul>
          <p className="text-neutral-500 text-sm">
            We do not sell or share your personal information with any other third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Data Retention</h2>
          <p>
            Your data is retained for as long as you use the service. Upon account deletion
            or a deletion request, all associated data will be permanently removed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Security</h2>
          <p>
            All data is protected so that only you can access it. Row-level security
            policies ensure no other user can view or modify your entries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Your Rights</h2>
          <p>You may exercise the following rights at any time:</p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Access and review your personal data</li>
            <li>Delete your entries or request full account deletion</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
          <p>
            For privacy-related inquiries, please contact us at:
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
