// 4. 字典與動態參數 (URL Params / Dictionary)
// 目標： 理解 req.params.id 的來源。 
// 題目： 建立一個名為 params 的物件（字典），模擬 URL 參數。
// 請動態新增一個鍵為 "id"，值為 99 的屬性，然後印出這個物件。

const params = {};

// 動態新增屬性
params["id"] = 99;

console.log(params);
console.log("id:", params.id);
