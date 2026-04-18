// 3. 陣列的遍歷與字串拼接 (Array forEach & Template Literals)
// 目標： 理解部落格首頁如何產生文章列表。 
// 題目： 給定一個陣列 const posts = [{id: 1, t: "A"}, {id: 2, t: "B"}]。
// 請宣告一個空字串 let html = ""，並使用 forEach 遍歷陣列，將每個物件轉為 <div>A</div> 的格式拼接到 html 中。

const posts = [{id: 1, t: "A"}, {id: 2, t: "B"}];
let html = "";

posts.forEach(post => {
  html += `<div>${post.t}</div>\n`;
});

console.log(html);
