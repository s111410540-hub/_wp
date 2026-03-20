function parseUserProfile(jsonString) {
    // 將 JSON 字串解析為物件
    const profile = JSON.parse(jsonString);
    
    // 回傳格式化的歡迎訊息
    return `User: ${profile.username}, Role: ${profile.role}`;
}

const rawData = '{"username": "admin_sys", "role": "administrator", "active": true}';
console.log(parseUserProfile(rawData)); 
// 輸出: User: admin_sys, Role: administrator