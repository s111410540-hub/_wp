// 題 2：匿名函數與立即執行 (IIFE)
// 用 IIFE 隔離變數，讓外部無法存取 count

(function () {
  const count = 100;
  console.log("Count is: " + count);
})();

// 下面這行會報錯：ReferenceError: count is not defined
// console.log(count);
