"use client";

import { useState,useEffect } from "react";
import ShoppingItem from "./ShoppingItem";
import axios from 'axios';

type ShoppingItemType = {
  id: number;
  title: string;
  is_completed: boolean;
};


export default function ShoppingItemPage() {

  const [items, setItems] = useState<ShoppingItemType[]>([]);

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8002/api/shopping",
        {
          withCredentials: true,
        });
      setItems(response.data);
    } catch (error) {
      console.error("データ取得失敗:", error);
    }
  };


  const addItem = async (e: React.FormEvent) => {
    e.preventDefault(); //ページが勝手にリロードされない魔法
    if (!inputText.trim()) return;//入力欄が空っぽなら何もしない

    try {

    await axios.get(
  "http://localhost:8002/sanctum/csrf-cookie",
  { withCredentials: true }
);

      const xsrfToken = decodeURIComponent(
        document.cookie.split("; ")
          .find(row => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1] || ""
      );

      console.log("cookie", document.cookie);
      console.log("xsrfToken", xsrfToken);



const response = await axios.post(
  "http://localhost:8002/api/shopping",
  {
    title: inputText,
    type: "shopping",
  },
  {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": xsrfToken,
    },
  }
);
      setItems([...items, response.data.data]);
      setInputText("");
      console.log("LaravelのDBに追加保存しました");
    } catch (error) {
      console.error("追加に失敗しました:", error);
    }
  };

  const toggleItem = async (id: number) => {
    const currentItem = items.find(item => item.id === id);
    if (!currentItem) return;

    try {

      await axios.get('http://localhost:8002/sanctum/csrf-cookie', { withCredentials: true });

      const xsrfToken =
        decodeURIComponent(
          document.cookie.split(";")
            .find(row => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1] || ""
        );

      await axios.patch(`http://localhost:8002/api/shopping/${id}`, {
        is_completed: !currentItem.is_completed
      }, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      }
      );

      setItems(
        items.map((item) =>
          item.id === id ? { ...item, is_completed: !item.is_completed } : item
        )
      );
      console.log("チェック状態を更新しました");
    } catch (error) {
      console.error("更新に失敗しました:", error);
    }
  };

  const deleteItem = async (id: number) => {

    try {
      await axios.get('http://localhost:8002/sanctum/csrf-cookie', { withCredentials: true });

      const xsrfToken =
        decodeURIComponent(
          document.cookie.split(";")
            .find(row => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1] || ""
        );

      await axios.delete(`http://localhost:8002/api/shopping/${id}`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      }
      );

      setItems(items.filter((item) => item.id !== id));
      console.log("DBから削除しました");
    } catch (error) {
      console.error("削除に失敗しました", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 text-gray-800 flex flex-col items-center">
      <div className="max-w-md w-full flex flex-col gap-6">

        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-700 tracking-wider">🛒 SHOPPING LIST</h1>
          <p className="text-xs text-gray-400 mt-1">Shoppingリスト</p>
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