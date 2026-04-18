// 題 1：Callback 基礎實作
// 建立 mathTool(num1, num2, action)，透過不同 callback 達成加法與減法

function mathTool(num1, num2, action) {
  return action(num1, num2);
}

// 相加
console.log(mathTool(10, 5, function (a, b) {
  return a + b;
})); // 15

// 相減
console.log(mathTool(10, 5, function (a, b) {
  return a - b;
})); // 5
