// 9. 陣列物件的排序與切片 (Sort & Substring)
// 目標： 理解 SQL 語法在 JS 端的預習邏輯（例如 ORDER BY, substr）。
// 題目： 給定一個陣列 ["Very long content here", "Another Very long content here", "3rd Very long content here"]。
// 請取出這個字串的前 10 個字元，並在後方加上 "..."。

const arr = [
  "Very long content here", 
  "Another Very long content here", 
  "3rd Very long content here"
];

// 處理陣列中的每個字串
const result = arr.map(str => {
  return str.substring(0, 10) + "...";
});

console.log(result);
