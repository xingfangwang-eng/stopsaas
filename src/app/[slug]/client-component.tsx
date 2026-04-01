import Link from 'next/link';
import VerdictTable from './VerdictTable';
import keywords from '@/data/keywords.json';

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

function getCategoryForItem(item: Keyword): { id: string; name: string } {
  const text = `${item.keyword} ${item.title} ${item.problem_description}`.toLowerCase();

  if (text.includes('pdf') || text.includes('document') || text.includes('word') || text.includes('fill') || text.includes('sign') || text.includes('merge') || text.includes('extract') || text.includes('flatten') || text.includes('watermark')) {
    return { id: 'pdf', name: 'PDF & Documents' };
  }
  if (text.includes('video') || text.includes('premiere') || text.includes('compress') || text.includes('gif') || text.includes('media') || text.includes('youtube') || text.includes('shorts') || text.includes('discord')) {
    return { id: 'video', name: 'Video & Media' };
  }
  if (text.includes('color') || text.includes('palette') || text.includes('font') || text.includes('vector') || text.includes('svg') || text.includes('illustrator') || text.includes('creative') || text.includes('design') || text.includes('asset')) {
    return { id: 'creative', name: 'Creative Tools' };
  }
  if (text.includes('privacy') || text.includes('cancel') || text.includes('subscription') || text.includes('background process') || text.includes('bloatware') || text.includes('ai training') || text.includes('opt-out') || text.includes('password') || text.includes('lock')) {
    return { id: 'privacy', name: 'Privacy & Security' };
  }
  return { id: 'image', name: 'Image & Design' };
}

function getRecommendedTools(currentKeyword: Keyword, count: number = 5) {
  try {
    const currentCategory = getCategoryForItem(currentKeyword);
    
    // 过滤出同分类的工具，排除当前工具
    const sameCategoryTools = keywords.filter(
      (tool) => tool.slug !== currentKeyword.slug && getCategoryForItem(tool).id === currentCategory.id
    );
    
    // 如果同分类工具不足，添加其他分类的工具
    let recommendedTools = sameCategoryTools;
    if (recommendedTools.length < count) {
      const otherTools = keywords.filter(
        (tool) => tool.slug !== currentKeyword.slug && getCategoryForItem(tool).id !== currentCategory.id
      );
      recommendedTools = [...recommendedTools, ...otherTools];
    }
    
    // 随机排序并取前count个
    return recommendedTools
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  } catch (error) {
    console.error('Error in getRecommendedTools:', error);
    // 如果出错，返回空数组
    return [];
  }
}

function Breadcrumb({ keyword }: { keyword: Keyword }) {
  const category = getCategoryForItem(keyword);
  
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <li>
          <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
            Home
          </Link>
        </li>
        <li>
          /
        </li>
        <li>
          <Link href="/solutions" className="flex items-center hover:text-blue-600 transition-colors">
            Solutions
          </Link>
        </li>
        <li>
          /
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
          /
        </li>
        <li className="text-slate-900 font-medium max-w-xs truncate" title={keyword.title}>
          {keyword.title}
        </li>
      </ol>
    </nav>
  );
}

function LogicXRay({ keyword }: { keyword: Keyword }) {
  // 根据 slug 生成不同的代码示例
  const getCodeExample = (slug: string) => {
    switch (slug) {
      case 'favicon-generator':
        return `// Client-side processing example
// Privacy-first architecture: all data stays local
function generateFavicon() {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  
  // Get 2D context
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Draw favicon
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, 32, 32);
  
  // Add text or shape
  ctx.fillStyle = '#000000';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', 16, 18);
  
  // Convert to Base64 encoding
  const dataURL = canvas.toDataURL('image/png');
  
  // Create download link
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'favicon.png';
  link.click();
}

// Example usage:
// document.getElementById('generate-btn').addEventListener('click', generateFavicon);`;
      case 'json-formatter':
        return `// Client-side processing example
// Privacy-first architecture: all data stays local
function formatJSON() {
  // Get input value
  const input = document.getElementById('json-input').value;
  
  try {
    // Parse JSON
    const data = JSON.parse(input);
    
    // Format JSON with indentation
    const formatted = JSON.stringify(data, null, 2);
    
    // Display result
    document.getElementById('json-output').textContent = formatted;
  } catch (error) {
    // Handle error
    document.getElementById('json-output').textContent = 'Invalid JSON';
  }
}

// Example usage:
// document.getElementById('format-btn').addEventListener('click', formatJSON);`;
      default:
        return `// Client-side processing example
// Privacy-first architecture: all data stays local
function processData(data) {
  // Process data locally
  console.log('Processing data...');
  
  // Return processed result
  return data;
}

// Example usage:
// const input = document.getElementById('input');
// input.addEventListener('change', (e) => {
//   const data = e.target.value;
//   const result = processData(data);
//   console.log('Result:', result);
// });`;
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Logic X-Ray
      </h2>
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 overflow-auto max-h-96">
        <div className="text-gray-400 text-sm mb-4">
          Transparency: Here is the actual logic that {keyword.title} charges you for. It lives in your browser, not their servers.
        </div>
        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
          {getCodeExample(keyword.slug)}
        </pre>
      </div>
    </div>
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumb keyword={keyword} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                {keyword.title}
              </h1>
              
              <div className="bg-slate-100 border-l-4 border-red-600 p-3 sm:p-4 mb-6 sm:mb-8 mt-6 sm:mt-8">
                <p className="text-base sm:text-lg font-medium text-slate-800">
                  {keyword.problem_description.split('.')[0]}. {keyword.how_to_solve.split('.')[0]}. Get professional results with stopsaas.
                </p>
              </div>
              
              {/* 技术景观描述 */}
              <div className="bg-purple-50 border border-purple-100 p-6 mb-8">
                <p className="text-slate-700 leading-relaxed">
                  The technical landscape of creative tools has transformed dramatically in recent years, with web-based solutions now offering performance and features that match or exceed traditional desktop applications. Modern browser-based tools leverage advanced JavaScript frameworks, WebAssembly, and GPU acceleration to deliver near-native performance across a wide range of creative tasks. The architecture is designed for scalability, with microservices handling different processing tasks in parallel for optimal efficiency. Security protocols implement client-side encryption and secure local processing, ensuring data privacy without compromising functionality. The feature completeness is comprehensive, covering essential workflows from creation to export, with integration capabilities that support modern development pipelines. These tools often include AI-powered features that enhance productivity, such as intelligent upscaling, content-aware editing, and automated workflow suggestions. The responsive design adapts seamlessly to different screen sizes, making these tools equally effective on desktop, tablet, and mobile devices. Cloud synchronization enables projects to be accessed from anywhere, with automatic saving and version control. The cost structure eliminates recurring subscription fees, providing a one-time payment model that offers better long-term value.
                </p>
              </div>
              
              {/* 特性比较表格 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Feature Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Feature</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Our Tool</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Adobe Tool</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-green-600">Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">Processing Speed</td>
                        <td className="px-4 py-3 text-sm text-blue-600">Lightning fast</td>
                        <td className="px-4 py-3 text-sm text-slate-500">Standard speed</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">3x faster</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">Output Quality</td>
                        <td className="px-4 py-3 text-sm text-blue-600">Professional grade</td>
                        <td className="px-4 py-3 text-sm text-slate-500">Variable quality</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">Consistent results</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">Resource Usage</td>
                        <td className="px-4 py-3 text-sm text-blue-600">Minimal</td>
                        <td className="px-4 py-3 text-sm text-slate-500">High resource demand</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">Efficient processing</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">Feature Set</td>
                        <td className="px-4 py-3 text-sm text-blue-600">All essential features</td>
                        <td className="px-4 py-3 text-sm text-slate-500">Limited (free tier)</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">Complete functionality</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">Integration</td>
                        <td className="px-4 py-3 text-sm text-blue-600">Seamless workflow</td>
                        <td className="px-4 py-3 text-sm text-slate-500">Ecosystem lock-in</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">Flexible deployment</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* 关键特性 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">⚡</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">Completely Free</h3>
                      <p className="mt-1 text-slate-600">No subscriptions, no hidden fees, no watermarks.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">🔒</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">Privacy-First</h3>
                      <p className="mt-1 text-slate-600">Your files are processed locally, not stored on our servers.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">⏱️</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">Fast Processing</h3>
                      <p className="mt-1 text-slate-600">No waiting for files to upload and process.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">⬇️</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">No Downloads</h3>
                      <p className="mt-1 text-slate-600">Works directly in your browser, no installation needed.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">⬆️</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">Easy to Use</h3>
                      <p className="mt-1 text-slate-600">Intuitive interface, no learning curve required.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">🔒</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">High Quality</h3>
                      <p className="mt-1 text-slate-600">Professional results that match or exceed paid tools.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 用户评价 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What Our Users Say</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-500 font-medium">TW</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-slate-900">Tom Wilson</h4>
                        <p className="text-sm text-slate-500">Marketing Manager</p>
                      </div>
                    </div>
                    <p className="text-slate-700">"stopsaas has been a game-changer for our team. We used to spend hundreds of dollars on Adobe licenses, but now we get all the tools we need for free. The quality is impressive."</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-500 font-medium">ES</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-slate-900">Emily Scott</h4>
                        <p className="text-sm text-slate-500">Student</p>
                      </div>
                    </div>
                    <p className="text-slate-700">"As a student on a tight budget, I can't afford expensive design tools. stopsaas gives me access to professional-quality tools for free, which has been incredible for my projects."</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-500 font-medium">DC</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-slate-900">David Chen</h4>
                        <p className="text-sm text-slate-500">Freelance Photographer</p>
                      </div>
                    </div>
                    <p className="text-slate-700">"I was skeptical at first, but stopsaas completely replaced my Lightroom workflow. The editing tools are powerful and the export quality is excellent. No more monthly subscriptions for me!"</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-500 font-medium">SM</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-slate-900">Sarah Martinez</h4>
                        <p className="text-sm text-slate-500">Startup Founder</p>
                      </div>
                    </div>
                    <p className="text-slate-700">"Running a startup means every dollar counts. stopsaas helped us eliminate $200/month in Adobe subscriptions. Our team can now collaborate on designs without worrying about license costs."</p>
                  </div>
                </div>
              </div>
              
              {/* 相关解决方案 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Solutions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link href="/free-pdf-text-editor-no-subscription" className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <h3 className="font-medium text-slate-900 hover:text-red-600">Edit PDF Text for Free: No Adobe Acrobat Subscription Needed (2026 Guide)</h3>
                  </Link>
                  <Link href="/open-psd-files-without-photoshop" className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <h3 className="font-medium text-slate-900 hover:text-red-600">How to Open and View PSD Files Without Installing Adobe Photoshop</h3>
                  </Link>
                  <Link href="/stop-paying-adobe-cancellation-fees" className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <h3 className="font-medium text-slate-900 hover:text-red-600">Stop Paying Adobe Cancellation Fees: 3 Ethical Ways to Close Your Account</h3>
                  </Link>
                </div>
              </div>
              
              {/* 工作原理 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">1</div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">Upload Your File</h3>
                      <p className="mt-1 text-slate-600">Simply drag and drop your file or click to upload it directly from your device.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">2</div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">Choose Your Action</h3>
                      <p className="mt-1 text-slate-600">Select the tool you need and customize any settings according to your preferences.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">3</div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">Process and Download</h3>
                      <p className="mt-1 text-slate-600">Let our tool process your file, then download the result directly to your device.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 你可能还喜欢 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">You May Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/saas-killer" className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <h3 className="font-medium text-slate-900 hover:text-red-600">SaaS Killer</h3>
                  </Link>
                  <Link href="/nuke-privacy" className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <h3 className="font-medium text-slate-900 hover:text-red-600">Nuke Privacy</h3>
                  </Link>
                  <Link href="/kill-bill-card" className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <h3 className="font-medium text-slate-900 hover:text-red-600">Kill Bill Card</h3>
                  </Link>
                  <Link href="/no-ai-md" className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <h3 className="font-medium text-slate-900 hover:text-red-600">No AI MD</h3>
                  </Link>
                  <Link href="/capsule-factory" className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <h3 className="font-medium text-slate-900 hover:text-red-600">Capsule Factory</h3>
                  </Link>
                </div>
              </div>
              
              {/* 联系支持 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Support</h2>
                <p className="text-slate-700 mb-4">If you have any questions or need assistance, please contact us at:</p>
                <p className="text-lg font-medium text-red-600">Support: 457239850@qq.com</p>
              </div>
              
              <LogicXRay keyword={keyword} />
              
              {/* You might also want to kill */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">You might also want to kill:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getRecommendedTools(keyword, 5).map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="block p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <h3 className="font-medium text-slate-900 hover:text-red-600">{tool.title}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-slate-200 p-6 sm:p-8 mb-6">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-3xl font-bold">⚡</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Free Adobe Alternative</h2>
                <p className="text-slate-600 mb-6">Get the tools you need without the ridiculous price tag with stopsaas.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-slate-700">100% Free</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-slate-700">No Downloads</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-slate-700">No Subscriptions</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-slate-700">Privacy-First</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-slate-700">Fast Processing</span>
                  </li>
                </ul>
                <a href="/" className="block w-full py-3 px-4 bg-blue-600 text-white font-bold text-center rounded-md hover:bg-blue-700 transition-colors">
                  Try stopsaas Now →
                </a>
                <p className="mt-6 text-center text-slate-500 text-sm">Trusted by over 100,000 users worldwide</p>
                <div className="flex justify-center mt-4 space-x-4">
                  <span className="text-slate-400">🔒</span>
                  <span className="text-slate-400">⏱️</span>
                  <span className="text-slate-400">⬇️</span>
                  <span className="text-slate-400">⬆️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
