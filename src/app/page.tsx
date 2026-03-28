"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Send, Copy, Check, Loader2, LayoutGrid } from "lucide-react";

// Type definitions
interface StripResult {
  email: string;
  savings: number;
  alternative: string;
}

interface CopiedState {
  email: boolean;
  code: boolean;
}

// Utility function to copy text to clipboard
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

// Error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-red-50 border-2 border-red-200 rounded-lg text-center">
          <h2 className="text-2xl font-black text-red-600 mb-4">SOMETHING WENT WRONG!</h2>
          <p className="text-red-500 mb-4">We're sorry, but something unexpected happened. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StripResult | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [copied, setCopied] = useState<CopiedState>({
    email: false,
    code: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Resource error monitoring
  useEffect(() => {
    // Monitor script errors
    const handleScriptError = (event: ErrorEvent) => {
      console.error('Script error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };

    // Monitor image errors
    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      console.error('Image loading error:', {
        src: target.src,
        alt: target.alt
      });
    };

    // Monitor fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          console.error('Fetch error:', {
            url: args[0],
            status: response.status,
            statusText: response.statusText
          });
        }
        return response;
      } catch (error) {
        console.error('Fetch network error:', {
          url: args[0],
          error
        });
        throw error;
      }
    };

    // Add event listeners
    window.addEventListener('error', handleScriptError);
    document.addEventListener('error', handleImageError, true);

    // Clean up
    return () => {
      window.removeEventListener('error', handleScriptError);
      document.removeEventListener('error', handleImageError, true);
      window.fetch = originalFetch;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setShowResults(false);
    setCopied({ email: false, code: false });
    
    if (!inputValue.trim()) {
      setError("WHAT ARE YOU DOING? GIVE ME A VALID INPUT!");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    try {
      const response = await fetch('/api/strip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      // Validate response structure
      if (!data.email || typeof data.savings !== 'number' || !data.alternative) {
        throw new Error('Invalid response structure');
      }

      setResult(data);
      // Show results after a short delay to allow animation
      setTimeout(() => {
        setShowResults(true);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-grid-pattern bg-grid opacity-50"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
        
        <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8">
          <div 
            className={`max-w-[1200px] mx-auto transition-all duration-700 ease-in-out ${showResults ? 'pt-8 pb-16' : 'pt-32 pb-32'}`}
          >
            <div 
              className={`flex flex-col items-center transition-all duration-700 ease-in-out transform ${showResults ? 'translate-y-[-20px] opacity-80' : 'translate-y-0 opacity-100'}`}
            >
              {/* Summary-first: One sentence summary */}
              <div className="w-full max-w-3xl text-center mb-8 sm:mb-12">
                <p className="text-lg sm:text-xl text-slate-700 font-semibold">
                  Stop overpaying for bloated SaaS. Paste your SaaS regret, get a free DIY alternative and cancellation template instantly. Save thousands annually with lean, functional solutions.
                </p>
              </div>
              <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw] xl:text-7xl font-black text-accent text-center leading-[0.9] tracking-tighter uppercase mb-8 sm:mb-12 md:mb-16">
                STOP OVERPAYING<br />FOR BLOATWARE
              </h1>
              
              <div className="w-full max-w-2xl text-center mb-12 sm:mb-16">
                <p className="text-lg sm:text-xl text-slate-600 font-medium">
                  Paste your SaaS regret (e.g., "I use Salesforce just for storing leads"), 
                  and get a free DIY alternative + cancellation template in 2 seconds.
                </p>
                <p className="text-base text-slate-500 mt-4">
                  Save thousands on bloated SaaS subscriptions. Kill the bloat, keep the functionality.
                </p>
              </div>

              <form id="strip-form" onSubmit={handleSubmit} className="w-full max-w-2xl mb-6 sm:mb-8">
                <div className="relative group">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="I use [Expensive SaaS] just for [Simple Task]..."
                    className="w-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg md:text-xl text-accent placeholder:text-slate-400 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 shadow-sm hover:shadow-md"
                    disabled={loading}
                    maxLength={500}
                  />
                  {loading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <div className="text-red-600 font-bold text-lg mb-1">{error}</div>
                    <div className="text-red-500 text-sm">Please provide a valid input like "I use Salesforce just for storing leads"</div>
                  </div>
                )}
              </form>
              
              <button 
                type="submit" 
                form="strip-form"
                className="group flex items-center gap-3 px-10 sm:px-14 md:px-16 py-4 sm:py-5 md:py-6 bg-accent text-white text-lg sm:text-xl md:text-2xl font-bold rounded-lg hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                disabled={loading || !inputValue.trim()}
              >
                <span className={`relative z-10 transition-opacity ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                  {loading ? 'STRIPPING...' : 'STRIP IT NOW!'}
                </span>
                <span className={`absolute inset-0 flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold transition-opacity ${isSubmitting ? 'opacity-100' : 'opacity-0'}`}>
                  STRIPPING...
                </span>
                <div className={`absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 ${isSubmitting ? 'opacity-20' : 'opacity-0'}`}>
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-white animate-pulse" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
              </button>

              {/* Browse All Alternatives Button */}
              <Link 
                href="/solutions"
                className="group flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-blue-600 text-white text-lg sm:text-xl font-bold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl mt-8 sm:mt-12"
              >
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
                Browse All Alternatives
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
            
            {showResults && result && (
              <div className="mt-12 space-y-6">
                {/* Card 1: THE GOODBYE LETTER */}
                <div className="bg-black text-white p-8 rounded-lg shadow-xl transform transition-all duration-500 ease-out scale-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase">THE GOODBYE LETTER</h2>
                    <button
                      onClick={async () => {
                        const success = await copyToClipboard(result.email);
                        if (success) {
                          setCopied({ ...copied, email: true });
                          setTimeout(() => setCopied({ ...copied, email: false }), 2000);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copied.email ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-white font-medium whitespace-pre-wrap">{result.email}</div>
                </div>
                
                {/* Card 2: YOU SAVE $[X] / YEAR */}
                <div className="bg-black text-white p-8 rounded-lg shadow-xl transform transition-all duration-500 ease-out scale-100">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase mb-6">YOU SAVE</h2>
                  <div className="text-5xl sm:text-7xl font-black text-red-500">${result.savings} / YEAR</div>
                </div>
                
                {/* Card 3: YOUR NEW FREE TOOL */}
                <div className="bg-black text-white p-8 rounded-lg shadow-xl transform transition-all duration-500 ease-out scale-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase">YOUR NEW FREE TOOL</h2>
                    <button
                      onClick={async () => {
                        const success = await copyToClipboard(result.alternative);
                        if (success) {
                          setCopied({ ...copied, code: true });
                          setTimeout(() => setCopied({ ...copied, code: false }), 2000);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copied.code ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-lg font-mono text-sm text-gray-300 overflow-auto max-h-96">
                    {result.alternative}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Support Contact & Donation */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            {/* PayPal Donation Button */}
            <div className="flex justify-center">
              <a
                href="https://www.paypal.com/paypalme/xingfangwang"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-[#0070BA] text-white font-bold rounded-lg hover:bg-[#003087] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.63l-1.496 9.478h2.79c.457 0 .85-.334.922-.788l.04-.19.73-4.627.047-.255a.933.933 0 0 1 .922-.788h.58c3.76 0 6.704-1.528 7.565-5.621.253-1.294.196-2.373-.217-3.146-.134-.246-.286-.468-.452-.658z"/>
                </svg>
                Buy me a coffee
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <p className="text-slate-600 font-medium">Support: 457239850@qq.com</p>
          </div>
        </div>
        
        {/* SEO Keywords for long-tail traffic */}
        <div className="hidden sm:block absolute bottom-0 left-0 w-full p-4">
          <div className="text-[1px] text-slate-300 whitespace-nowrap overflow-hidden">
            Alternative to Salesforce, Alternative to HubSpot, Alternative to Microsoft 365, Alternative to Adobe Creative Cloud, Alternative to Slack, Alternative to Zoom, Alternative to Dropbox, Alternative to Asana, Alternative to Trello, Alternative to Monday.com, Alternative to Notion, Alternative to Google Workspace, Alternative to Canva, Alternative to Mailchimp, Alternative to Constant Contact, Alternative to Shopify, Alternative to WooCommerce, Alternative to Stripe, Alternative to PayPal, Alternative to AWS, Alternative to Azure, Alternative to Google Cloud, Alternative to Heroku, Alternative to Netlify, Alternative to Vercel, Alternative to GitHub, Alternative to GitLab, Alternative to Bitbucket, Alternative to Jira, Alternative to Confluence, Alternative to Zendesk, Alternative to Freshdesk, Alternative to Intercom, Alternative to Drift, Alternative to Calendly, Alternative to Doodle, Alternative to ZoomInfo, Alternative to Apollo.io, Alternative to Clearbit, Alternative to SEMrush, Alternative to Ahrefs, Alternative to Moz, Alternative to Google Analytics, Alternative to Mixpanel, Alternative to Hotjar, Alternative to CrazyEgg, Alternative to Optimizely, Alternative to VWO, Alternative to SurveyMonkey, Alternative to Typeform, Alternative to Google Forms, Alternative to DocuSign, Alternative to Adobe Sign, Alternative to HelloSign, Alternative to LastPass, Alternative to 1Password, Alternative to Dashlane, Alternative to NordVPN, Alternative to ExpressVPN, Alternative to Spotify, Alternative to Netflix, Alternative to YouTube Premium, Alternative to Microsoft Office, Alternative to Google Docs, Alternative to Adobe Photoshop, Alternative to Adobe Illustrator, Alternative to Adobe Premiere Pro, Alternative to Final Cut Pro, Alternative to Logic Pro, Alternative to Pro Tools, Alternative to Ableton Live, Alternative to FL Studio, Alternative to AutoCAD, Alternative to SketchUp, Alternative to Figma, Alternative to Sketch, Alternative to InVision, Alternative to Zeplin, Alternative to Framer, Alternative to Webflow, Alternative to WordPress, Alternative to Squarespace, Alternative to Wix, Alternative to Weebly, Alternative to GoDaddy, Alternative to Namecheap, Alternative to Bluehost, Alternative to HostGator, Alternative to DreamHost, Alternative to SiteGround, Alternative to Cloudflare, Alternative to Fastly, Alternative to Akamai, Alternative to New Relic, Alternative to Datadog, Alternative to Sentry, Alternative to LogRocket, Alternative to Mixpanel, Alternative to Amplitude, Alternative to Heap, Alternative to Segment, Alternative to RudderStack, Alternative to Snowplow, Alternative to Google Tag Manager, Alternative to Facebook Pixel, Alternative to Google Ads, Alternative to Facebook Ads, Alternative to Instagram Ads, Alternative to Twitter Ads, Alternative to LinkedIn Ads, Alternative to Pinterest Ads, Alternative to TikTok Ads, Alternative to Snapchat Ads, Alternative to YouTube Ads, Alternative to Amazon Ads, Alternative to Google Search Console, Alternative to Bing Webmaster Tools, Alternative to Yandex Webmaster, Alternative to Baidu Webmaster, Alternative to Alexa Rank, Alternative to SimilarWeb, Alternative to SEMrush, Alternative to Ahrefs, Alternative to Moz, Alternative to Majestic, Alternative to CognitiveSEO, Alternative to Raven Tools, Alternative to SEO PowerSuite, Alternative to BrightLocal, Alternative to Whitespark, Alternative to Local Viking, Alternative to GMB Everywhere, Alternative to GMB Crush, Alternative to GMB Gorilla, Alternative to GMB Ninja, Alternative to GMB Rocket, Alternative to GMB Shield, Alternative to GMB Supremacy, Alternative to GMB Vault, Alternative to GMB Zen, Alternative to GMB Authority, Alternative to GMB Machine, Alternative to GMB Mastery, Alternative to GMB Momentum, Alternative to GMB Profit, Alternative to GMB Ranker, Alternative to GMB Results, Alternative to GMB Success, Alternative to GMB Victory, Alternative to GMB Wins, Alternative to GMB Zenith, Alternative to GMB Zoom, Alternative to GMB Alpha, Alternative to GMB Beta, Alternative to GMB Gamma, Alternative to GMB Delta, Alternative to GMB Epsilon, Alternative to GMB Zeta, Alternative to GMB Eta, Alternative to GMB Theta, Alternative to GMB Iota, Alternative to GMB Kappa, Alternative to GMB Lambda, Alternative to GMB Mu, Alternative to GMB Nu, Alternative to GMB Xi, Alternative to GMB Omicron, Alternative to GMB Pi, Alternative to GMB Rho, Alternative to GMB Sigma, Alternative to GMB Tau, Alternative to GMB Upsilon, Alternative to GMB Phi, Alternative to GMB Chi, Alternative to GMB Psi, Alternative to GMB Omega
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}
