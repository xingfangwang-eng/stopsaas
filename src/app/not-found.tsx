import Link from 'next/link';
import keywords from '@/data/keywords.json';

export default function NotFound() {
  // 随机获取10个工具展示
  const randomTools = keywords
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 导航栏 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-black text-slate-900">
            stopsaas
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 p-6 sm:p-8">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-6">
            This SaaS doesn't exist anymore.
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-8">
            We killed it.
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Pick a new victim below:
          </p>

          {/* 工具列表 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {randomTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <h3 className="font-medium text-slate-900 hover:text-red-600">
                  {tool.title}
                </h3>
              </Link>
            ))}
          </div>

          {/* 返回首页按钮 */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}