"use client"; //画面を動かす時に絶対ルール

import { useState } from "react"; //文字を記憶する魔法
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";//フロントからバックエンドにデータを届ける


//↓public functionと同じ意味で外で呼び出し可能という意味
export default function RegisterPage() {
  //function⬅︎関数 RegisterPage()（画面を作る職人）
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      await axios.get("http://localhost:8002/sanctum/csrf-cookie", { withCredentials: true });


      const xsrfToken =
        decodeURIComponent(
          document.cookie
            .split(";")
            .find(row => row.trim().startsWith("XSRF-TOKEN="))
            ?.split("=")[1] || ""
        );

      console.log("xsrf", xsrfToken);

      await axios.post("http://localhost:8002/register", { name, email, password, password_confirmation: password },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
        }
      );

      alert("アカウントを作成しました!");

      router.push("/verify-email");
      localStorage.setItem("is_logged_in", "true");
      window.location.href = "/transaction/list";

    } catch (error) {

      if (!axios.isAxiosError(error)) {
        alert("新規登録処理中に予期せぬエラーが発生しました。");
        return;
      }

      console.log(
        "response",
        JSON.stringify(error.response?.data, null, 2));

      const responseData = error.response?.data as {
        errors?: Record<string, string[]>;
        message?: string;
      } | undefined;

      const laravelErrors = responseData ?.errors;

      if (laravelErrors) {
        const errorMessages = Object.values(laravelErrors).flat().join("\n");
        alert(errorMessages);
        return;
      }

      const message = responseData?.message;
      if (message) {
        alert(message);
        return;
      }

      alert("サーバーとの通信に失敗しました。");
    }
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
