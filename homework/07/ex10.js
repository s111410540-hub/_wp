// 10. 錯誤優先回呼模式 (Error-First Callback Pattern)
// 目標： 理解程式中不斷出現的 if (err) return ...。 
// 題目： 寫一個函數 checkAdmin(role, callback)。
// - 如果 role 不是 "admin"，呼叫 callback("Access Denied")。
// - 如果是 "admin"，呼叫 callback(null, "Welcome")。

function checkAdmin(role, callback) {
  if (role !== "admin") {
      callback("Access Denied");
  } else {
      callback(null, "Welcome");
  }
}

// 測試：練習呼叫此函數並處理有錯誤與沒錯誤的兩種狀況

// 情況 1: 不是 admin
checkAdmin("guest", (err, result) => {
  if (err) {
      console.log("Error:", err);
  } else {
      console.log("Success:", result);
  }
});

// 情況 2: 是 admin
checkAdmin("admin", (err, result) => {
  if (err) {
      console.log("Error:", err);
  } else {
      console.log("Success:", result);
  }
});
