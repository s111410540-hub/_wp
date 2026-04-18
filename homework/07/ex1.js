// 1. 物件屬性存取 (Object Property Access)
// 目標： 理解 post.title 的運作。
// 題目： 宣告一個名為 post 的物件，包含 id: 1、title: "Hello World" 和 content: "Markdown content"。
// 請練習用兩種方式印出 title：點符號 (Dot notation) 與中括號 (Bracket notation)。

const post = { 
  id: 1, 
  title: "Hello World", 
  content: "Markdown content" 
};

// 點符號 (Dot notation)
console.log("Dot notation:", post.title);

// 中括號 (Bracket notation)
console.log("Bracket notation:", post["title"]);
