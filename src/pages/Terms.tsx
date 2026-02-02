import { ArrowLeft } from 'lucide-react';

export function Terms() {
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
          <h1>Terms of Service</h1>
          <p className="text-gray-500 dark:text-gray-400">Last updated: February 2, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using LinkCal ("the Service"), you agree to be bound by these Terms of 
            Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            LinkCal is a calendar sharing service that allows users to create shareable calendar links. 
            The Service includes:
          </p>
          <ul>
            <li><strong>Free Tier:</strong> Basic calendar creation and sharing functionality</li>
            <li>
              <strong>Pro Tier:</strong> Additional features including password protection, 
              custom expiration dates, branding removal, and priority support
            </li>
          </ul>

          <h2>3. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Use the Service only for lawful purposes</li>
            <li>Not share calendars containing illegal, harmful, or offensive content</li>
            <li>Not attempt to circumvent any security features</li>
            <li>Not use the Service to spam or harass others</li>
            <li>Keep your license key confidential (Pro users)</li>
          </ul>

          <h2>4. Pro Subscription Terms</h2>
          
          <h3>4.1 Payment</h3>
          <p>
            Pro subscriptions are billed monthly or as a one-time lifetime purchase. All payments 
            are processed securely through Creem, our merchant of record.
          </p>

          <h3>4.2 License Keys</h3>
          <p>
            Upon purchase, you will receive a license key via email. This key is personal and 
            non-transferable. You may use the key on multiple devices for personal use.
          </p>

          <h3>4.3 Subscription Renewal</h3>
          <p>
            Monthly subscriptions automatically renew until canceled. You can cancel at any time 
            through the customer portal link in your purchase confirmation email. Cancellation 
            takes effect at the end of the current billing period.
          </p>

          <h3>4.4 Refund Policy</h3>
          <p>
            We offer refunds under the following conditions:
          </p>
          <ul>
            <li>
              <strong>Monthly Subscriptions:</strong> Refunds are available within 7 days of initial 
              purchase if you haven't used Pro features extensively. Renewal payments are non-refundable.
            </li>
            <li>
              <strong>Lifetime Licenses:</strong> Refunds are available within 14 days of purchase 
              if you haven't used Pro features extensively.
            </li>
          </ul>
          <p>
            To request a refund, contact us at{' '}
            <a href="mailto:support@linkcal.link">support@linkcal.link</a> with your order details.
          </p>

          <h2>5. Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our{' '}
            <a href="/privacy">Privacy Policy</a>. Key points:
          </p>
          <ul>
            <li>Calendar data is stored in URLs, not on our servers</li>
            <li>We do not have access to your calendar content</li>
            <li>Pro user payment information is handled by our payment provider</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service, including its original content, features, and functionality, is owned by 
            LinkCal and is protected by international copyright and other intellectual property laws. 
            The Service is open source under the MIT License - see our{' '}
            <a href="https://github.com/bayhax/linkcal" target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
            EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
          </p>
          <ul>
            <li>The Service will be uninterrupted or error-free</li>
            <li>Any errors will be corrected</li>
            <li>The Service is free of viruses or harmful components</li>
          </ul>

          <h2>8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, LINKCAL SHALL NOT BE LIABLE FOR ANY INDIRECT, 
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>Loss of data</li>
            <li>Loss of profits or revenue</li>
            <li>Business interruption</li>
            <li>Damages resulting from shared calendar links</li>
          </ul>
          <p>
            Our total liability shall not exceed the amount you paid for the Service in the 
            12 months preceding the claim.
          </p>

          <h2>9. Account Termination</h2>
          <p>We may terminate or suspend your access to the Service:</p>
          <ul>
            <li>For violations of these Terms</li>
            <li>For illegal or harmful use of the Service</li>
            <li>At our discretion with reasonable notice</li>
          </ul>
          <p>
            Upon termination, your right to use the Service ceases immediately. Existing shared 
            links will continue to work as the data is stored in the URLs themselves.
          </p>

          <h2>10. Modifications to Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service at any time with 
            reasonable notice. Pro users will receive prorated refunds if we discontinue paid features.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify users of material changes 
            by posting the new Terms on this page. Continued use of the Service after changes 
            constitutes acceptance of the new Terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the 
            jurisdiction in which LinkCal operates, without regard to conflict of law principles.
          </p>

          <h2>13. Contact</h2>
          <p>
            For questions about these Terms, please contact us at:{' '}
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
          <a href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}
