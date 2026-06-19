"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";


export default function VerifyEmailPage() {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axios.get("http://localhost:8002/sanctum/csrf-cookie", { withCredentials: true });

      const xsrfToken = decodeURIComponent(
        document.cookie
          .split(";")
          .find(row => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1] || ""
      );

      await axios.post("http://localhost:8002/api/email/verification-notification", {}, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      setMessage("✅認証メールを再送信しました！");
    } catch (error) {
      console.error(error);
      setMessage("❌再送信に失敗しました");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#333", marginBottom: "20px" }}>会員登録メールを送信しました！</h1>

      <div style={{ marginTop: "40px" }}>
        <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
        ご登録いただいたメールアドレス宛に、確認メールをお送りしました。
        </p>

        <div style={{ margin: "30px 0", padding: "20px", border: "1px dashed #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <a
          href="http://localhost:8026"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#ff6b6b",
            color: "#fff",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          Mailpit（メールボックス）を開く ➔
        </a>
        </div>

        <div style={{ marginTop: "30px" }}>
        <p style={{ fontSize: "14px", color: "#666" }}>メールが届かない場合はこちら</p>
        <button
          onClick={handleResend}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: loading ? "#ccc" : "#4bc0c0",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px"
          }}
        >
          {loading ? "送信中..." : "認証メールを再送信する"}
        </button>

        {message && <p style={{ marginTop: "15px", fontSize: "14px", fontWeight: "bold", color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
      </div>

      <hr style={{ margin: "40px 0", border: "0", borderTop: "1px solid #eee" }} />

      <Link href="/login" style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none"
        }}>
          ログイン画面へ戻る
        </Link>
      </div>
    </div>
  );
}