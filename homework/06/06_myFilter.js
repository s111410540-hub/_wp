// 題 6：Callback 篩選器
// 自己手寫一個類似 Array.prototype.filter 的函數

function myFilter(arr, callback) {
  const result = [];
  for (const item of arr) {
    if (callback(item)) {
      result.push(item);
    }
  }
  return result;
}

// 測試：篩出大於 7 的數字
console.log(myFilter([1, 5, 8, 12], n => n > 7)); // [8, 12]
