import { ArrowLeft } from 'lucide-react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to LinkCal
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose dark:prose-invert prose-gray max-w-none">
          <h1>Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400">Last updated: February 2, 2025</p>

          <h2>Introduction</h2>
          <p>
            LinkCal ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we handle information when you use our calendar sharing service at linkcal.link.
          </p>

          <h2>Our Privacy-First Approach</h2>
          <p>
            <strong>LinkCal is designed with privacy as a core principle.</strong> Your calendar data is 
            never stored on our servers. Instead, all event information is encoded directly in the URL 
            you share. This means:
          </p>
          <ul>
            <li>We cannot access your calendar events</li>
            <li>We do not store your event data in any database</li>
            <li>Your data exists only in the URLs you create and share</li>
            <li>Deleting a link means the data is gone forever</li>
          </ul>

          <h2>Information We Do Not Collect</h2>
          <p>We do not collect:</p>
          <ul>
            <li>Calendar event details (titles, dates, times, descriptions)</li>
            <li>Personal information from calendar viewers</li>
            <li>Tracking data or analytics about your calendar usage</li>
            <li>IP addresses or location data from viewers</li>
          </ul>

          <h2>Information We May Collect</h2>
          <p>
            <strong>For Pro Users:</strong> If you purchase a Pro license, we collect:
          </p>
          <ul>
            <li>Email address (for license delivery and support)</li>
            <li>Payment information (processed securely by Creem, our payment provider)</li>
            <li>License key and activation status</li>
          </ul>
          <p>
            This information is necessary to provide the Pro service and is handled in accordance with 
            applicable data protection laws.
          </p>

          <h2>Cookies and Local Storage</h2>
          <p>LinkCal uses browser local storage to:</p>
          <ul>
            <li>Remember your theme preference (light/dark mode)</li>
            <li>Store your Pro license key for automatic verification</li>
          </ul>
          <p>
            We do not use tracking cookies or third-party analytics cookies. No data is sent to 
            external analytics services.
          </p>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li>
              <strong>Creem</strong> - For payment processing. When you purchase a Pro license, Creem 
              handles the payment transaction. Please review{' '}
              <a href="https://creem.io/privacy" target="_blank" rel="noopener noreferrer">
                Creem's Privacy Policy
              </a>{' '}
              for information on how they handle your data.
            </li>
            <li>
              <strong>Vercel</strong> - For hosting our website. Vercel may collect basic server logs.
            </li>
          </ul>

          <h2>Data Security</h2>
          <p>
            Since we don't store your calendar data, there's no database to breach. For Pro users, 
            payment data is encrypted and processed by PCI-compliant payment providers. 
            Password-protected calendars (Pro feature) use client-side encryption.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            LinkCal is not directed at children under 13. We do not knowingly collect information 
            from children.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access any personal data we hold about you (Pro users)</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your data</li>
          </ul>
          <p>
            Since calendar data is stored in URLs you control, you can delete it simply by not 
            sharing the link.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page with an updated date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:support@linkcal.link">support@linkcal.link</a>
          </p>
        </article>
      </main>

      <footer className="py-8 text-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          <a href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            LinkCal
          </a>
          {' · '}
          <a href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
}
