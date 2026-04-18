// 第 7 題：模擬資料庫的查詢行為 (Simulating Database Query)
// 1. 實作模擬資料庫查詢的函數
function fakeGet(sql, params, callback) {
  // 這裡我們不真的去查資料庫，而是直接回傳假資料給 callback
  const fakeRow = { id: 1, title: "掌握 JavaScript 函數", content: "這是一篇關於 Callback 的文章..." };
  
  // 執行回呼函數，傳入 (錯誤為 null, 資料物件為 fakeRow)
  callback(null, fakeRow);
}

// 2. 測試呼叫：模擬在 Express 中抓取文章的場景
const query = "SELECT * FROM posts WHERE id = ?";
const inputParams = [1];

fakeGet(query, inputParams, (err, row) => {
  if (err) {
    console.error("查詢失敗");
  } else {
    // 練習：請在這裡印出該文章的 title
    console.log("抓到的文章標題是：", row.title);
  }
});
