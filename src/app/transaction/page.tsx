"use client"

import { useState,useEffect } from "react";
import { CategoryIcon } from "../components/CategoryIcon";
import axios from "axios";

const CATEGORIES = [
  { id: 1, name: "住居費", type: "fixed" },
  { id: 2, name: "光熱費", type: "fixed" },
  { id: 3, name: "通信費", type: "fixed" },
  { id: 4, name: "保険料", type: "fixed" },
  { id: 5, name: "税金", type: "fixed" },
  { id: 6, name: "食費", type: "variable" },
  { id: 7, name: "外食費", type: "variable" },
  { id: 8, name: "日用品", type: "variable" },
  { id: 9, name: "交通費", type: "variable" },
  { id: 10, name: "趣味", type: "variable" },
  { id: 11, name: "交際費", type: "variable" },
  { id: 12, name: "ショッピング", type: "variable" },
  { id: 13, name: "医療費", type: "variable" },
  { id: 14, name: "キッズ", type: "variable" },
  { id: 15, name: "特別費", type: "variable" },

  { id: 16, name: "給与", type: "income" },
  { id: 17, name: "賞与", type: "income" },
  { id: 18, name: "副収入", type: "income" },
  { id: 19, name: "お小遣い", type: "income" },
  { id: 20, name: "その他", type: "income" },
];


export default function TransactionInputPage() {
  const [type, setType] = useState<"支出" | "収入">("支出");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[5]);

  const filteredCategories = CATEGORIES.filter((cat) => {
    if (type === "支出") {
      return cat.type === "fixed" || cat.type === "variable";
    } else {
      return cat.type === "income";
    }
  });


  useEffect(() => {
    if (type === "支出") {
      const defaultExpense = CATEGORIES.find(c => c.name === "食費");
      if (defaultExpense) setSelectedCategory(defaultExpense);
    } else {
      const defaultIncome = CATEGORIES.find(c => c.name === "給与");
      if (defaultIncome) setSelectedCategory(defaultIncome);
    }
  }, [type]);

  const changeDate = (days: number) => {
    const current = new Date(date);
    current.setDate(current.getDate() + days);
    setDate(current.toISOString().split("T")[0]);
  };

  const handleTypeChange = (e: React.MouseEvent, newType: "支出" | "収入") => {
    e.preventDefault();
    setType(newType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        date: date,
        type: type === "支出" ? "expense" : "income",
        amount: Number(amount),
        category_id: selectedCategory.id,
        memo: memo,
        scope: "shared"
      };

      const response = await axios.post("http://localhost:8002/api/transactions", submitData, {
        withCredentials: true,
      });

      console.log("Laravelへの登録に成功しました:", response.data);
      alert("データを登録しました!");

      setMemo("");
      setAmount("");

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ 送信エラー詳細:", error.response?.data || error.message);
        alert(`登録に失敗しました: ${error.response?.data.message || "サーバーエラー"}`);
      } else {
        console.error("❌ 予期せぬエラー:", error);
        alert("エラーが発生しました");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 p-6 bg-white shadow-xl rounded-3xl text-gray-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={(e) => handleTypeChange(e, "支出")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${type === "支出" ? "bg-red-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}>
            支出
          </button>
          <button
            type="button"
            onClick={(e) => handleTypeChange(e,"収入")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${type === "収入" ? "bg-green-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
          >収入
          </button>
      </div>
      <div className="flex items-center justify-between bg-gray-50 p-1 rounded-xl border border-gray-200">
        <button type="button" onClick={() => changeDate(-1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded^lg font-bold">◀︎</button>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent text-center text-gray-800 font-semibold focus:outline-none" />
        <button type="button" onClick={() => changeDate(1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg font-bold">▶︎</button>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1">メモ</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            />
      </div>
      <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">金額</label>
            <div className="relative flex items-center">
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-200 p-3 pr-10 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-lg bg-gray-50"
                required
              />
              <span className="absolute right-4 text-gray-500 font-semibold">円</span>
            </div>
      </div>
      <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">カテゴリー</label>
            <div className="grid grid-cols-5 gap-2">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${
                      isSelected
                        ? "bg-blue-50 border-blue-500 shadow-sm scale-105"
                        : "bg-white border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isSelected ? "text-blue-600" : "text-gray-400"}`}>
                      <CategoryIcon name={cat.name} />
                    </div>

                    <span className={`text-[10px] mt-1 font-medium tracking-tighter ${isSelected ? "text-blue-600 font-bold" : "text-gray-500"}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
      </div>
      <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-md mt-2"
          >
            データを記録する
          </button>
        </form>
      </div>
  );

}



