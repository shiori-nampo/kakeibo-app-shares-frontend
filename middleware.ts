import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
//ブラウザが持ってるログインの鍵（クッキー）を確認
  const isAuthenticated = request.cookies.has('laravel_session');

  const { pathname } = request.nextUrl;
//ログインしてない＆ログイン、登録画面以外に行こうとした場合、
  if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
//ログイン画面へ飛ばす
    return NextResponse.redirect(new URL('/login', request.url));
  }
//ログインしている、ログイン済みでまたログイン画面位行こうとした場合
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
//もうログインしてるのでメイン画面へ飛ばす
    return NextResponse.redirect(new URL('/transaction/calendar', request.url));
  }

  return NextResponse.next();
}
//門番が見張る対象のページを指定する（画像やスタイルシートなどは除外する
export const config = {
  matcher: ['/((?!_next/static|_next_image|favicon.ico).*)'],
};