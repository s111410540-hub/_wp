// 8. 樣板字串中的邏輯運算 (Template Literals with Logic)
// 目標： 理解網頁 HTML 模板的產生。
// 題目： 宣告變數 user = "Guest"。請使用「反引號 (`)」建立一個 HTML 字串，
// 內容為 <h1>Welcome, ${...}</h1>，其中 ${} 內要判斷：如果 user 有值就顯示 user，否則顯示 "Stranger"。

// 變數宣告
let user = "Guest";

// 使用樣板字串與三元運算子
let html = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;

console.log("當 user = 'Guest' 時:", html);

// 測試其它狀況
let user2 = ""; // 沒有值
let html2 = `<h1>Welcome, ${user2 ? user2 : "Stranger"}</h1>`;
console.log("當 user2 為空字串時:", html2);

