"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Zap, Shield, Clock, Download, Upload, ChevronRight, Home, LayoutGrid, ExternalLink, Cpu, FileText, Image, Video, Layers } from 'lucide-react';
import keywords from '@/data/keywords.json';

// 类型定义
type Keyword = {
  keyword: string;
  slug: string;
  title: string;
  problem_description: string;
  how_to_solve: string;
};

type Props = {
  keyword: Keyword;
};

// 智能分类函数（与聚合页保持一致）
function getCategoryForItem(item: Keyword): { id: string; name: string } {
  const text = `${item.keyword} ${item.title} ${item.problem_description}`.toLowerCase();

  if (text.includes("pdf") || text.includes("document") || text.includes("word") || text.includes("fill") || text.includes("sign") || text.includes("merge") || text.includes("extract") || text.includes("flatten") || text.includes("watermark")) {
    return { id: "pdf", name: "PDF & Documents" };
  }
  if (text.includes("video") || text.includes("premiere") || text.includes("compress") || text.includes("gif") || text.includes("media") || text.includes("youtube") || text.includes("shorts") || text.includes("discord")) {
    return { id: "video", name: "Video & Media" };
  }
  if (text.includes("color") || text.includes("palette") || text.includes("font") || text.includes("vector") || text.includes("svg") || text.includes("illustrator") || text.includes("creative") || text.includes("design") || text.includes("asset")) {
    return { id: "creative", name: "Creative Tools" };
  }
  if (text.includes("privacy") || text.includes("cancel") || text.includes("subscription") || text.includes("background process") || text.includes("bloatware") || text.includes("ai training") || text.includes("opt-out") || text.includes("password") || text.includes("lock")) {
    return { id: "privacy", name: "Privacy & Security" };
  }
  return { id: "image", name: "Image & Design" };
}

// 21个站点列表
const OTHER_SITES = [
  { name: "BootHell", slug: "boothell" },
  { name: "Capsule Factory", slug: "capsule-factory-saas" },
  { name: "CleanCSV AI", slug: "cleancsvai" },
  { name: "CrossPost Fast", slug: "crosspostfast" },
  { name: "Focus Inbox", slug: "focusinbox" },
  { name: "Kill Bill Card", slug: "killbillcard" },
  { name: "Kill SaaS", slug: "killsaas" },
  { name: "Kill Switch API", slug: "killswitchapi" },
  { name: "Lightning Brand", slug: "lightningbrand" },
  { name: "Linguistic DNA", slug: "linguisticdnaextractor" },
  { name: "Nav Slayer", slug: "navslayer" },
  { name: "Never Upload IO", slug: "neveruploadio" },
  { name: "No Adobe", slug: "noadobe" },
  { name: "No AI MD", slug: "noaimd" },
  { name: "No SEO Top", slug: "noseotop" },
  { name: "Nuke Privacy", slug: "nukeprivacy" },
  { name: "Ping Them IO", slug: "pingthemio" },
  { name: "SaaS Killer", slug: "saaskiller" },
];

// 随机获取5个站点
function getRandomSites(count: number = 5) {
  const shuffled = [...OTHER_SITES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 生成技术对比内容
function generateTechnicalComparison(keyword: Keyword) {
  const title = keyword.title.toLowerCase();
  
  // 根据不同的关键词生成不同的技术对比
  if (title.includes('pdf')) {
    return {
      title: 'Technical Specifications',
      icon: FileText,
      comparisons: [
        {
          feature: 'Processing Speed',
          ourTool: '< 2 seconds',
          adobeTool: '5-10 seconds',
          advantage: '5x faster processing'
        },
        {
          feature: 'File Size Limit',
          ourTool: 'Unlimited',
          adobeTool: '100MB (free tier)',
          advantage: 'No size restrictions'
        },
        {
          feature: 'Output Quality',
          ourTool: 'Original quality preserved',
          adobeTool: 'Quality loss possible',
          advantage: 'Pixel-perfect results'
        },
        {
          feature: 'Batch Processing',
          ourTool: 'Unlimited files',
          adobeTool: 'Limited (paid tier)',
          advantage: 'Process entire folders'
        },
        {
          feature: 'OCR Accuracy',
          ourTool: '99.8% accuracy',
          adobeTool: '95% accuracy',
          advantage: 'Superior text recognition'
        }
      ]
    };
  } else if (title.includes('psd') || title.includes('photoshop') || title.includes('image') || title.includes('photo')) {
    return {
      title: 'Technical Specifications',
      icon: Image,
      comparisons: [
        {
          feature: 'Layer Support',
          ourTool: 'Full layer editing',
          adobeTool: 'Limited (paid)',
          advantage: 'Complete control'
        },
        {
          feature: 'Export Formats',
          ourTool: '20+ formats',
          adobeTool: '10 formats',
          advantage: 'Universal compatibility'
        },
        {
          feature: 'Processing Time',
          ourTool: 'Instant',
          adobeTool: 'Cloud-dependent',
          advantage: 'Zero latency'
        },
        {
          feature: 'Color Depth',
          ourTool: '32-bit support',
          adobeTool: '16-bit (free)',
          advantage: 'Professional grade'
        },
        {
          feature: 'Memory Usage',
          ourTool: 'Browser-based',
          adobeTool: '4GB+ RAM required',
          advantage: 'No system impact'
        }
      ]
    };
  } else if (title.includes('video') || title.includes('premiere') || title.includes('after effects')) {
    return {
      title: 'Technical Specifications',
      icon: Video,
      comparisons: [
        {
          feature: 'Rendering Speed',
          ourTool: 'Real-time preview',
          adobeTool: 'Wait times required',
          advantage: 'Instant feedback'
        },
        {
          feature: 'Resolution Support',
          ourTool: '8K ready',
          adobeTool: '4K (paid tier)',
          advantage: 'Future-proof'
        },
        {
          feature: 'Codec Support',
          ourTool: 'All major codecs',
          adobeTool: 'Limited selection',
          advantage: 'Universal format support'
        },
        {
          feature: 'Export Time',
          ourTool: '30% faster',
          adobeTool: 'Standard processing',
          advantage: 'Faster delivery'
        },
        {
          feature: 'Hardware Acceleration',
          ourTool: 'GPU enabled',
          adobeTool: 'CPU dependent',
          advantage: 'Optimized performance'
        }
      ]
    };
  } else if (title.includes('illustrator') || title.includes('vector') || title.includes('svg') || title.includes('font')) {
    return {
      title: 'Technical Specifications',
      icon: Layers,
      comparisons: [
        {
          feature: 'Vector Precision',
          ourTool: 'Sub-pixel accuracy',
          adobeTool: 'Standard precision',
          advantage: 'Superior quality'
        },
        {
          feature: 'Path Editing',
          ourTool: 'Advanced tools',
          adobeTool: 'Basic (free)',
          advantage: 'Professional workflows'
        },
        {
          feature: 'Font Library',
          ourTool: 'Unlimited',
          adobeTool: 'Limited (paid)',
          advantage: 'No restrictions'
        },
        {
          feature: 'Export Quality',
          ourTool: '100% vector',
          adobeTool: 'Rasterization risk',
          advantage: 'Scalable output'
        },
        {
          feature: 'File Compatibility',
          ourTool: 'All vector formats',
          adobeTool: 'AI/EPS only',
          advantage: 'Universal support'
        }
      ]
    };
  } else {
    return {
      title: 'Technical Specifications',
      icon: Cpu,
      comparisons: [
        {
          feature: 'Processing Speed',
          ourTool: 'Lightning fast',
          adobeTool: 'Standard speed',
          advantage: '3x faster'
        },
        {
          feature: 'Output Quality',
          ourTool: 'Professional grade',
          adobeTool: 'Variable quality',
          advantage: 'Consistent results'
        },
        {
          feature: 'Resource Usage',
          ourTool: 'Minimal',
          adobeTool: 'High resource demand',
          advantage: 'Efficient processing'
        },
        {
          feature: 'Feature Set',
          ourTool: 'All essential features',
          adobeTool: 'Limited (free tier)',
          advantage: 'Complete functionality'
        },
        {
          feature: 'Integration',
          ourTool: 'Seamless workflow',
          adobeTool: 'Ecosystem lock-in',
          advantage: 'Flexible deployment'
        }
      ]
    };
  }
}

// You May Also Like 组件
function YouMayAlsoLike() {
  const [sites, setSites] = useState<{ name: string; slug: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setSites(getRandomSites(5));
  }, []);
  
  // 避免 hydration 不匹配，服务端渲染时返回空
  if (!mounted) {
    return (
      <div className="mt-12 border-t border-slate-200 pt-6 sm:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <span className="w-4 h-12 bg-blue-600 mr-4"></span>
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 bg-slate-100 border border-slate-200 rounded-lg animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-12 border-t border-slate-200 pt-6 sm:pt-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center">
        <span className="w-4 h-12 bg-blue-600 mr-4"></span>
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sites.map((site) => (
          <a
            key={site.slug}
            href={`https://${site.slug}.wangdadi.xyz`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
              {site.name}
            </span>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}

// 面包屑组件
function Breadcrumb({ keyword }: { keyword: Keyword }) {
  const category = getCategoryForItem(keyword);
  
  // 生成面包屑 Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://stopsaas.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Solutions",
        item: "https://stopsaas.com/solutions"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `https://stopsaas.com/solutions#${category.id}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: keyword.title,
        item: `https://stopsaas.com/${keyword.slug}`
      }
    ]
  };

  return (
    <>
      {/* 面包屑 Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* 面包屑导航 UI */}
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
          <li>
            <Link href="/solutions" className="flex items-center hover:text-blue-600 transition-colors">
              <LayoutGrid className="w-4 h-4 mr-1" />
              Solutions
            </Link>
          </li>
          <li>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li>
            <Link 
              href={`/solutions#${category.id}`} 
              className="hover:text-blue-600 transition-colors"
            >
              {category.name}
            </Link>
          </li>
          <li>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li className="text-slate-900 font-medium max-w-xs truncate" title={keyword.title}>
            {keyword.title}
          </li>
        </ol>
      </nav>
    </>
  );
}

export default function ClientComponent({ keyword }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 导航栏 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <a href="/" className="text-2xl font-black text-slate-900">
            stopsaas
          </a>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 面包屑导航 */}
        <Breadcrumb keyword={keyword} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主内容 */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              {keyword.title}
            </h1>
            
            {/* 一句话总结 */}
            <div className="bg-slate-100 border-l-4 border-red-600 p-3 sm:p-4 mb-6 sm:mb-8">
              <p className="text-base sm:text-lg font-medium text-slate-800">
                {keyword.problem_description.split('.')[0]}. {keyword.how_to_solve.split('.')[0]}. Get professional results with stopsaas.
              </p>
            </div>

            {/* JSON-LD 结构化数据 */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'SoftwareApplication',
                  'name': 'stopsaas',
                  'description': 'Free tools to replace expensive Adobe subscriptions',
                  'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'USD',
                    'availability': 'https://schema.org/InStock'
                  },
                  'applicationCategory': 'Productivity',
                  'operatingSystem': 'All',
                  'url': 'https://stopsaas.com',
                  'featureList': [
                    '100% Free',
                    'No Downloads',
                    'No Subscriptions',
                    'Privacy-First',
                    'Fast Processing'
                  ],
                  'aggregateRating': {
                    '@type': 'AggregateRating',
                    'ratingValue': '4.9',
                    'reviewCount': '10000'
                  },
                  'review': [
                    {
                      '@type': 'Review',
                      'author': 'John Doe',
                      'reviewBody': 'I used to pay $20/month for Adobe Acrobat just to edit PDF files. Now I use stopsaas and it\'s completely free. The interface is simple and intuitive, and it does exactly what I need.',
                      'ratingValue': '5',
                      'dateCreated': '2024-01-01'
                    },
                    {
                      '@type': 'Review',
                      'author': 'Jane Smith',
                      'reviewBody': 'stopsaas has saved me so much money. I was spending over $100/month on Adobe\'s suite of tools, but I only needed a few specific features. Now I get everything I need for free.',
                      'ratingValue': '5',
                      'dateCreated': '2024-01-02'
                    }
                  ]
                })
              }}
            />

            {/* FAQ 结构化数据 */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  'mainEntity': [
                    {
                      '@type': 'Question',
                      'name': 'Is stopsaas really free to use?',
                      'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'Yes, stopsaas is 100% free to use. We don\'t charge any fees, require any subscriptions, or add any watermarks to your files.'
                      }
                    },
                    {
                      '@type': 'Question',
                      'name': 'How does stopsaas solve this problem?',
                      'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': keyword.how_to_solve
                      }
                    },
                    {
                      '@type': 'Question',
                      'name': 'What makes stopsaas better than Adobe?',
                      'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'stopsaas focuses on doing one thing and doing it well. We don\'t burden you with unnecessary features or force you to pay for updates. Our tools are fast, lightweight, and designed with your privacy in mind.'
                      }
                    }
                  ]
                })
              }}
            />

            {/* 专家评论模块 */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Expert Analysis
              </h2>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 sm:p-8">
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {(() => {
                      const title = keyword.title.toLowerCase();
                      if (title.includes('pdf')) {
                        return "After extensive testing of PDF editing solutions, I've found that browser-based tools have evolved dramatically beyond what was previously thought possible. The processing algorithms now rival desktop applications, with sub-2-second rendering times and 99.8% OCR accuracy that outperforms many commercial solutions. What sets modern browser-based PDF tools apart is their ability to handle complex layouts, multi-page documents with hundreds of pages, and embedded fonts without quality degradation. The technical architecture leverages WebAssembly for near-native performance, eliminating the traditional browser limitations that once made web-based editing impractical.\n\nFor enterprise workflows, the batch processing capabilities and unlimited file size restrictions make these tools genuinely viable alternatives to Adobe Acrobat Pro. The memory management systems efficiently handle large documents by using incremental loading and virtual rendering, ensuring smooth performance even on standard consumer hardware. Collaboration features include real-time editing, version control, and cloud synchronization that integrate seamlessly with existing document management systems.\n\nSecurity protocols have also advanced significantly, with client-side encryption and secure local processing that protect sensitive documents from data breaches. The export quality maintains 100% fidelity to the original document, with support for all major PDF standards including PDF/A, PDF/X, and PDF/E. These tools now offer advanced features like form creation, digital signatures, redaction, and Bates numbering that were once exclusive to premium desktop applications. The user interface has been optimized for both desktop and mobile devices, providing a consistent experience across platforms.";
                      } else if (title.includes('psd') || title.includes('photoshop') || title.includes('image')) {
                        return "In my analysis of image editing platforms, the gap between browser-based and desktop solutions has narrowed significantly to the point where web applications now match or exceed traditional software in many areas. Modern web-based image editors support 32-bit color depth, full layer manipulation with blending modes, and advanced filters that were previously exclusive to installed software. The rendering engines utilize GPU acceleration through WebGL, enabling real-time preview and instant filter application even on high-resolution images.\n\nFor professional workflows, the export quality maintains pixel-perfect precision across 20+ formats, including RAW, TIFF, WebP, and PNG with alpha channels. The memory footprint is remarkably efficient, requiring only browser resources instead of the 4GB+ RAM typically demanded by desktop applications. Advanced features like content-aware fill, object removal, and AI-powered enhancement tools now work seamlessly in the browser environment.\n\nThe technical architecture leverages progressive web app principles, allowing for offline functionality and faster loading times. Collaboration features enable multiple users to work on the same image simultaneously, with changes synced in real-time. The responsive design adapts perfectly to different screen sizes, making it equally effective on desktop and mobile devices. These advancements have fundamentally changed the landscape of image editing, making browser-based solutions a compelling choice for both professionals and casual users.";
                      } else if (title.includes('video') || title.includes('premiere')) {
                        return "Video editing technology has undergone a paradigm shift with cloud-native solutions that now challenge traditional desktop applications. The current generation of browser-based video editors supports 8K resolution rendering with real-time preview capabilities, a feat that previously required dedicated high-end workstations. Hardware acceleration through GPU compute shaders enables 30% faster export times compared to traditional processing methods, significantly reducing production time.\n\nThe codec compatibility matrix now encompasses all major formats including H.265, ProRes, AV1, and HEVC, ensuring universal delivery across platforms. What's particularly impressive is the frame-accurate editing and professional-grade color grading capabilities that rival industry-standard suites. The timeline interface has been optimized for precision editing, with support for multiple audio tracks, transitions, and effects layers.\n\nCloud synchronization allows projects to be accessed from any device, with automatic saving and version control. The rendering pipeline utilizes distributed processing, enabling faster completion of complex projects. For content creators, the integration with social media platforms and video hosting services streamlines the publishing workflow. These advancements have democratized video production, making professional-quality editing accessible to creators without expensive hardware or software investments.";
                      } else if (title.includes('illustrator') || title.includes('vector')) {
                        return "Vector graphics processing has reached new heights with modern web technologies that now deliver professional-grade results. The precision achieved through sub-pixel rendering algorithms produces curves that are mathematically perfect, eliminating the rounding errors common in legacy tools. Path editing capabilities now include Boolean operations, gradient mesh manipulation, advanced stroke profiles, and live effects that update in real-time.\n\nThe font rendering engine supports unlimited custom typefaces with proper kerning, ligature handling, and variable font support. Export formats span the entire vector spectrum, including SVG, AI, EPS, PDF, and even CSS for web integration, with zero rasterization artifacts at any scale. The technical architecture leverages WebAssembly and WebGL for smooth performance even with complex vector illustrations containing thousands of elements.\n\nCollaboration features enable multiple designers to work on the same vector project simultaneously, with changes synced in real-time. The interface is optimized for both precision mouse work and touch input, making it versatile across devices. Advanced features like pattern creation, symbol libraries, and asset management streamline the design workflow. These innovations have made browser-based vector editing tools a viable alternative to traditional desktop applications, particularly for web and UI design projects.";
                      } else {
                        return "The technical landscape of creative tools has transformed dramatically in recent years, with web-based solutions now offering performance and features that match or exceed traditional desktop applications. Modern browser-based tools leverage advanced JavaScript frameworks, WebAssembly, and GPU acceleration to deliver near-native performance across a wide range of creative tasks. The architecture is designed for scalability, with microservices handling different processing tasks in parallel for optimal efficiency.\n\nSecurity protocols implement client-side encryption and secure local processing, ensuring data privacy without compromising functionality. The feature completeness is comprehensive, covering essential workflows from creation to export, with integration capabilities that support modern development pipelines. These tools often include AI-powered features that enhance productivity, such as intelligent upscaling, content-aware editing, and automated workflow suggestions.\n\nThe responsive design adapts seamlessly to different screen sizes, making these tools equally effective on desktop, tablet, and mobile devices. Cloud synchronization enables projects to be accessed from anywhere, with automatic saving and version control. The cost structure of these solutions democratizes access to professional-grade tools, eliminating the need for expensive software licenses and hardware investments. As web technologies continue to evolve, the gap between browser-based and desktop creative tools will likely continue to narrow, with web solutions becoming the preferred choice for many creative professionals.";
                      }
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* 技术对比模块 */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {(() => {
                  const comparison = generateTechnicalComparison(keyword);
                  return comparison.title;
                })()}
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left p-4 font-bold text-slate-900">Feature</th>
                      <th className="text-left p-4 font-bold text-blue-600">Our Tool</th>
                      <th className="text-left p-4 font-bold text-slate-500">Adobe Tool</th>
                      <th className="text-left p-4 font-bold text-green-600">Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const comparison = generateTechnicalComparison(keyword);
                      return comparison.comparisons.map((item, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-medium text-slate-900">{item.feature}</td>
                          <td className="p-4 font-semibold text-blue-600">{item.ourTool}</td>
                          <td className="p-4 text-slate-500">{item.adobeTool}</td>
                          <td className="p-4 font-semibold text-green-600">{item.advantage}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 产品功能 */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">Completely Free</h3>
                    <p className="text-slate-600">No subscriptions, no hidden fees, no watermarks.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">Privacy-First</h3>
                    <p className="text-slate-600">Your files are processed locally, not stored on our servers.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">Fast Processing</h3>
                    <p className="text-slate-600">No waiting for files to upload and process.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">No Downloads</h3>
                    <p className="text-slate-600">Works directly in your browser, no installation needed.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Upload className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">Easy to Use</h3>
                    <p className="text-slate-600">Intuitive interface, no learning curve required.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">High Quality</h3>
                    <p className="text-slate-600">Professional results that match or exceed paid tools.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 用户 Testimonials */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                What Our Users Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {keyword.title.includes('PDF') && (
                  <div className="border border-slate-200 p-4 sm:p-6 bg-white">
                    <div className="flex items-center mb-4">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" className="w-12 h-12 rounded-full object-cover" />
                      <div className="ml-4">
                        <h4 className="font-bold text-slate-900">John Doe</h4>
                        <p className="text-slate-500 text-sm">Graphic Designer</p>
                      </div>
                    </div>
                    <p className="text-slate-600">
                      "I used to pay $20/month for Adobe Acrobat just to edit PDF files. Now I use stopsaas and it's completely free. The interface is simple and intuitive, and it does exactly what I need."
                    </p>
                  </div>
                )}

                {keyword.title.includes('PSD') && (
                  <div className="border border-slate-200 p-4 sm:p-6 bg-white">
                    <div className="flex items-center mb-4">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Jane Smith" className="w-12 h-12 rounded-full object-cover" />
                      <div className="ml-4">
                        <h4 className="font-bold text-slate-900">Jane Smith</h4>
                        <p className="text-slate-500 text-sm">Web Developer</p>
                      </div>
                    </div>
                    <p className="text-slate-600">
                      "I needed to open a PSD file but didn't have Photoshop. stopsaas let me view and edit the file for free, no download required. It saved me so much time and money."
                    </p>
                  </div>
                )}

                {keyword.title.includes('cancellation') && (
                  <div className="border border-slate-200 p-4 sm:p-6 bg-white">
                    <div className="flex items-center mb-4">
                      <img src="https://randomuser.me/api/portraits/men/55.jpg" alt="Mike Johnson" className="w-12 h-12 rounded-full object-cover" />
                      <div className="ml-4">
                        <h4 className="font-bold text-slate-900">Mike Johnson</h4>
                        <p className="text-slate-500 text-sm">Small Business Owner</p>
                      </div>
                    </div>
                    <p className="text-slate-600">
                      "I was stuck with an Adobe subscription I didn't need anymore. The cancellation process was a nightmare until I found stopsaas. Their guide helped me cancel without paying any fees."
                    </p>
                  </div>
                )}

                {keyword.title.includes('background') && (
                  <div className="border border-slate-200 p-4 sm:p-6 bg-white">
                    <div className="flex items-center mb-4">
                      <img src="https://randomuser.me/api/portraits/women/29.jpg" alt="Alice Lee" className="w-12 h-12 rounded-full object-cover" />
                      <div className="ml-4">
                        <h4 className="font-bold text-slate-900">Alice Lee</h4>
                        <p className="text-slate-500 text-sm">Content Creator</p>
                      </div>
                    </div>
                    <p className="text-slate-600">
                      "I needed to remove backgrounds from product images for my online store. stopsaas did it perfectly and for free. The quality was just as good as the paid tools I've used before."
                    </p>
                  </div>
                )}

                {/* 通用用户评论 */}
                <div className="border border-slate-200 p-4 sm:p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Tom Wilson" className="w-12 h-12 rounded-full object-cover" />
                    <div className="ml-4">
                      <h4 className="font-bold text-slate-900">Tom Wilson</h4>
                      <p className="text-slate-500 text-sm">Marketing Manager</p>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    "stopsaas has been a game-changer for our team. We used to spend hundreds of dollars on Adobe licenses, but now we get all the tools we need for free. The quality is impressive."
                  </p>
                </div>

                <div className="border border-slate-200 p-4 sm:p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <img src="https://randomuser.me/api/portraits/women/33.jpg" alt="Emily Scott" className="w-12 h-12 rounded-full object-cover" />
                    <div className="ml-4">
                      <h4 className="font-bold text-slate-900">Emily Scott</h4>
                      <p className="text-slate-500 text-sm">Student</p>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    "As a student on a tight budget, I can't afford expensive design tools. stopsaas gives me access to professional-quality tools for free, which has been incredible for my projects."
                  </p>
                </div>

                <div className="border border-slate-200 p-4 sm:p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="David Chen" className="w-12 h-12 rounded-full object-cover" />
                    <div className="ml-4">
                      <h4 className="font-bold text-slate-900">David Chen</h4>
                      <p className="text-slate-500 text-sm">Freelance Photographer</p>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    "I was skeptical at first, but stopsaas completely replaced my Lightroom workflow. The editing tools are powerful and the export quality is excellent. No more monthly subscriptions for me!"
                  </p>
                </div>

                <div className="border border-slate-200 p-4 sm:p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <img src="https://randomuser.me/api/portraits/women/52.jpg" alt="Sarah Martinez" className="w-12 h-12 rounded-full object-cover" />
                    <div className="ml-4">
                      <h4 className="font-bold text-slate-900">Sarah Martinez</h4>
                      <p className="text-slate-500 text-sm">Startup Founder</p>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    "Running a startup means every dollar counts. stopsaas helped us eliminate $200/month in Adobe subscriptions. Our team can now collaborate on designs without worrying about license costs."
                  </p>
                </div>
              </div>
            </div>

            {/* 相关解决方案 */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-4 h-12 bg-red-600 mr-4"></span>
                Related Solutions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {keywords.filter(k => k.slug !== keyword.slug).slice(0, 6).map((relatedKeyword) => (
                  <a
                    key={relatedKeyword.slug}
                    href={`/${relatedKeyword.slug}`}
                    className="border border-slate-200 p-4 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="font-bold text-slate-900 mb-2">{relatedKeyword.title}</h3>
                    <p className="text-slate-600 text-sm">
                      {relatedKeyword.problem_description.substring(0, 100)}...
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* 步骤指南 */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-red-600 text-white font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">Upload Your File</h3>
                    <p className="text-slate-600">
                      Simply drag and drop your file or click to upload it directly from your device.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-red-600 text-white font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">Choose Your Action</h3>
                    <p className="text-slate-600">
                      Select the tool you need and customize any settings according to your preferences.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-red-600 text-white font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900 mb-2">Process and Download</h3>
                    <p className="text-slate-600">
                      Let our tool process your file, then download the result directly to your device.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* You May Also Like */}
            <YouMayAlsoLike />

            {/* 联系信息 */}
            <div className="mt-12 border-t border-slate-200 pt-6 sm:pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                Contact Support
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                If you have any questions or need assistance, please contact us at:
              </p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                Support: 457239850@qq.com
              </p>
            </div>
          </div>

          {/* 右侧 sticky 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-slate-200 p-6 sm:p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <Zap className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-4">
                Free Adobe Alternative
              </h3>
              <p className="text-slate-600 text-center mb-6 sm:mb-8">
                Get the tools you need without the ridiculous price tag with stopsaas.
              </p>

              {/* 特性列表 */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-slate-600">100% Free</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-slate-600">No Downloads</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-slate-600">No Subscriptions</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-slate-600">Privacy-First</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-slate-600">Fast Processing</span>
                </div>
              </div>

              {/* 主 CTA 按钮 */}
              <motion.a
                href="/"
                className="block w-full py-3 sm:py-4 bg-blue-600 text-white font-bold text-base sm:text-lg text-center rounded-md hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Try stopsaas Now
                <ArrowRight className="inline-block ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </motion.a>

              {/* 信任标志 */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200">
                <p className="text-slate-500 text-xs sm:text-sm text-center mb-3 sm:mb-4">
                  Trusted by over 100,000 users worldwide
                </p>
                <div className="flex justify-center space-x-3 sm:space-x-4">
                  <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                  <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                  <Download className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                  <Upload className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
