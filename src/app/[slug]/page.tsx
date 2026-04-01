// 导入关键词数据
import { Suspense } from 'react';
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
  params: {
    slug: string;
  };
};

// 生成静态参数
export async function generateStaticParams() {
  return keywords.map((keyword) => ({
    slug: keyword.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: Props) {
  const keyword = keywords.find((k) => k.slug === params.slug);
  
  if (!keyword) {
    return {
      title: 'stopsaas - Free Adobe Alternatives',
      description: 'Free tools to replace expensive Adobe subscriptions',
      keywords: 'free adobe alternatives, stopsaas, adobe alternatives, free design tools',
      robots: 'index, follow',
    };
  }

  return {
    title: keyword.title,
    description: `${keyword.problem_description} ${keyword.how_to_solve}`,
    keywords: `${keyword.keyword}, adobe alternative, free tool, stopsaas`,
    canonical: `https://stopsaas.com/${keyword.slug}`,
    robots: 'index, follow',
    openGraph: {
      title: keyword.title,
      description: `${keyword.problem_description} ${keyword.how_to_solve}`,
      url: `https://stopsaas.com/${keyword.slug}`,
      type: 'website',
      siteName: 'stopsaas',
    },
    twitter: {
      card: 'summary_large_image',
      title: keyword.title,
      description: `${keyword.problem_description} ${keyword.how_to_solve}`,
    },
  };
}

// 生成视口设置
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

// 客户端组件
import ClientComponent from './client-component';

export default function SEOPage({ params }: Props) {
  // 查找当前 slug 对应的关键词数据
  const keyword = keywords.find((k) => k.slug === params.slug);

  if (!keyword) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            The page you are looking for does not exist.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-md hover:bg-red-700 transition-colors"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50">
        {/* 导航栏 */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <a href="/" className="text-2xl font-black text-slate-900">
              stopsaas
            </a>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white border border-slate-200 p-6 sm:p-8">
            <div className="h-12 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            <div className="mt-4 h-8 bg-slate-200 rounded w-1/2 animate-pulse"></div>
            <div className="mt-6 h-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    }>
      <ClientComponent keyword={keyword} />
    </Suspense>
  );
}
