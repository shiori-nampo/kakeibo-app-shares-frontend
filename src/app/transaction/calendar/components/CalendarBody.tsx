
"use client";

interface Transaction {
  id: number;
  date: string;
  type: "income" | "expense";
  amount: number;
}

type BodyProps = {
  blankDays: unknown[];
  calendarDays: number[];
  year: number;
  monthStr: string;
  transactions: Transaction[];
  onDayClick: (day: number) => void;
};

export default function CalendarBody({
  blankDays,
  calendarDays,
  year,
  monthStr,
  transactions,
  onDayClick,
}: BodyProps) {
  return (
    <div className="grid grid-cols-7 gap-2 min-h-[400px]">
      {blankDays.map((_, index) => (
        <div key={`blank-${index}`} className="bg-transparent p-2 min-h-[70px]"></div>
      ))}

      {calendarDays.map((day) => {
        const formattedDay = String(day).padStart(2, "0");
        const fullDateStr = `${year}-${monthStr}-${formattedDay}`;

        // その日のトランザクションを抽出
        const dayTransactions = transactions.filter((t) => t.date === fullDateStr);

        let dayIncome = 0;
        let dayExpense = 0;
        dayTransactions.forEach((t) => {
          if (t.type === "income") dayIncome += Number(t.amount);
          if (t.type === "expense") dayExpense += Number(t.amount);
        });

        return (
          <div
            key={`day-${day}`}
            onClick={() => onDayClick(day)}
            className="bg-blue-100 p-2 rounded-2xl border border-gray-150 flex flex-col justify-between min-h-[70px] cursor-pointer hover:bg-blue-50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-600">{day}</span>

            <div className="flex flex-col text-right text-[11px] font-bold">
              {dayIncome > 0 && (
                <span className="text-sm font-bold text-blue-500 text-right">
                  +¥{dayIncome.toLocaleString()}
                </span>
              )}
              {dayExpense > 0 && (
                <span className="text-sm font-bold text-red-500 text-right">
                  -¥{dayExpense.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}