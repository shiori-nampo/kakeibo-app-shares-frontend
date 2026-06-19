

export interface Transaction {
  id: number;
  date: string;
  category: string;
  category_id: number;
  memo: string;
  amount: number;
  type: "income" | "expense";
}

export const CATEGORIES = [
  { name: "住居費", type: "fixed" },
  { name: "光熱費", type: "fixed" },
  { name: "通信費", type: "fixed" },
  { name: "保険料", type: "fixed" },
  { name: "税金", type: "fixed" },
  { name: "食費", type: "variable" },
  { name: "外食費", type: "variable" },
  { name: "日用品", type: "variable" },
  { name: "交通費", type: "variable" },
  { name: "趣味", type: "variable" },
  { name: "交際費", type: "variable" },
  { name: "ショッピング", type: "variable" },
  { name: "医療費", type: "variable" },
  { name: "キッズ", type: "variable" },
  { name: "特別費", type: "variable" },
];

export const INCOME_CATEGORIES = [
  { id: 16, name: "給与" },
  { id: 17, name: "賞与" },
  { id: 18, name: "副収入" },
  { id: 19, name: "お小遣い" },
  { id: 20, name: "その他" },
];