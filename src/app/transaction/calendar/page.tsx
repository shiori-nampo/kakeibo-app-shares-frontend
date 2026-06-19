
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CalendarHeader from "./components/CalendarHeader";
import CalendarBody from "./components/CalendarBody";

interface Transaction {
  id: number;
  date: string;
  type: "income" | "expense";
  amount: number;
  description?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const year = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;
  const monthStr = String(currentMonthNum).padStart(2, "0");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingData(true);
        const response = await axios.get("http://localhost:8002/api/transactions", {
          withCredentials: true,
        });

        const formattedData = (response.data as Array<{ id: number; date: string; [key: string]: unknown }>).map((t) => ({
          ...t,
          date: t.date.substring(0, 10),
        }));

        setTransactions(formattedData as Transaction[]);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTransactions();
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const firstDayOfWeek = new Date(year, currentDate.getMonth(), 1).getDay();
  const totalDays = new Date(year, currentMonthNum, 0).getDate();
  const blankDays = Array.from({ length: firstDayOfWeek });
  const calendarDays = Array.from({ length: totalDays }, (_, i) => i + 1);

  // 今月の合計計算
  let totalIncome = 0;
  let totalExpense = 0;
  transactions.forEach((t) => {
    if (t.date.startsWith(`${year}-${monthStr}`)) {
      if (t.type === "income") totalIncome += Number(t.amount);
      else if (t.type === "expense") totalExpense += Number(t.amount);
    }
  });
  const totalBalance = totalIncome - totalExpense;

  const handleDayClick = (day: number) => {
    const dayStr = String(day).padStart(2, "0");
    router.push(`/transaction/detail?date=${year}-${monthStr}-${dayStr}`);
  };

  if (isLoadingData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center text-gray-600 font-bold">
        データを読み込み中...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 text-gray-800 flex flex-col items-center justify-start">
      <div className="max-w-4xl w-full flex flex-col gap-4">

        <CalendarHeader
          year={year}
          monthStr={monthStr}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <CalendarBody
          blankDays={blankDays}
          calendarDays={calendarDays}
          year={year}
          monthStr={monthStr}
          transactions={transactions}
          onDayClick={handleDayClick}
        />

        <div className="bg-white p-6 rounded-3xl shadow-xl max-w-4xl mx-auto w-full mt-6">
          <div className="grid grid-cols-3 text-center divide-x divide-gray-200">
            <div>
              <span className="text-xs font-bold text-gray-400 block mb-1">今月の収入</span>
              <span className="text-lg font-black text-blue-500">+¥{totalIncome.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 block mb-1">今月の支出</span>
              <span className="text-lg font-black text-red-500">-¥{totalExpense.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 block mb-1">今月の合計</span>
              <span className={`text-lg font-black ${totalBalance >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalBalance >= 0 ? "+" : ""}¥{totalBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}