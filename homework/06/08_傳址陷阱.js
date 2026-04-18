// 題 8：參數傳址陷阱：重新賦值 vs 修改
// a.push(99)  → 透過參照修改原陣列 → listA 會被改
// b = [100]   → 只是把區域變數 b 指向新陣列 → listB 不受影響

let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99);
  b = [100];
}

process(listA, listB);

console.log(listA); // [1, 2, 99]
console.log(listB); // [3, 4]

// 結論：
// 「改物件的內容」→ 外部會連動
// 「把參數重新指向新東西」→ 外部不受影響
