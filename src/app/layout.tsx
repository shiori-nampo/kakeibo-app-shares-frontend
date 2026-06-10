"use client";

import { useState } from "react";//開閉スイッチの魔法のインポート
import Link from "next/link";//画面を切り替えるためのリンク機能
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isOpen, setIsOpen] = useState(false);

  const MENU_ITEMS = [
    { name: "🗓️カレンダー表示", href: "/transaction/calendar" },
    { name: "💰収支登録", href: "/transaction" },
    { name: "📊一覧表示", href: "transaction/list" },
    { name: "📝TodoList", href: "/todo" },
    { name: "🛒買い物List", href: "/shopping" },
  ];

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blue-md shadow-sm z-50 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 active:scale-95 z-50">

              {isOpen ? (
                <span className="text-xl font-bold block w-6 h-6 text-center leading-6">✖️</span>
            ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              )}
            </button>
            <span className="text-2xl font-black tracking-wider text-blue-600 font-mono select-none">shares
            </span>
          </div>
          <div className="w-8 h-8"></div>
        </header>

        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 transition-opacity pt-16"/>
        )}

        <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-2xl z-40 transform transition-transform duration-300 p-6 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex flex-col gap-6">
            <div className="border-b pb-3 border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Menu</p>
            </div>

            <nav className="flex flex-col gap-2">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // 💡 リンクを押したらメニューを閉じる
                  className="text-sm font-bold text-gray-600 hover:text-green-500 hover:bg-green-50 px-3 py-2.5 rounded-xl transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <button
            onClick={() => {
              alert("ログアウト処理（ここにFortifyのログアウト魔法を入れます）");
              setIsOpen(false);
            }}
            className="w-full text-left text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2.5 rounded-xl transition-all mt-auto"
          >
            🚪 ログアウト
          </button>
        </div>

        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
