"use client";

import { useState } from "react";
import { CategoryIcon } from "../../components/CategoryIcon";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CATEGORIES = [
  { name: "住居費", type: "fixed", budget: 50000, amount: 50000, color: "#3b82f6" },
  { name: "光熱費", type: "fixed", budget: 15000, amount: 18000, color: "#eab308" },
  { name: "通信費", type: "fixed",budget: 10000, amount: 8000, color: "#a855f7" },
  { name: "保険料", type: "fixed",budget: 20000, amount: 20000, color: "#ec4899" },
  { name: "税金", type: "fixed",budget: 30000, amount: 0, color: "#64748b" },
  { name: "食費", type: "variable",budget: 40000, amount: 45000, color: "#f97316" },
  { name: "外食費", type: "variable",budget: 15000, amount: 12000, color: "#f43f5e" },
  { name: "日用品", type: "variable",budget: 10000, amount: 5000, color: "#10b981" },
  { name: "交通費", type: "variable",budget: 10000, amount: 3000, color: "#06b6d4" },
  { name: "趣味", type: "variable",budget: 20000, amount: 15000, color: "#84cc16" },
  { name: "交際費", type: "variable",budget: 15000, amount: 20000, color: "#475569" },
  { name: "ショッピング", type: "variable",budget: 30000, amount: 10000, color: "#14b8a6" },
  { name: "医療費", type: "variable",budget: 10000, amount: 2000, color: "#fb923c" },
  { name: "キッズ", type: "variable",budget: 20000, amount: 0, color: "#db2777" },
  { name: "特別費", type: "variable",budget: 50000, amount: 12000, color: "#4f46e5" },
];

const data: { name: string; type: string; budget: number; amount: number; color: string; }[] = CATEGORIES;

export default function TransactionListPage() {
  const [currentMonth, setCurrentMonth] = useState("2026-06");

  const [type, setType] = useState<"支出" | "収入">("支出");

  const changeMonth = (amount: number) => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + amount);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${yyyy}-${mm}`);
  };
  const sortedData: typeof data = data
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-2xl rounded-3xl mt-6 text-gray-800 mb-20">

      <div className="flex items-center justify-between bg-gray-50 p-1 rounded-xl border border-gray-200 mb-6">
        <button type="button" onClick={() => changeMonth(-1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg font-bold">◀</button>
        <h1 className="text-lg font-bold text-gray-700">
          {currentMonth.replace("-", "年 ")}月
        </h1>
        <button type="button" onClick={() => changeMonth(1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg font-bold">▶</button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
        <button type="button"
          onClick={() => setType("支出")}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${type === "支出" ? "bg-red-500 text-white shadow-md" : "text-gray-500"}`}
        >
          支出
        </button>
        <button
          type="button"
          onClick={() => setType("収入")}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${type === "収入" ? "bg-green-500 text-white shadow-md" : "text-gray-500"}`}
        >
          収入
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 border-b pb-6 mb-6">
        <div className="w-36 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                dataKey="amount"
                nameKey="name"
                innerRadius={25}
                outerRadius={65}
                startAngle={90}
                endAngle={-270}
              >
            {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 max-h-36 overflow-y-auto pr-2 text-xs flex-1">
          {data.filter(c => c.amount > 0).map((cat) => (
            <div key={cat.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-gray-600 truncate font-medium">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
        {data.map((cat) => {
          const percent = (cat.amount / cat.budget) * 100;
          const isOverBudget = cat.amount > cat.budget;
          const barColor = isOverBudget ? "bg-red-500" : "bg-blue-500";

          return (
            <div key={cat.name} className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-semibold text-gray-700">
                <span className="flex items-center gap-1">
                  <CategoryIcon name={cat.name} /> {cat.name}
                </span>
                <span className={isOverBudget ? "text-red-500 font-bold" : "text-gray-500"}>
                  {cat.amount.toLocaleString()}円 / {cat.budget.toLocaleString()}円
                </span>
              </div>

              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`${barColor} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
