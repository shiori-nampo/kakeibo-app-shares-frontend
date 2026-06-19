"use client";


import DetailHeader from "./components/DetailHeader";
import SummaryCard from "./components/SummaryCard";
import TransactionRow from "./components/TransactionRow";
import { useTransactionDetail } from "./components/useTransactionDetail";
import { CATEGORIES, INCOME_CATEGORIES } from "./components/constants";




export default function DetailPage() {

  const {
    date, setViewMode, setTxType, setIsEditing, viewMode, txType, isEditing, isLoading, weekRange, filteredItems, totalIncome, totalExpense,
    changeDate, getWeekdayStr, handleValueChange,handleSave, handleDelete
  } = useTransactionDetail();

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center text-gray-600 font-bold">
        データを読み込み中...
      </div>
    );
  }

  // 「2026-06-15(月)」の形を作る
  const displayDayTitle = `${date}(${getWeekdayStr(date)})`;

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
              {viewMode === "day" ? displayDayTitle : weekRange.display}
            </span>
            <button
              onClick={() => {
                if (isEditing) {
                  filteredItems.forEach(item => {
                    handleSave(item.id);
                  });
                }
                setIsEditing(!isEditing);
              }}
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
                  onValueChange={handleValueChange}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}