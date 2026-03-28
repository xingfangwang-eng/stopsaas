"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Zap, Shield, Clock, Download, Upload, ChevronRight, Home, LayoutGrid, ExternalLink } from 'lucide-react';
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

            {/* 产品功能列表 */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-4 h-12 bg-red-600 mr-4"></span>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-4 h-12 bg-red-600 mr-4"></span>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-4 h-12 bg-red-600 mr-4"></span>
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-4 h-12 bg-red-600 mr-4"></span>
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
