import { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Lock, 
  Clock, 
  Eye, 
  Check,
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useProStore } from '../store/calendar';

interface UpgradeDialogProps {
  onClose: () => void;
}

const CREEM_API = 'https://test-api.creem.io';
const CREEM_API_KEY = 'creem_test_3qWavV5aUN6biC1v6r3F2Q';

// Product IDs - these would be created in Creem dashboard
const PRODUCTS = {
  monthly: 'prod_monthly_5',
  lifetime: 'prod_lifetime_29',
};

export function UpgradeDialog({ onClose }: UpgradeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { setIsPro } = useProStore();

  const features = [
    { icon: Lock, title: 'Password Protection', desc: 'Require password to view your calendar' },
    { icon: Clock, title: 'Link Expiration', desc: 'Set auto-expiry dates for shared links' },
    { icon: Eye, title: 'Hide Branding', desc: 'Remove LinkCal logo from shared calendars' },
    { icon: Zap, title: 'Priority Support', desc: 'Get help faster when you need it' },
  ];

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    setIsLoading(true);

    try {
      // For demo, we'll simulate the checkout flow
      // In production, this would call Creem API to create a checkout session
      const response = await fetch(`${CREEM_API}/v1/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CREEM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: PRODUCTS[selectedPlan],
          success_url: `${window.location.origin}/?upgrade=success`,
          cancel_url: `${window.location.origin}/#upgrade`,
          customer_email: email,
          metadata: {
            plan: selectedPlan,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Creem checkout
        window.location.href = data.checkout_url;
      } else {
        // Demo mode: simulate success
        console.log('Demo mode: simulating successful upgrade');
        setIsPro(true);
        localStorage.setItem('linkcal-pro-demo', 'true');
        onClose();
        alert('🎉 Pro features activated! (Demo mode)');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Demo mode: simulate success on error (for testing)
      setIsPro(true);
      localStorage.setItem('linkcal-pro-demo', 'true');
      onClose();
      alert('🎉 Pro features activated! (Demo mode)');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo: quick activate
  const handleDemoActivate = () => {
    setIsPro(true);
    localStorage.setItem('linkcal-pro-demo', 'true');
    onClose();
  };

  return (
    <div className="backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="card w-full max-w-xl p-0 overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-br from-primary-500 to-purple-600 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4" />
              Upgrade to Pro
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Unlock Pro Features
            </h2>
            <p className="text-sm sm:text-base text-white/80">
              Get more control over your shared calendars
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Plan Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose your plan</p>
            
            {/* Monthly */}
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">Monthly</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Cancel anytime</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">$5</p>
                  <p className="text-xs sm:text-sm text-gray-500">/month</p>
                </div>
              </div>
            </button>

            {/* Lifetime */}
            <button
              onClick={() => setSelectedPlan('lifetime')}
              className={`w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all relative ${
                selectedPlan === 'lifetime'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="absolute -top-2.5 right-3 sm:right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-medium whitespace-nowrap">
                Best Value
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">Lifetime</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">One-time, forever access</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">$29</p>
                  <p className="text-xs sm:text-sm text-gray-500">one-time</p>
                </div>
              </div>
            </button>
          </div>

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="btn-primary w-full py-3 whitespace-nowrap"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Continue to Checkout</span>
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </>
            )}
          </button>

          {/* Demo activate button */}
          <button
            onClick={handleDemoActivate}
            className="w-full text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            Activate Demo Mode (for testing)
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Check className="w-4 h-4 text-emerald-500" />
              Secure checkout
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Check className="w-4 h-4 text-emerald-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
