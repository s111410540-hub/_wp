// 題 3：箭頭函數與陣列轉換
// 用 map + 單行箭頭函數，把價格打 8 折

const prices = [100, 200, 300, 400];
const discounted = prices.map(p => p * 0.8);

console.log(discounted); // [80, 160, 240, 320]
