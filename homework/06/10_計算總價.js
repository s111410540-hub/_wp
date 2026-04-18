// 題 10：綜合應用 — 計算總價
// calculateTotal(cart, discountFunc)：把 cart 加總後交給折扣函數處理

function calculateTotal(cart, discountFunc) {
  const total = cart.reduce((sum, price) => sum + price, 0);
  return discountFunc(total);
}

// 測試：[100, 200, 300] 加總 = 600，折扣 -50 → 550
const result = calculateTotal([100, 200, 300], function (total) {
  return total - 50;
});

console.log(result); // 550
