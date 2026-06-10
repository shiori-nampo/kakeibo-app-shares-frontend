type SummaryProps = {
  income: number;
  expense: number;
};

export default function SummaryCard({ income, expense }: SummaryProps) {
  const balance = income - expense;

  return (
    <div className="bg-white p-5 rounded-3xl shadow-xl w-full">
      <div className="grid grid-cols-3 text-center divide-x divide-gray-200">

        <div>
          <span className="text-xs font-bold text-gray-400 block mb-1">収入</span>
          <span className="text-md font-black text-blue-500">+¥{income.toLocaleString()}</span>
        </div>

        <div>
          <span className="text-xs font-bold text-gray-400 block mb-1">支出</span>
          <span className="text-md font-black text-red-500">-¥{expense.toLocaleString()}</span>
        </div>

        <div>
          <span className="text-xs font-bold text-gray-400 block mb-1">合計</span>
          <span className={`text-md font-black ${balance >= 0 ? "text-green-500" : "text-red-600"}`}>
            {balance >= 0 ? "+" : ""}¥{balance.toLocaleString()}
          </span>
        </div>

      </div>
    </div>
  );
}