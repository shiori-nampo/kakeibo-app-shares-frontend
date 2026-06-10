"use client"; //画面を動かす時に絶対ルール

import { useState } from "react"; //文字を記憶する魔法
import Link from "next/link";

//↓public functionと同じ意味で外で呼び出し可能という意味
export default function RegisterPage() {
  //function⬅︎関数 RegisterPage()（画面を作る職人）
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    // Laravelの\api \app \registerに送るためののデータの塊を作成
    const formData = {
      name: name,
      email: email,
      password: password,
    };

    console.log("今からこのデータをLaravelに送るよ!:", formData);

    //Laravelにデータを送信するコード（fetchやaxios）をあとで書く
    alert(`送信テスト成功!\n名前: ${name}\nメール: ${email}\nこのデータをLaravelに送る準備ができました!`);
    // \n=改行
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-100 to-blue-50 p-4">
      <div className="p-10 w-full max-w-md text-center bg-white shadow-2xl rounded-3xl">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              アカウント作成
          </button>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
}