// 題 4：陣列參數的「破壞性修改」
// 透過傳址特性，函數內直接改動外部陣列

function cleanData(arr) {
  arr.pop();              // 移除最後一個元素
  arr.unshift("Start");   // 在最前面加上 "Start"
}

let myData = [1, 2, 3];
cleanData(myData);
console.log(myData); // ["Start", 1, 2]
