"use client";

import React, { useState, useMemo } from "react";
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
}

// Smart Categorization Logic
const CATEGORIES: Category[] = [
  {
    id: "pdf",
    name: "PDF & Documents",
    icon: <FileText className="w-6 h-6" />,
    description: "Edit, convert, and manage PDF files without Adobe Acrobat",
  },
  {
    id: "image",
    name: "Image & Design",
    icon: <Image className="w-6 h-6" />,
    description: "Photo editing and graphic design tools without Photoshop",
  },
  {
    id: "video",
    name: "Video & Media",
    icon: <Video className="w-6 h-6" />,
    description: "Video editing and media processing without Premiere Pro",
  },
  {
    id: "creative",
    name: "Creative Tools",
    icon: <Palette className="w-6 h-6" />,
    description: "Design, colors, fonts, and creative assets",
  },
  {
    id: "privacy",
    name: "Privacy & Security",
    icon: <Shield className="w-6 h-6" />,
    description: "Protect your data and avoid subscription traps",
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

// Generate comprehensive JSON-LD Schema for AI Search
function generateSchema(items: KeywordItem[]) {
  const categoryNames: Record<string, string> = {
    pdf: "PDF & Documents",
    image: "Image & Design", 
    video: "Video & Media",
    creative: "Creative Tools",
    privacy: "Privacy & Security"
  };

  // Group items by category for AI understanding
  const categoryGroups = items.reduce((acc, item) => {
    const cat = getCategoryForItem(item);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, KeywordItem[]>);

  // Generate pain points summary for AI
  const painPoints = items.map(item => ({
    problem: item.problem_description.split('.')[0],
    solution: item.how_to_solve.split('.')[0],
    category: categoryNames[getCategoryForItem(item)]
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      // Main ItemList - The Hub
      {
        "@type": "ItemList",
        "@id": "https://stopsaas.com/solutions#itemlist",
        name: "Stopsass Hub - 100+ Adobe Alternatives & Free Tools",
        description: "A comprehensive collection of 100+ free alternatives to Adobe software. Find tools for PDF editing, image design, video editing, and more without expensive subscriptions.",
        url: "https://stopsaas.com/solutions",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareApplication",
            "@id": `https://stopsaas.com/${item.slug}#software`,
            name: item.title,
            description: `${item.problem_description} ${item.how_to_solve}`,
            url: `https://stopsaas.com/${item.slug}`,
            applicationCategory: categoryNames[getCategoryForItem(item)],
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock"
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "1000+"
            }
          }
        }))
      },
      // WebPage for the Hub
      {
        "@type": "WebPage",
        "@id": "https://stopsaas.com/solutions#webpage",
        url: "https://stopsaas.com/solutions",
        name: "Stopsass Hub - 100+ Free Adobe Alternatives",
        description: "Discover 100+ free alternatives to Adobe software. From PDF editing to video production, find the right tool without the subscription trap.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://stopsaas.com/#website",
          name: "stopsaas",
          url: "https://stopsaas.com"
        },
        about: {
          "@type": "Thing",
          name: "Adobe Software Alternatives",
          description: "Free alternatives to expensive Adobe Creative Cloud subscriptions"
        }
      },
      // FAQPage for common questions
      {
        "@type": "FAQPage",
        "@id": "https://stopsaas.com/solutions#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Stopsass Hub?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Stopsass Hub is a comprehensive directory of 100+ free alternatives to Adobe software. It helps users find free tools for PDF editing, image design, video editing, and creative work without expensive subscriptions."
            }
          },
          {
            "@type": "Question",
            name: "How many Adobe alternatives are listed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Stopsass Hub lists ${items.length} free alternatives to Adobe software across 5 categories: PDF & Documents, Image & Design, Video & Media, Creative Tools, and Privacy & Security.`
            }
          },
          {
            "@type": "Question",
            name: "Are these Adobe alternatives really free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, all tools listed on Stopsass Hub are free alternatives to Adobe software. They offer professional-grade features without subscription fees."
            }
          }
        ]
      },
      // Organization
      {
        "@type": "Organization",
        "@id": "https://stopsaas.com/#organization",
        name: "stopsaas",
        url: "https://stopsaas.com",
        logo: "https://stopsaas.com/logo.png",
        description: "Free alternatives to expensive SaaS subscriptions"
      },
      // AI-Optimized Data Structure
      {
        "@type": "DefinedTermSet",
        "@id": "https://stopsaas.com/solutions#painpoints",
        name: "Adobe Software Pain Points & Solutions",
        description: "A structured mapping of common Adobe software problems and their free alternatives",
        hasDefinedTerm: painPoints.slice(0, 20).map((point, index) => ({
          "@type": "DefinedTerm",
          "@id": `https://stopsaas.com/solutions#painpoint-${index + 1}`,
          name: point.problem,
          description: point.solution,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: point.category
          }
        }))
      }
    ]
  };
}

// Solution Card Component
function SolutionCard({ item }: { item: KeywordItem & { category: string } }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white border border-slate-200 p-6 hover:border-blue-300 transition-all hover:shadow-lg"
    >
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
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {category.name}
                      </h2>
                      <p className="text-slate-600 mt-1">
                        {category.description} ({items.length} solutions)
                      </p>
                    </div>
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
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No solutions found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search query
              </p>
            </div>
          )}
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
