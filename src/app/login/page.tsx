"use client"; //画面を動かす時に絶対ルール

import { useState } from "react";
import Link from "next/link"; //画面を移動するための魔法のタグ


export default function RegisterPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {

    const formData = {
      email: email,
      password: password,
    };

    console.log("今からこのデータをLaravelに送るよ!:", formData);

    alert(`送信テスト成功!\nメール: ${email}\nこのデータでログインする準備ができました!`);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-100 to-blue-50 p-4">
      <div className="p-10 w-full max-w-md text-center bg-white shadow-2xl rounded-3xl">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white p-3 rounded-md font-semibold hover:scale-105 active:scale-95 transition-transform">
              ログイン
          </button>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            新規登録はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}