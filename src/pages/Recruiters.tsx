import { useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Zap,
  Shield,
  Users,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Header } from '../components/Header';
import { useThemeStore } from '../store/calendar';

export function Recruiters() {
  const { dark } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
            <div className="relative left-1/2 -translate-x-1/2 aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-primary-300 to-purple-300 dark:from-primary-900 dark:to-purple-900 opacity-20" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              For Recruiters & Hiring Managers
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Stop the back-and-forth.
              <br />
              <span className="text-gradient">Force a time choice.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Send interview times. Get a clear selection — not just "ok". 
              No more endless email threads to confirm a simple meeting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/pick" className="btn-primary text-base px-6 py-3">
                <Clock className="w-5 h-5" />
                Create Time Picker
                <ArrowRight className="w-5 h-5" />
              </a>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Free • No signup required
              </span>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 px-4 bg-white dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              The Problem Every Recruiter Knows
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold text-red-700 dark:text-red-400">Before LinkCal</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">You:</p>
                    <p className="text-gray-700 dark:text-gray-300">"Hi! Can we schedule an interview? I'm available:</p>
                    <p className="text-gray-700 dark:text-gray-300">• Tuesday 2pm</p>
                    <p className="text-gray-700 dark:text-gray-300">• Wednesday 10am</p>
                    <p className="text-gray-700 dark:text-gray-300">• Thursday 3pm"</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Candidate:</p>
                    <p className="text-gray-700 dark:text-gray-300">"Sure, those work for me!"</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">You:</p>
                    <p className="text-gray-700 dark:text-gray-300">"Great! Which one specifically?"</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Candidate:</p>
                    <p className="text-gray-700 dark:text-gray-300">"Any works!"</p>
                  </div>
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 pt-2">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-xs">Endless loop...</span>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">With LinkCal</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">You:</p>
                    <p className="text-gray-700 dark:text-gray-300">"Hi! Please pick a time for our interview:"</p>
                    <p className="text-primary-600 dark:text-primary-400 text-xs mt-1">linkcal.link/pick#...</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800/50">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Candidate clicks, sees options:</p>
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        <span className="text-gray-600 dark:text-gray-400">Tuesday 2pm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-primary-500 bg-primary-500 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">Wednesday 10am</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        <span className="text-gray-600 dark:text-gray-400">Thursday 3pm</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 pt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Done in one step!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              How It Works
            </h2>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Add Time Options</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter your available time slots. Set the meeting duration.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Share the Link</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Copy the link and send via email, LinkedIn, or any messaging app.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">They Pick One</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Candidate must select a specific time. Auto-added to their calendar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-white dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Built for Busy Recruiters
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Instant Setup</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No account needed. Create a link in 30 seconds. Start scheduling immediately.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Calendar Integration</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  One-click add to Google, Outlook, or Apple Calendar. Download .ics file.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Privacy First</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All data in the URL. Nothing stored on servers. Your scheduling stays private.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Works Everywhere</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email, LinkedIn, WhatsApp, Slack — any platform that supports links.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pro CTA */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-950/30 dark:to-purple-950/30 border border-primary-200 dark:border-primary-800/50 text-center">
              <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Need More Control?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upgrade to Pro for password protection, auto-expiring links, and white-label branding.
              </p>
              <a href="/#upgrade" className="btn-primary">
                Learn About Pro
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gray-900 dark:bg-black">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to streamline your scheduling?
            </h2>
            <p className="text-gray-400 mb-8">
              Create your first time picker in seconds. No signup required.
            </p>
            <a href="/pick" className="btn-primary text-base px-8 py-3">
              <Clock className="w-5 h-5" />
              Create Time Picker
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center bg-gray-900 dark:bg-black border-t border-gray-800">
        <p className="text-sm text-gray-500">
          Powered by{' '}
          <a href="/" className="font-medium text-gray-300 hover:text-primary-400 transition-colors">
            LinkCal
          </a>
          {' · '}
          <a href="/terms" className="hover:text-primary-400 transition-colors">
            Terms
          </a>
          {' · '}
          <a href="/privacy" className="hover:text-primary-400 transition-colors">
            Privacy
          </a>
        </p>
      </footer>
    </div>
  );
}
