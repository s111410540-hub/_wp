function sanitizeData(userObj) {
    let safeUser = {};
    
    safeUser.id = userObj.id;
    safeUser.name = userObj.name;
    
    // 檢查是否有授權標記
    if (userObj.isVerified) {
        safeUser.status = "Verified";
    } else {
        safeUser.status = "Pending";
    }

    // 將安全的物件轉回 JSON 字串
    return JSON.stringify(safeUser);
}

const rawUser = { id: 101, name: "Alice", password: "hash_value_xyz", isVerified: true };
console.log(sanitizeData(rawUser)); // 輸出: {"id":101,"name":"Alice","status":"Verified"}