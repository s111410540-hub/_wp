// 題 7：箭頭函數處理物件
// 用 filter + 箭頭函數，篩出 age >= 18 的使用者

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 }
];

const adults = users.filter(u => u.age >= 18);
console.log(adults); // [{ name: "Alice", age: 25 }]
