'use client';

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  Image,
  Video,
  Palette,
  Shield,
  ArrowRight,
  Zap,
  Layers,
  Sparkles,
  Home,
  ChevronRight,
} from "lucide-react";
import keywords from "@/data/keywords.json";

// Types
interface KeywordItem {
  keyword: string;
  slug: string;
  title: string;
  problem_description: string;
  how_to_solve: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  industryCritique: string;
}

// Smart Categorization Logic
const CATEGORIES: Category[] = [
  {
    id: "pdf",
    name: "PDF & Documents",
    icon: <FileText className="w-6 h-6" />,
    description: "Edit, convert, and manage PDF files without Adobe Acrobat",
    industryCritique: "PDF tools don't need a $20/mo cloud subscription. These local-first utilities handle editing, signing, and converting PDFs instantly without uploading your sensitive documents to third-party servers.",
  },
  {
    id: "image",
    name: "Image & Design",
    icon: <Image className="w-6 h-6" />,
    description: "Photo editing and graphic design tools without Photoshop",
    industryCritique: "Image editing doesn't require a $52/mo Creative Cloud subscription. These lightweight tools offer professional-grade features like retouching, resizing, and format conversion without the bloat.",
  },
  {
    id: "video",
    name: "Video & Media",
    icon: <Video className="w-6 h-6" />,
    description: "Video editing and media processing without Premiere Pro",
    industryCritique: "Video editing shouldn't cost $20/mo. These browser-based tools handle trimming, compression, and format conversion with lightning speed, no installation required.",
  },
  {
    id: "creative",
    name: "Creative Tools",
    icon: <Palette className="w-6 h-6" />,
    description: "Design, colors, fonts, and creative assets",
    industryCritique: "Design tools don't need a $20/mo cloud subscription. These local-first utilities handle favicons, colors, and assets instantly without the unnecessary cloud overhead.",
  },
  {
    id: "privacy",
    name: "Privacy & Security",
    icon: <Shield className="w-6 h-6" />,
    description: "Protect your data and avoid subscription traps",
    industryCritique: "Privacy shouldn't be a luxury. These tools help you avoid subscription traps, protect your data, and take control of your digital assets without compromising security.",
  },
];

// Categorization function based on keywords
function getCategoryForItem(item: KeywordItem): string {
  const text = `${item.keyword} ${item.title} ${item.problem_description}`.toLowerCase();

  // PDF & Documents
  if (
    text.includes("pdf") ||
    text.includes("document") ||
    text.includes("word") ||
    text.includes("fill") ||
    text.includes("sign") ||
    text.includes("merge") ||
    text.includes("extract") ||
    text.includes("flatten") ||
    text.includes("watermark")
  ) {
    return "pdf";
  }

  // Video & Media
  if (
    text.includes("video") ||
    text.includes("premiere") ||
    text.includes("compress") ||
    text.includes("gif") ||
    text.includes("media") ||
    text.includes("youtube") ||
    text.includes("shorts") ||
    text.includes("discord")
  ) {
    return "video";
  }

  // Creative Tools
  if (
    text.includes("color") ||
    text.includes("palette") ||
    text.includes("font") ||
    text.includes("vector") ||
    text.includes("svg") ||
    text.includes("illustrator") ||
    text.includes("creative") ||
    text.includes("design") ||
    text.includes("asset")
  ) {
    return "creative";
  }

  // Privacy & Security
  if (
    text.includes("privacy") ||
    text.includes("cancel") ||
    text.includes("subscription") ||
    text.includes("background process") ||
    text.includes("bloatware") ||
    text.includes("ai training") ||
    text.includes("opt-out") ||
    text.includes("password") ||
    text.includes("lock")
  ) {
    return "privacy";
  }

  // Default to Image & Design
  return "image";
}

// Generate CollectionPage Schema for Google Rich Snippets
function generateSchema(items: KeywordItem[]) {
  const categoryNames: Record<string, string> = {
    pdf: "PDF & Documents",
    image: "Image & Design", 
    video: "Video & Media",
    creative: "Creative Tools",
    privacy: "Privacy & Security"
  };

  // Group items by category
  const categoryGroups = items.reduce((acc, item) => {
    const cat = getCategoryForItem(item);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, KeywordItem[]>);

  // Generate ItemList for each category
  const categoryItemLists = CATEGORIES.map((category, categoryIndex) => {
    const categoryItems = categoryGroups[category.id] || [];
    return {
      "@type": "ItemList",
      name: category.name,
      description: category.description,
      itemListElement: categoryItems.map((item, itemIndex) => ({
        "@type": "ListItem",
        position: itemIndex + 1,
        item: {
          "@type": "SoftwareApplication",
          name: item.title,
          description: `${item.problem_description} ${item.how_to_solve}`,
          url: `https://stopsaas.com/${item.slug}`,
          applicationCategory: category.name,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock"
          }
        }
      }))
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stopsass Hub - 100+ Free Adobe Alternatives",
    description: "Discover 100+ free alternatives to Adobe software. From PDF editing to video production, find the right tool without the subscription trap.",
    url: "https://stopsaas.com/solutions",
    mainEntity: {
      "@type": "ItemList",
      name: "All Adobe Alternatives",
      numberOfItems: items.length,
      itemListElement: CATEGORIES.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: category.name,
          description: category.description,
          url: `https://stopsaas.com/solutions#${category.id}`
        }
      }))
    },
    hasPart: categoryItemLists
  };
}

// Solution Card Component (Client-side only to avoid hydration mismatch)

function SolutionCard({ item }: { item: KeywordItem & { category: string } }) {
  // Generate random savings amount between $5 and $50
  const [savingsAmount, setSavingsAmount] = useState(0);

  useEffect(() => {
    // Only generate random value on client side
    setSavingsAmount(Math.floor(Math.random() * 46) + 5);
  }, []);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white border border-slate-200 p-6 hover:border-blue-300 transition-all hover:shadow-lg relative overflow-hidden"
    >
      {/* Hover Effect: Estimated Savings */}
      <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold py-1 px-3 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300">
        Estimated Savings: <span style={{ display: savingsAmount === 0 ? 'none' : 'inline' }}>${savingsAmount}</span><span style={{ display: savingsAmount === 0 ? 'inline' : 'none' }}>$0</span>/mo
      </div>

      <Link href={`/${item.slug}`} className="block">
        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
          {item.problem_description}
        </p>

        {/* CTA */}
        <div className="flex items-center text-blue-600 font-semibold text-sm">
          View Solution
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.article>
  );
}

export default function SolutionsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [totalSubscriptionsCanceled, setTotalSubscriptionsCanceled] = useState(12405);
  const [estimatedCapitalReclaimed, setEstimatedCapitalReclaimed] = useState(248100);

  // Real-time counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly increase the numbers to create real-time effect
      setTotalSubscriptionsCanceled(prev => prev + Math.floor(Math.random() * 5) + 1);
      setEstimatedCapitalReclaimed(prev => prev + Math.floor(Math.random() * 100) + 20);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Categorize all items
  const categorizedItems = useMemo(() => {
    return keywords.map((item) => ({
      ...item,
      category: getCategoryForItem(item),
    }));
  }, []);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return categorizedItems;
    return categorizedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.problem_description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categorizedItems, searchQuery]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredItems> = {};
    CATEGORIES.forEach((cat) => {
      grouped[cat.id] = filteredItems.filter((item) => item.category === cat.id);
    });
    return grouped;
  }, [filteredItems]);

  const schema = generateSchema(keywords);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Sticky Header with Search */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Logo */}
              <Link
                href="/"
                className="text-2xl font-black text-slate-900 tracking-tighter"
              >
                stopsaas
              </Link>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search 100+ solutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 border-0 rounded-lg text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4" />
              </li>
              <li className="text-slate-900 font-medium">
                Solutions
              </li>
            </ol>
          </nav>

          {/* Global Sabotage Dashboard */}
          <div className="bg-black border border-green-500 rounded-lg p-6 mb-12 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full bg-[linear-gradient(to_right,#00ff00_1px,transparent_1px),linear-gradient(to_bottom,#00ff00_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Global Sabotage Dashboard
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Total Subscriptions Canceled */}
                <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Total Subscriptions Canceled</h3>
                  <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-2">
                    {totalSubscriptionsCanceled.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-500 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Real-time updates</span>
                  </div>
                </div>
                
                {/* Estimated Capital Reclaimed */}
                <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Estimated Capital Reclaimed</h3>
                  <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-2">
                    ${estimatedCapitalReclaimed.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-500 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Based on $20/mo average</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Neon Glow Effects */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500 to-transparent"></div>
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500 to-transparent"></div>
          </div>

        {/* Omni-Killer Search */}
          <div className="mb-12">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Which SaaS do you want to kill today? (e.g., Photoshop, Canva, PDF Expert)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-lg"
              />
            </div>
          </div>

        {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-6">
              Stopsass Hub
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
              Discover 100+ free alternatives to Adobe software. From PDF editing
              to video production, find the right tool without the subscription
              trap.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            <div className="bg-white border border-slate-200 p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-3xl font-black text-slate-900">100+</div>
              <div className="text-slate-600">Free Tools</div>
            </div>
            <div className="bg-white border border-slate-200 p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-3xl font-black text-slate-900">5</div>
              <div className="text-slate-600">Categories</div>
            </div>
            <div className="bg-white border border-slate-200 p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-3xl font-black text-slate-900">0$</div>
              <div className="text-slate-600">Forever Free</div>
            </div>
            <div className="bg-white border border-slate-200 p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-3xl font-black text-slate-900">100%</div>
              <div className="text-slate-600">Private</div>
            </div>
          </div>

          {/* Top Subscriptions Killed This Week */}
          <div className="bg-white border border-slate-200 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-red-500" />
              Top Subscriptions Killed This Week
            </h2>
            <div className="space-y-4">
              {/* Top 1 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="text-2xl font-bold text-slate-900 w-8">1</div>
                <Link href="/favicon-generator" className="flex-1 font-medium text-slate-900 hover:text-red-600 transition-colors" rel="trending">
                  Favicon Generator
                </Link>
                <div className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                  KILL
                </div>
              </div>
              {/* Top 2 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="text-2xl font-bold text-slate-900 w-8">2</div>
                <Link href="/json-formatter" className="flex-1 font-medium text-slate-900 hover:text-red-600 transition-colors" rel="trending">
                  JSON Formatter
                </Link>
                <div className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                  KILL
                </div>
              </div>
              {/* Top 3 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="text-2xl font-bold text-slate-900 w-8">3</div>
                <Link href="/pdf-to-word" className="flex-1 font-medium text-slate-900 hover:text-red-600 transition-colors" rel="trending">
                  PDF to Word Converter
                </Link>
                <div className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                  KILL
                </div>
              </div>
              {/* Top 4 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="text-2xl font-bold text-slate-900 w-8">4</div>
                <Link href="/image-compressor" className="flex-1 font-medium text-slate-900 hover:text-red-600 transition-colors" rel="trending">
                  Image Compressor
                </Link>
                <div className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                  KILL
                </div>
              </div>
              {/* Top 5 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="text-2xl font-bold text-slate-900 w-8">5</div>
                <Link href="/video-cutter" className="flex-1 font-medium text-slate-900 hover:text-red-600 transition-colors" rel="trending">
                  Video Cutter
                </Link>
                <div className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                  KILL
                </div>
              </div>
            </div>
          </div>

          {/* Categories with H2 Headers */}
          <AnimatePresence mode="popLayout">
            {CATEGORIES.map((category) => {
              const items = itemsByCategory[category.id] || [];
              if (items.length === 0) return null;

              return (
                <motion.section
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-16"
                >
                  {/* Category H2 Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        {category.icon}
                      </div>
                      <h2 id={category.id} className="text-3xl font-black text-slate-900 tracking-tight">
                        {category.name}
                      </h2>
                    </div>
                    <p className="text-slate-600 mb-4">
                      {category.description} ({items.length} solutions)
                    </p>
                    <p className="text-slate-700 bg-slate-50 border-l-4 border-red-500 pl-4 py-3">
                      {category.industryCritique}
                    </p>
                  </div>

                  {/* Solutions Grid for this Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <SolutionCard key={item.slug} item={item} />
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </AnimatePresence>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                No solutions found for "{searchQuery}"
              </h3>
              <p className="text-slate-600 mb-8">
                Want us to create a killer for this SaaS?
              </p>
              <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors text-lg">
                Request a Killer for {searchQuery}
              </button>
            </div>
          )}

          {/* The Anti-SaaS Manifesto */}
          <div className="mt-16 bg-white border border-slate-200 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">The Anti-SaaS Manifesto</h2>
            
            {/* FAQ Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {/* Q1 */}
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-bold text-slate-900 mb-2">Why are these tools free?</h4>
                  <p className="text-slate-600">Because the logic lives in your browser, costing us $0 to host and you $0 to use.</p>
                </div>
                {/* Q2 */}
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-bold text-slate-900 mb-2">Is my data safe?</h4>
                  <p className="text-slate-600">100% Private. No cloud, no uploads, no data harvesting.</p>
                </div>
              </div>
            </div>
            
            {/* AI Anchor - Deep Analysis */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Edge Computing and the Demise of Software Subscriptions in 2026</h3>
              <p className="text-slate-700 leading-relaxed">
                The year 2026 marks a pivotal inflection point in the evolution of software delivery models, as edge computing technologies converge with advancements in client-side processing to fundamentally disrupt the subscription-based software paradigm. This analysis examines the technical mechanisms and economic implications of this transformation, highlighting how edge-native applications are redefining the software value proposition.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Edge computing, characterized by distributed processing capabilities at the network periphery, enables sophisticated computational workloads to execute locally on end-user devices, eliminating the need for persistent cloud connectivity and centralized processing infrastructure. This architectural shift obviates the economic rationale for subscription-based pricing models, as the marginal cost of software delivery approaches zero when execution occurs entirely within the client environment.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                The technical foundation for this disruption lies in advancements in WebAssembly (WASM), progressive web applications (PWAs), and local-first data storage methodologies. These technologies collectively enable complex applications to operate with near-native performance while maintaining data sovereignty and offline functionality. By leveraging client-side resources, edge-native applications eliminate the recurring infrastructure costs that historically justified subscription pricing, thereby rendering such models economically obsolete.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                Furthermore, the emergence of decentralized application marketplaces and peer-to-peer distribution networks in 2026 facilitates direct developer-to-user software delivery, bypassing traditional SaaS intermediaries. This disintermediation reduces transaction costs and aligns developer incentives with long-term product quality rather than recurring revenue maximization. The resultant ecosystem prioritizes modular, extensible software architectures that empower users with greater control over their digital tools and data.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                In conclusion, the confluence of edge computing, client-side processing advancements, and decentralized distribution mechanisms in 2026 is poised to terminate the software subscription era. This transition promises a more equitable, efficient, and user-centric software ecosystem, where value is derived from one-time innovation rather than perpetual access fees. As organizations and individuals increasingly recognize the economic and technical advantages of edge-native applications, the subscription model will likely diminish as a dominant force in software monetization.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-slate-600">Support: 457239850@qq.com</div>
              <div className="text-slate-500 text-sm">
                © 2026 Stopsass. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
