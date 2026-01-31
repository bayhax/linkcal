import { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Lock, 
  Clock, 
  Eye, 
  Check,
  Zap,
  ArrowRight,
  Loader2,
  Key,
  AlertCircle
} from 'lucide-react';
import { useProStore } from '../store/calendar';
import { createCheckout } from '../services/license';

interface UpgradeDialogProps {
  onClose: () => void;
  initialTab?: 'upgrade' | 'activate';
}

export function UpgradeDialog({ onClose, initialTab = 'upgrade' }: UpgradeDialogProps) {
  const [activeTab, setActiveTab] = useState<'upgrade' | 'activate'>(initialTab);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime');
  const [isLoading, setIsLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { activateLicense, licenseError, isVerifying } = useProStore();

  // Check URL for checkout success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      setActiveTab('activate');
      setSuccess('Payment successful! Enter your license key below to activate Pro features.');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const features = [
    { icon: Lock, title: 'Password Protection', desc: 'Require password to view your calendar' },
    { icon: Clock, title: 'Link Expiration', desc: 'Set auto-expiry dates for shared links' },
    { icon: Eye, title: 'Hide Branding', desc: 'Remove LinkCal logo from shared calendars' },
    { icon: Zap, title: 'Priority Support', desc: 'Get help faster when you need it' },
  ];

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createCheckout(selectedPlan);
      
      if (result.checkoutUrl) {
        // Redirect to Creem checkout
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error || 'Failed to create checkout. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to create checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter your license key');
      return;
    }

    setError(null);
    setSuccess(null);

    const activated = await activateLicense(licenseKey.trim());
    
    if (activated) {
      setSuccess('🎉 Pro features activated successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(licenseError || 'Invalid license key. Please check and try again.');
    }
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
              {activeTab === 'upgrade' ? 'Upgrade to Pro' : 'Activate Pro'}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              {activeTab === 'upgrade' ? 'Unlock Pro Features' : 'Enter Your License Key'}
            </h2>
            <p className="text-sm sm:text-base text-white/80">
              {activeTab === 'upgrade' 
                ? 'Get more control over your shared calendars'
                : 'Activate your Pro license to unlock all features'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { setActiveTab('upgrade'); setError(null); setSuccess(null); }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upgrade'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Get Pro
          </button>
          <button
            onClick={() => { setActiveTab('activate'); setError(null); setSuccess(null); }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'activate'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Key className="w-4 h-4 inline mr-1" />
            Have a License?
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {activeTab === 'upgrade' ? (
            <>
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

              <p className="text-xs text-gray-500 text-center">
                You'll enter your email during checkout. License key will be delivered instantly.
              </p>
            </>
          ) : (
            /* Activate Tab */
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Key className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter the license key you received after purchase to activate Pro features.
                </p>
              </div>

              {/* License key input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  License Key
                </label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="input font-mono text-center tracking-wider"
                />
              </div>

              {/* Activate button */}
              <button
                onClick={handleActivate}
                disabled={isVerifying || !licenseKey.trim()}
                className="btn-primary w-full py-3 whitespace-nowrap"
              >
                {isVerifying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    <span>Activate License</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Don't have a license key?{' '}
                <button 
                  onClick={() => setActiveTab('upgrade')}
                  className="text-primary-600 hover:underline"
                >
                  Get Pro
                </button>
              </p>
            </>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Check className="w-4 h-4 text-emerald-500" />
              Secure checkout
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Check className="w-4 h-4 text-emerald-500" />
              Instant delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
