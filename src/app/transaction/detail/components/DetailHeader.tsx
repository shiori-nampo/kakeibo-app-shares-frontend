type HeaderProps = {
  viewMode: "day" | "week";
  setViewMode: (mode: "day" | "week") => void;
  date: string;
  weekDisplay: string;
  onChangeDate: (days: number) => void;
};

export default function DetailHeader({
  viewMode,
  setViewMode,
  date,
  weekDisplay,
  onChangeDate,
}: HeaderProps) {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-xl flex flex-col gap-4 w-full">

      <div className="flex justify-between items-center">
        <button
          onClick={() => onChangeDate(-1)}
          className="px-3 py-1.5 bg-gray-200 rounded-xl font-bold text-sm hover:bg-gray-300 transition-colors"
        >
          {viewMode === "day" ? "◀ 前日" : "◀ 前週"}
        </button>

        <h2 className="text-lg font-black text-gray-700">
          {viewMode === "day" ? (
            `${new Date(date).getFullYear()}/ ${new Date(date).getMonth() + 1}/ ${new Date(date).getDate()}`
          ) : (
            `${new Date(date).getFullYear()}/  ${weekDisplay}`
          )}
        </h2>

        <button
          onClick={() => onChangeDate(1)}
          className="px-3 py-1.5 bg-gray-200 rounded-xl font-bold text-sm hover:bg-gray-300 transition-colors"
        >
          {viewMode === "day" ? "翌日 ▶" : "翌週 ▶"}
        </button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button
          onClick={() => setViewMode("day")}
          className={`flex-1 py-2 text-center text-sm font-bold rounded-xl transition-all ${viewMode === "day" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400"
            }`}
        >
          日別
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={`flex-1 py-2 text-center text-sm font-bold rounded-xl transition-all ${viewMode === "week" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400"
            }`}
        >
          週別
        </button>
      </div>

    </div>
  );
}