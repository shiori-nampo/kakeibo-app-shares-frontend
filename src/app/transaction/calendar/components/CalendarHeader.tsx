
"use client";

type HeaderProps = {
  year: number;
  monthStr: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export default function CalendarHeader({
  year,
  monthStr,
  onPrevMonth,
  onNextMonth,
}: HeaderProps) {
  return (
    <div className="bg-blue-100 p-4 rounded-3xl shadow-xl max-w-4xl mx-auto w-full mb-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onPrevMonth}
          className="px-4 py-2 bg-white rounded-xl font-bold hover:bg-gray-300 transition-colors"
        >
          ◀︎
        </button>
        <h2 className="text-xl font-black text-gray-700">
          {year}年{monthStr}月
        </h2>
        <button
          onClick={onNextMonth}
          className="px-4 py-2 bg-white rounded-xl font-bold hover:bg-gray-300 transition-colors"
        >
          ▶︎
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-500 mb-2">
        <div className="text-red-500">日</div>
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div className="text-blue-500">土</div>
      </div>
    </div>
  );
}