import { CategoryIcon } from "../../../components/CategoryIcon";

type RowProps = {
  item: any;
  isEditing: boolean;
  txType: "expense" | "income";
  viewMode: "day" | "week";
  CATEGORIES: any[];
  INCOME_CATEGORIES: string[];
  onUpdate: (id: number, field: string, value: any) => void;
  onDelete: (id: number) => void;
};

export default function TransactionRow({
  item,
  isEditing,
  txType,
  viewMode,
  CATEGORIES,
  INCOME_CATEGORIES,
  onUpdate,
  onDelete,
}: RowProps) {
  return (
    <div className="flex flex-col gap-1 w-full">

      {viewMode === "week" && (
        <span className="text-xs font-bold text-gray-400 mt-2 block">{item.date} のデータ</span>
      )}

      <div className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${
        isEditing ? "bg-white border-blue-300 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-400"
      }`}>

        <div className="w-32 flex-shrink-0 flex items-center gap-1.5">

          <CategoryIcon name={item.category} />

          {isEditing ? (
            <select
              value={item.category}
              onChange={(e) => onUpdate(item.id, "category", e.target.value)}
              className="w-full text-xs p-1.5 border border-gray-200 rounded-lg text-gray-800 font-bold bg-gray-50"
            >
              {txType === "expense"
                ? CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)
                : INCOME_CATEGORIES.map((name) => <option key={name} value={name}>{name}</option>)
              }
            </select>
          ) : (
            <span className="text-xs font-black px-2 py-0.5 bg-gray-200 rounded-lg text-gray-600">{item.category}</span>
          )}
        </div>

        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={item.memo}
              onChange={(e) => onUpdate(item.id, "memo", e.target.value)}
              className="w-full text-xs p-1.5 border border-gray-200 rounded-lg text-gray-800 bg-gray-50"
            />
          ) : (
            <span className="text-sm font-bold text-gray-700">{item.memo}</span>
          )}
        </div>

        <div className="w-24 text-right">
          {isEditing ? (
            <input
              type="number"
              value={item.amount}
              onChange={(e) => onUpdate(item.id, "amount", e.target.value)}
              className="w-full text-xs p-1.5 border border-gray-200 rounded-lg text-gray-800 text-right bg-gray-50"
            />
          ) : (
            <span className={`text-sm font-black ${txType === "expense" ? "text-red-500" : "text-blue-500"}`}>
              {txType === "expense" ? "-" : "+"}¥{item.amount.toLocaleString()}
            </span>
          )}
        </div>

        {isEditing && (
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors flex-shrink-0 text-xs"
            title="削除する"
          >
            🗑️
          </button>
        )}

      </div>
    </div>
  );
}