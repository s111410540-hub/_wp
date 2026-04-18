// 6. JSON 處理 (Parsing JSON)
// 目標： 理解 app.use(express.json()) 在處理什麼。
// 題目： 給定一個 JSON 字串 const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}'。
// 請將它轉換成 JavaScript 物件，並印出 tags 陣列中的第二個元素。

const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

// 將 JSON 轉回物件
let obj = JSON.parse(jsonStr);

// 印出 tags 陣列中的第二個元素
console.log(obj.tags[1]); // 預期輸出: node
