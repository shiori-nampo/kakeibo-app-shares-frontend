"use client";

import { useState } from "react";
import TodoItem from "./TodoItem";

const INITIAL_TODOS = [
  { id: 1, text: "今月の家賃を振り込む", completed: false },
  { id: 2, text: "スーパーで牛乳と卵を買う", completed: true },
];

export default function TodoPage() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [inputText, setInputText] = useState("");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault(); //ページが勝手にリロードされない魔法
    if (!inputText.trim()) return;//入力欄が空っぽなら何もしない

    const newTodo = {
      id: Date.now(), //被らないID作成のため現在の時間をIDにする
      text: inputText,
      completed: false,
    };

    setTodos([...todos, newTodo]); //今までのリストの末尾に新しいTodoを繋げる
    setInputText("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id != id));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 text-gray-800 flex flex-col items-center">
      <div className="max-w-md w-full flex flex-col gap-6">

        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-700 tracking-wider">📝 TODO LIST</h1>
          <p className="text-xs text-gray-400 mt-1">タスクを管理してスッキリ片付けよう</p>
        </div>

        <form onSubmit={addTodo} className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="flex-1 bg-transparent px-3 py-2 text-sm font-bold text-gray-700 outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors shadow-sm"
          >
            追加
          </button>
        </form>

        <div className="flex flex-col gap-2.5">
          {todos.length === 0 ? (
            <p className="text-center py-8 text-sm font-bold text-gray-400">やることは全部終わりました！✨</p>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}