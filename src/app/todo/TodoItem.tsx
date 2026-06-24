"use client";

type UserType = {
  id: number;
  name: string;
};

type TodoItemProps = {
  todo: { id: number; title: string; is_completed: boolean; completed_user?: UserType | null; };
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};


export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${todo.is_completed ? "bg-gray-50 border-gray-100 text-gray-400" : "bg-white border-gray-200 shadow-sm text-gray-700"
      }`}>
      <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onToggle(todo.id)}>
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={() => { }}
          className="w-5 h-5 rounded-lg text-green-500 border-gray-300 focus:ring-green-400 cursor-pointer"
        />
        <span className={`text-sm font-bold ${todo.is_completed ? "line-through text-gray-400" : ""}`}>{todo.title}
        </span>

        {todo.is_completed && todo.completed_user ? (
          <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-bold tracking-wider select-none">✅ {todo.completed_user.name}
          </span>
        ) : null}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id)
        }}
        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm"
      >
        🗑️
      </button>
    </div>
  );
}