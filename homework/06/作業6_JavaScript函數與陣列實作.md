# 作業 6 — JavaScript 進階函數與陣列實作

## 作業AI使用說明
全程皆使用claude進行撰寫

我:
```
1. 選擇題 -- [JavaScript 函數與陣列實作練習](https://gemini.google.com/share/e03d2be8eb37)
2. 程式題 
這是一份 JavaScript 進階函數與陣列操作的**實作挑戰題**。這份練習不再提供選項，請你嘗試在編輯器中寫出完整的程式碼來達成目標。
---
## JavaScript 函數實作練習題
### 1. Callback 基礎實作
**題目：** 建立一個名為 `mathTool` 的函數。它接受三個參數：`num1`, `num2` 以及一個 `action`（回呼函數）。
* 要求：呼叫 `mathTool(10, 5, ...)` 時，分別傳入不同的匿名函數來達成「相加」與「相減」。
* **範例輸出：** `15`, `5`
---
### 2. 匿名函數與立即執行 (IIFE)
**題目：** 寫出一個立即執行函數 (IIFE)，該函數內部定義一個區域變數 `count = 100`，並在執行時直接在控制台印出 `"Count is: 100"`。
* 要求：確保外部無法存取到這個 `count` 變數。
---
### 3. 箭頭函數與陣列轉換
**題目：** 給定一個陣列 `const prices = [100, 200, 300, 400]`。請使用 `map` 方法結合**箭頭函數**，產生一個新陣列，內容是原價格打 **8 折**後的結果。
* 要求：程式碼需簡潔，盡量使用單行箭頭函數。
---
### 4. 陣列參數的「破壞性修改」
**題目：** 撰寫一個函數 `cleanData(arr)`。
* 內部邏輯：使用陣列方法移除傳進來的陣列最後一個元素，並在最前面加上 `"Start"`。
* 驗證：宣告 `let myData = [1, 2, 3]`，執行 `cleanData(myData)` 後，觀察 `myData` 的內容。
---
### 5. 函數回傳函數 (Higher-Order Function)
**題目：** 寫一個函數 `multiplier(factor)`，它會「回傳」另一個箭頭函數。這個被回傳的函數接受一個數字參數 `n`，並回傳 `n * factor`。
* **範例用法：**
    ```javascript
    const double = multiplier(2);
    console.log(double(10)); // 預期輸出 20
    ```
---
### 6. Callback 篩選器
**題目：** 手寫一個類似 `filter` 的函數，名為 `myFilter(arr, callback)`。
* 邏輯：建立一個新陣列，遍歷 `arr`，若 `callback(item)` 回傳為 `true`，則將該元素放入新陣列。
* 測試：使用此函數篩選出 `[1, 5, 8, 12]` 中大於 7 的數字。
---
### 7. 箭頭函數處理物件
**題目：** 給定一個包含物件的陣列 `const users = [{name: "Alice", age: 25}, {name: "Bob", age: 17}]`。
* 任務：使用 `filter` 與箭頭函數，篩選出所有 `age` 大於或等於 18 的人。
---
### 8. 參數傳址陷阱：重新賦值 vs 修改
**題目：** 請問以下程式碼執行後，`listA` 與 `listB` 的內容分別是什麼？為什麼？
```javascript
let listA = [1, 2];
let listB = [3, 4];
function process(a, b) {
  a.push(99);
  b = [100];
}
process(listA, listB);

---
### 9. 延遲執行的 Callback
**題目：** 使用 `setTimeout`。要求在 2 秒後，利用**箭頭函數**印出陣列 `["Task", "Completed"]` 中組合起來的字串 `"Task Completed"`。
---
### 10. 綜合應用：計算總價
**題目：** 寫一個函數 `calculateTotal(cart, discountFunc)`。
* `cart` 是一個數字陣列（商品價格）。
* `discountFunc` 是一個處理折扣的 callback。
* 任務：先將 `cart` 內所有數字相加，再將總和傳入 `discountFunc` 處理後回傳。
* 測試：傳入 `[100, 200, 300]` 並透過匿名函數扣除 50 元。
根據作業的內容要求寫出對應內容

```
Claude:
```
我來幫您撰寫這份 JavaScript 函數與陣列實作的作業解答。我會把所有題目的程式碼解答寫成一份完整的 Markdown 文件，這樣可以直接貼到 GitHub issue 上。Created a fileCreated a file同時也建立一份可直接執行的 .js 檔案，方便您在瀏覽器 Console 或 Node.js 中驗證每一題的輸出：Created a fileCreated a file我用沙盒跑一次 node 作業16_solutions.js 驗證每一題輸出都正確：Run the solutions file to verify outputRun the solutions file to verify output所有 10 題的輸出都符合題目預期（第 9 題因為是 setTimeout 2 秒延遲，所以最後才印出，這是正確的非同步行為）。
作業檔案已建立：

作業 16 — JavaScript 函數與陣列實作（Markdown） — 含每題完整程式碼、中文說明與第 8 題觀念解釋，可直接貼到 GitHub issue。
作業 16 解答（可執行 .js） — 跑 node 作業16_solutions.js 可看到每題輸出。
```
---

