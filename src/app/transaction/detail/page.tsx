"use client";

import { useState } from "react";
import DetailHeader from "./components/DetailHeader";
import SummaryCard from "./components/SummaryCard";
import TransactionRow from "./components/TransactionRow";



const CATEGORIES = [
  { name: "住居費", type: "fixed" },
  { name: "光熱費", type: "fixed" },
  { name: "通信費", type: "fixed" },
  { name: "保険料", type: "fixed" },
  { name: "税金", type: "fixed" },
  { name: "食費", type: "variable" },
  { name: "外食費", type: "variable" },
  { name: "日用品", type: "variable" },
  { name: "交通費", type: "variable" },
  { name: "趣味", type: "variable" },
  { name: "交際費", type: "variable" },
  { name: "ショッピング", type: "variable" },
  { name: "医療費", type: "variable" },
  { name: "キッズ", type: "variable" },
  { name: "特別費", type: "variable" },
];

const INCOME_CATEGORIES = ["給与", "賞与", "副収入", "お小遣い", "その他"];

const INITIAL_ITEMS = [
  { id: 1, date: "2026-06-09", category: "食費", memo: "スーパーで買い物", amount: 3500, type: "expense" },
  { id: 2, date: "2026-06-09", category: "趣味", memo: "新作のゲーム本", amount: 7800, type: "expense" },
  { id: 3, date: "2026-06-09", category: "給与", memo: "今月の給料日！", amount: 250000, type: "income" },
  { id: 4, date: "2026-06-08", category: "外食費", memo: "友達とランチ", amount: 1500, type: "expense" },
];

export default function DetailPage() {

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [txType, setTxType] = useState<"expense" | "income">("expense");
  const [isEditing, setIsEditing] = useState(false);

  const [items, setItems] = useState(INITIAL_ITEMS);

  const changeDate = (days: number) => {
    const current = new Date(date);
    current.setDate(current.getDate() + (viewMode === "week" ? days * 7 : days));
    setDate(current.toISOString().split("T")[0]);
  };

  const getWeekRange = (dateStr: string) => {
    const current = new Date(dateStr);
    const start = new Date(current);
    start.setDate(current.getDate() - current.getDay() + (current.getDay() === 0 ? -6 : 1));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
      startStr: start.toISOString().split("T")[0],
      endStr: end.toISOString().split("T")[0],
      display: `${start.getMonth() + 1}/${start.getDate()} ~ ${end.getMonth() + 1}/${end.getDate()}`
    };
  };

  const weekRange = getWeekRange(date);

  const filteredItems = items.filter(i =>
    i.type === txType &&
    (viewMode === "day" ? i.date === date : i.date >= weekRange.startStr && i.date <= weekRange.endStr)
  );

  const totalIncome = items.filter(i => viewMode === "day" ? i.date === date : i.date >= weekRange.startStr && i.date <= weekRange.endStr).filter(i => i.type === "income").reduce((s, i) => s + i.amount, 0);
  const totalExpense = items.filter(i => viewMode === "day" ? i.date === date : i.date >= weekRange.startStr && i.date <= weekRange.endStr).filter(i => i.type === "expense").reduce((s, i) => s + i.amount, 0);


  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 text-gray-800 flex flex-col items-center">
      <div className="max-w-xl w-full flex flex-col gap-6">

        <DetailHeader
          viewMode={viewMode}
          setViewMode={(mode) => { setViewMode(mode); setIsEditing(false); }}
          date={date}
          weekDisplay={weekRange.display}
          onChangeDate={changeDate}
        />

        <SummaryCard income={totalIncome} expense={totalExpense} />

        <div className="flex bg-gray-200 p-1 rounded-2xl">
          <button onClick={() => setTxType("expense")} className={`flex-1 py-2.5 text-center text-sm font-black rounded-xl transition-all ${txType === "expense" ? "bg-red-500 text-white shadow-md" : "text-gray-500"}`}>💸 支出を編集</button>
          <button onClick={() => setTxType("income")} className={`flex-1 py-2.5 text-center text-sm font-black rounded-xl transition-all ${txType === "income" ? "bg-blue-500 text-white shadow-md" : "text-gray-500"}`}>💰 収入を編集</button>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-3 border-gray-100">
            <span className="text-sm font-black text-gray-600 bg-gray-100 px-3 py-1 rounded-xl">
              {viewMode === "day" ? date : weekRange.display}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${isEditing ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              {isEditing ? "✅ 編集完了" : "✏️ 編集"}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {filteredItems.length === 0 ? (
              <p className="text-center py-6 text-sm font-bold text-gray-400">データはありません</p>
            ) : (
              filteredItems.map(item => (
                <TransactionRow
                  key={item.id}
                  item={item}
                  isEditing={isEditing}
                  txType={txType}
                  viewMode={viewMode}
                  CATEGORIES={CATEGORIES}
                  INCOME_CATEGORIES={INCOME_CATEGORIES}

                  onUpdate={(id, f, v) => setItems(items.map(i => i.id === id ? { ...i, [f]: f === "amount" ? Number(v) : v } : i))}

                  onDelete={(id) => setItems(items.filter(i => i.id !== id))}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}