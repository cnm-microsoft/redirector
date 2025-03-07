// middleware.js
import { NextResponse } from 'next/server';

// 本地缓存（从API预加载）
const redirects = new Map();

export async function middleware(req) {
  // 1. 解析请求信息
  const host = req.headers.get('host') || '';
  const port = req.headers.get('x-forwarded-port') || '80';
  const path = req.nextUrl.pathname;

  // 2. 首次运行时预加载规则（生产环境建议改用KV存储）
  if (redirects.size === 0) {
    const res = await fetch('http://localhost:3000/api/redirects');
    const data = await res.json();
    data.forEach(item => redirects.set(item.key, item.target));
  }

  // 3. 匹配重定向规则
  const target = redirects.get(`${host}:${port}${path}`);
  if (target) {
    return NextResponse.redirect(target, 301); // 永久重定向
  }

  return NextResponse.next();
}
