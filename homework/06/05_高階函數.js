// 題 5：函數回傳函數 (Higher-Order Function / Closure)
// multiplier(factor) 回傳一個記住 factor 的箭頭函數

function multiplier(factor) {
  return (n) => n * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30
