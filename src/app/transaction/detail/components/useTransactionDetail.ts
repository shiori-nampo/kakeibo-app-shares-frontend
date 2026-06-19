
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Transaction } from "./constants";

const CATEGORY_MAP: Record<number, string> = {
  1: "住居費", 2: "光熱費", 3: "通信費", 4: "保険料", 5: "税金",
  6: "食費", 7: "外食費", 8: "日用品", 9: "交通費", 10: "趣味",
  11: "交際費", 12: "ショッピング", 13: "医療費", 14: "キッズ", 15: "特別費"
};

const INCOME_CATEGORY_MAP: Record<number, string> = {
  16: "給与", 17: "賞与", 18: "副収入", 19: "お小遣い", 20: "その他"
};

export function useTransactionDetail() {
  const searchParams = useSearchParams();
  const [date, setDate] = useState(searchParams.get("date") || new Date().toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [txType, setTxType] = useState<"expense" | "income">("expense");
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8002/api/transactions", { withCredentials: true });

        const formattedData = response.data.map((item: Transaction & { category_id?: number }) => {
          const catId = item.category_id || 0;
          const catName = item.type === "expense"
            ? (CATEGORY_MAP[catId] || "未分類")
            : (INCOME_CATEGORY_MAP[catId] || "その他");

          return {
            ...item,
            date: String(item.date).substring(0, 10),
            category: item.category || catName
          };
        });

        setItems(formattedData);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDayData();
  }, [date]);

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

  const getWeekdayStr = (dateStr: string) => {
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    return weekdays[new Date(dateStr).getDay()];
  };

  const weekRange = getWeekRange(date);

  const filteredItems = items.filter(i =>
    i.type === txType &&
    (viewMode === "day" ? i.date === date : i.date >= weekRange.startStr && i.date <= weekRange.endStr)
  );

  const totalIncome = items.filter(i => viewMode === "day" ? i.date === date : i.date >= weekRange.startStr && i.date <= weekRange.endStr).filter(i => i.type === "income").reduce((s, i) => s + i.amount, 0);
  const totalExpense = items.filter(i => viewMode === "day" ? i.date === date : i.date >= weekRange.startStr && i.date <= weekRange.endStr).filter(i => i.type === "expense").reduce((s, i) => s + i.amount, 0);


  const handleValueChange = (id: number, field: string, value: string | number) => {
    const updatedValue = field === "amount" ? Number(value) : value;

    setItems(prevItems =>
      prevItems.map(i => {
        if (i.id === id) {
          const updatedItem: Transaction = {
            ...i,
            [field as keyof Transaction]: updatedValue
          };

          if (field === "category") {
            const map = txType === "expense" ? CATEGORY_MAP : INCOME_CATEGORY_MAP;
            const foundId = Object.keys(map).find(key => map[Number(key)] === value);
            if (foundId) {
              updatedItem.category_id = Number(foundId);
            }
          }
          return updatedItem as Transaction;
        }
        return i;
      })
    );
  };

      const handleSave = async (id: number) => {
    try {
      const currentItem = items.find(i => i.id === id);
      if (!currentItem) return;


      const payload = {
        type: currentItem.type || "expense",
        date: currentItem.date || new Date().toISOString().split("T")[0],
        category_id: Number(currentItem.category_id || 6),
        memo: currentItem.memo || "",
        amount: Number(currentItem.amount)
      };

      console.log("Laravelに送信する書類の中身:", payload);

      await axios.patch(`http://localhost:8002/api/transactions/${id}`, payload, { withCredentials: true });
      console.log("✅ 編集完了ボタンにより、DBに完全保存されました！");

    } catch (error) {
      console.error("Laravelへの保存に失敗しました:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;
    try {
      await axios.delete(`http://localhost:8002/api/transactions/${id}`, { withCredentials: true });
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error("削除に失敗しました:", error);
    }
  };

  return {
    date, setViewMode, setTxType, setIsEditing, viewMode, txType, isEditing,
    isLoading, weekRange, filteredItems, totalIncome, totalExpense,
    changeDate, getWeekdayStr, handleValueChange,handleSave, handleDelete
  };
}