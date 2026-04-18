// 2. 物件解構賦值 (Object Destructuring)
// 目標： 理解程式中 const { title, content } = req.body; 的寫法。 
// 題目： 假設有一個變數 req 內容如下：
// const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };
// 請用一行程式碼從 req.body 中取出 title 和 content 並宣告為同名常數。

const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };

// 解構賦值
const { title, content } = req.body;

console.log("title:", title);
console.log("content:", content);
