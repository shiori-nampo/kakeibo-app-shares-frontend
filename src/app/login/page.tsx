"use client"; //画面を動かす時に絶対ルール

import { useState } from "react";
import Link from "next/link"; //画面を移動するための魔法のタグ
import { useRouter } from "next/navigation";//ジャンプする
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

export default function LoginPage() {

  const router = useRouter();//ジャンプの定義
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      await axios.get("http://localhost:8002/sanctum/csrf-cookie", { withCredentials: true });

      const xsrfToken =
        decodeURIComponent(
          document.cookie.split(";")
            .find(row => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1] || ""
        );

      console.log("xsrf", xsrfToken);

      console.log("cookie確認", document.cookie);


      await axios.post("http://localhost:8002/login", { email, password }, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      }
      );

      alert("ログインに成功しました!");

      localStorage.setItem("is_logged_in", "true");

      try {
        router.push("/transaction/list");
        window.location.href = "/transaction/list";
      } catch (moveError: any) {
        if (moveError.response && moveError.response.status === 403) {
          alert("メール認証が完了していません。認証画面に移動します");
          window.location.href = "/verify-email";
          return;
        }
        throw moveError;
      }

    } catch (error) {

      if (!axios.isAxiosError(error)) {
        alert("ログイン処理中に予期せぬエラーが発生しました");
        return;
      }

      if (error.response && error.response.status === 403) {
        alert("メール認証が完了していません。認証画面へ移動します");
        window.location.href = "/verify-email";
        return;
      }

      console.error("ログインエラーの詳細:", error.response?.data);

      const responseData = error.response?.data as {
        errors?: Record<string, string[]>;
        message?: string;
      } | undefined;

      const laravelErrors = responseData?.errors;

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

      alert("ログイン処理中にエラーが発生しました。");
  }
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