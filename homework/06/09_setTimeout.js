// 題 9：延遲執行的 Callback
// 用 setTimeout + 箭頭函數，2 秒後印出 "Task Completed"

setTimeout(() => {
  const arr = ["Task", "Completed"];
  console.log(arr.join(" "));
}, 2000);

console.log("等待 2 秒..."); // 會先印這行，再等 2 秒印上面的
