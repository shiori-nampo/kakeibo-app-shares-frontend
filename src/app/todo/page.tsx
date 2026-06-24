"use client";

import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import axios from "axios";


type TodoType = {
  id: number;
  title: string;
  is_completed: boolean;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [inputText, setInputText] = useState("");


  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/todo', {
        withCredentials: true,
      });

      const incomingData = response.data.data || response.data;
      setTodos(Array.isArray(incomingData) ? incomingData : []);

    } catch (error) {
      console.error("Todoの取得に失敗しました", error);
      setTodos([]);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    try {
      await axios.get('http://localhost:8002/sanctum/csrf-cookie', { withCredentials: true });

      const xsrfToken =
      decodeURIComponent(
      document.cookie
      .split("; ")
      .find(row => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1] || ""
  );

      const response = await axios.post("http://localhost:8002/api/todo", {
        title: inputText,
      }, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const newTodo = response.data.data || response.data;
      setTodos([...todos, newTodo]);
      setInputText("");
      console.log("Todoを追加しました");
    } catch (error) {
      console.error("追加に失敗しました", error);
    }
  };

  const toggleTodo = async (id: number) => {
    const currentTodo = todos.find(todo => todo.id === id);
    if (!currentTodo) return;

    try {
      await axios.get('http://localhost:8002/sanctum/csrf-cookie', { withCredentials: true });

      const xsrfToken =
        decodeURIComponent(
          document.cookie
          .split("; ")
          .find(row => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1] || ""
        );

      const response = await axios.patch(`http://localhost:8002/api/todo/${id}`, {
        is_completed: !currentTodo.is_completed
      }, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const updatedTodo = response.data.data || response.data;

      setTodos(
        todos.map((todo) =>
          (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("更新に失敗しました:", error);
    }
  };

  const deleteTodo = async (id: number) => {

    try {
      await axios.get('http://localhost:8002/sanctum/csrf-cookie', { withCredentials: true });

      const xsrfToken =
        decodeURIComponent(
          document.cookie
            .split("; ")
            .find(row => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1] || ""
        );

      await axios.delete(`http://localhost:8002/api/todo/${id}`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      setTodos(todos.filter((todo) => todo.id !== id));
      console.log("削除しました");
    } catch (error) {
      console.error("削除に失敗しました:", error);
    }
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
          {todos?.length === 0 ? (
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