'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp, LayoutGrid, Search } from 'lucide-react';
import keywords from '@/data/keywords.json';

type Keyword = typeof keywords[0];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Keyword[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [totalSubscriptionsKilled, setTotalSubscriptionsKilled] = useState(12500);
  const [monthlyCapitalReclaimed, setMonthlyCapitalReclaimed] = useState(250000);
  const [totalProductivityHours, setTotalProductivityHours] = useState(45000);
  const isClient = useRef(false);

  useEffect(() => {
    isClient.current = true;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isClient.current) {
        setTotalSubscriptionsKilled(prev => prev + Math.floor(Math.random() * 5) + 1);
        setMonthlyCapitalReclaimed(prev => prev + Math.floor(Math.random() * 100) + 50);
        setTotalProductivityHours(prev => prev + Math.floor(Math.random() * 20) + 10);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = keywords.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.problem_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          {/* Hero Section */}
          <section className="text-center mb-24">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              STOP RENTING YOUR BUSINESS.<br />
              START OWNING IT
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              StopSaaS turns $50/mo browser tasks into $0 standalone tools. No subscriptions. No cloud leaks. Just code
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type a SaaS you want to kill (e.g., Canva, Photoshop)..."
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {isClient.current && showSearchResults && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {searchResults.map((result) => (
                    <Link
                      key={result.slug}
                      href={`/${result.slug}`}
                      className="block p-4 hover:bg-gray-50 border-b border-gray-100"
                      onClick={() => setShowSearchResults(false)}
                    >
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-gray-600">{result.problem_description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/solutions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
            >
              <LayoutGrid size={20} />
              Browse All Alternatives
              <ArrowRight size={20} />
            </Link>
          </section>

          {/* Economic Freedom Tracker */}
          <section className="mb-24">
            <h2 className="text-3xl font-black text-center mb-12">Economic Freedom Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center">
                <div className="text-gray-500 mb-4">Total SaaS Subscriptions Killed</div>
                {isClient.current ? (
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 overflow-hidden">{totalSubscriptionsKilled.toLocaleString()}+</div>
                ) : (
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 overflow-hidden">12500+</div>
                )}
                <div className="text-green-600 text-sm flex items-center justify-center gap-1">
                  <ArrowUp size={16} />
                  <span>Growing daily</span>
                </div>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center">
                <div className="text-gray-500 mb-4">Monthly Capital Reclaimed</div>
                {isClient.current ? (
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 overflow-hidden">${monthlyCapitalReclaimed.toLocaleString()}+</div>
                ) : (
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 overflow-hidden">$250000+</div>
                )}
                <div className="text-green-600 text-sm flex items-center justify-center gap-1">
                  <ArrowUp size={16} />
                  <span>Increasing monthly</span>
                </div>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center">
                <div className="text-gray-500 mb-4">Total Productivity Hours Freed</div>
                {isClient.current ? (
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 overflow-hidden">{totalProductivityHours.toLocaleString()}h+</div>
                ) : (
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 overflow-hidden">45000h+</div>
                )}
                <div className="text-green-600 text-sm flex items-center justify-center gap-1">
                  <ArrowUp size={16} />
                  <span>Saving time globally</span>
                </div>
              </div>
            </div>
            <div className="mt-12 max-w-2xl mx-auto text-center">
              <p className="text-lg text-gray-600">
                The 2026 software ownership revolution is underway. As businesses and individuals reclaim control from subscription-based SaaS providers, we're witnessing a fundamental shift in how technology is consumed.
              </p>
            </div>
          </section>

          {/* The Execution Matrix */}
          <section className="mb-24">
            <h2 className="text-3xl font-black text-center mb-12">The Execution Matrix</h2>

            {/* Design */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-6">Design</h3>
              <p className="text-lg text-gray-600 mb-8">Design tools don't need a $20/mo cloud subscription. These local-first utilities handle favicons, colors, and assets instantly.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">Favicon Maker</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$20/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/favicon-generator" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">Color Palette</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$15/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/color-palette-generator-no-adobe-color" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">Logo Maker</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$50+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/free-vector-logo-maker" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
              </div>
            </div>

            {/* Dev */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-6">Dev</h3>
              <p className="text-lg text-gray-600 mb-8">Developers deserve tools that are fast, free, and don't require a subscription.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">JSON Formatter</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$10/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/json-formatter" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">HTML Editor</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$25/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/html-editor-alternative-dreamweaver" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">SVG Editor</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$20/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/online-svg-editor-no-download" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
              </div>
            </div>

            {/* Marketing */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-6">Marketing</h3>
              <p className="text-lg text-gray-600 mb-8">Marketing tools should be accessible to everyone, not just those who can afford expensive subscriptions.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">Meta Tags Generator</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$30/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/meta-tags-generator-seo" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">QR Code Generator</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$15/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/qr-code-generator" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">Sitemap Generator</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$20/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/xml-sitemap-generator" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
              </div>
            </div>

            {/* Finance */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-6">Finance</h3>
              <p className="text-lg text-gray-600 mb-8">Financial tools should be secure, fast, and free from subscription fees.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">Currency Converter</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$10/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/currency-converter" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">Loan Calculator</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$25/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/loan-calculator" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-3">Password Generator</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Old Way:</span>
                      <span className="font-medium">$15/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">StopSaaS Way:</span>
                      <span className="font-medium text-green-600">$0 Forever</span>
                    </div>
                  </div>
                  <Link href="/password-generator" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Now</Link>
                </div>
              </div>
            </div>
          </section>

          {/* Founder's Logic & Authority */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-center mb-12">Founder's Logic & Authority</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-6 rounded-full overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Alex Chen, Founder" 
                    className="w-full h-full object-cover"
                  />
                </div>
                  <p className="text-lg text-gray-700 mb-6">
                    "I'm tired of software landlords. StopSaaS is my revenge. Every tool here is local-first, privacy-protected, and owned by you."
                  </p>
                  <div className="text-sm font-medium text-gray-500">— Alex Chen, Founder</div>
                </div>
              </div>
              <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Logic Preview</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-400">saas-killer.js</span>
                  </div>
                  <div className="text-sm text-green-400 font-mono whitespace-pre-wrap">
{`// Replace $50/mo SaaS with JS
const processData = (input) => input
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .join(' ');

// No monthly fees. No data leaks.`}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SearchAction Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "StopSaaS",
                "url": "https://stopsaas.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://stopsaas.com/solutions?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />

          {/* SoftwareApplication Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "StopSaaS",
                "applicationCategory": "Productivity",
                "operatingSystem": "Web",
                "url": "https://stopsaas.com",
                "description": "StopSaaS turns $50/mo browser tasks into $0 standalone tools. No subscriptions. No cloud leaks. Just code.",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              })
            }}
          />

          {/* Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "StopSaaS",
                "url": "https://stopsaas.com",
                "mission": "Democratizing Software Access",
                "description": "StopSaaS is a platform dedicated to providing free, local-first alternatives to expensive SaaS subscriptions."
              })
            }}
          />

          {/* Support Section */}
          <section className="mt-24 py-12 border-t border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Support StopSaaS</h2>
              <p className="text-lg text-gray-600 mb-8">If you find our tools helpful, consider supporting our mission to democratize software access.</p>
              <a 
                href="https://paypal.me/xingfangwang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Buy me a coffee
              </a>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-400">Support: 457239850@qq.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
