import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否为静态资源
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // 检查是否为根路径或solutions页面
  if (pathname === '/' || pathname === '/solutions') {
    return NextResponse.next();
  }
  
  // 检查是否为工具页面（以slug形式）
  // 这里我们不直接导入keywords.json，而是通过路径模式来判断
  if (pathname.match(/^\/[a-z0-9-]+$/)) {
    return NextResponse.next();
  }
  
  // 重定向到首页
  return NextResponse.redirect(new URL('/', request.url));
}

// 配置中间件的匹配路径
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};