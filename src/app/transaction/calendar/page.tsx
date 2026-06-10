"use client"

import { useState } from "react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 text-gray-800 flex flex-col items-center justify-start">

      <div className="max-w-4xl w-full flex flex-col gap-4">
        <div className="bg-blue-100 p-4 rounded-3xl shadow-xl max-w-4xl mx-auto w-full mb-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-white rounded-xl font-bold hover:bg-gray-300">◀︎</button>
          <h2 className="text-xl font-black text-gray-700">{year}年{month}月</h2>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-white rounded-xl font-bold hover:bg-gray-300">▶︎</button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-500 mb-2">
          <div className="text-red-500">日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div className="text-blue500">土</div>
        </div>

        <div className="grid grid-cols-7 gap-2 min-h0[400px]">
          {Array.from({ length: 30 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-50 p-2 rounded-2xl border border-gray-150 flex flex-col justify-between min-h-[70px] cursor-pointer hover:bg-blue-50 transition-colors">
              <span className="text-sm font-bold text-gray-600">{index + 1}</span>
              {index === 9 && <span className="text-sm font-bold text-red-500 text-right">-¥3,500</span>}
              {index === 24 && <span className="text-sm font-bold text-red-500 text-right">-¥1,200</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl max-w-4xl mx-auto w-full mt-auto">
        <div className="grid grid-cols-3 text-center divide-x divide-gray-200">
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-1">今月の収入</span>
            <span className="text-lg font-black text-blue-500">+¥250,000</span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-1">今月の支出</span>
            <span className="text-lg font-black text-red-500">-¥84,200</span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-1">今月の合計</span>
            <span className="text-lg font-black text-green-500">+¥165,800</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}