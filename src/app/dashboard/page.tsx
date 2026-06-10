"use client";

import { useState } from "react";
import TransactionPage from "../transaction/page";
import TransactionListPage from "../transaction/list/page";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"list" | "input">("list");

  return (

    <div className="bg-gray-100 min-h-screen text-gray-800">

      <div className="flex lg:hidden bg-white border-b sticky top-0 z-50">
        <button
          type="button"
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-4 text-center font-bold text-sm ${activeTab === "list" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"}`}
        >
          分析一覧を見る
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("input")}
          className={`flex-1 py-4 text-center font-bold text-sm ${activeTab === "input" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400"}`}
        >
          データを入力する
        </button>
      </div>


      <div className="w-full mx-auto p-2 lg:p-6 flex flex-col lg:flex-row gap-8 items-stretch lg:justify-center max-w-7xl">

        <div className={`w-full lg:max-w-md lg:flex-1 ${activeTab === "list" ? "block" : "hidden lg:block"}`}>
          <TransactionListPage />
        </div>

        <div className={`w-full mx-auto lg:mx-0 lg:max-w-md lg:flex-1 ${activeTab === "input" ? "block" : "hidden lg:block"}
          [&_>_div]:min-h-0
          [&_>_div]:h-auto
          [&_>_div]:flex-col
          [&_>_div]:justify-start
          [&_>_div]:items-stretch`
        }>
          <TransactionPage />
        </div>

      </div>
    </div>
  );
}