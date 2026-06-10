"use client";

import { useState } from "react";
import ShoppingItem from "./ShoppingItem";


const INITIAL_ITEMS = [
  { id: 1, text: "牛乳", completed: false },
  { id: 2, text: "卵", completed: true },
];


export default function ShoppingItemPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [inputText, setInputText] = useState("");

  const addItem = (e: React.FormEvent) => {
    e.preventDefault(); //ページが勝手にリロードされない魔法
    if (!inputText.trim()) return;//入力欄が空っぽなら何もしない

    const newItem = {
      id: Date.now(),
      text: inputText,
      completed: false,
    };

    setItems([...items, newItem]);
    setInputText("");
  };

  const toggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id != id));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 text-gray-800 flex flex-col items-center">
      <div className="max-w-md w-full flex flex-col gap-6">

        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-700 tracking-wider">🛒 SHOPPING LIST</h1>
          <p className="text-xs text-gray-400 mt-1">お買い物リスト</p>
        </div>

        <form onSubmit={addItem} className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="買う物を入力..."
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
          {items.length === 0 ? (
            <p className="text-center py-8 text-sm font-bold text-gray-400">全て買い物完了です✨</p>
          ) : (
            items.map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onToggle={toggleItem}
                onDelete={deleteItem}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}