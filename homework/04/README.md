這 10 個 JavaScript 程式練習涵蓋了你所要求的 `if`、`for`、`while`、`function`、`JSON`、`Array` (陣列) 與 `Object` (物件)。

為了貼近系統與資料處理的實務情境，這些練習題融合了一些基礎的權限驗證與日誌分析 (Log Analysis) 概念。在學習過程中，你可以觀察不同資料結構與控制流程如何互相配合。

---

### 1. 尋找陣列中的最大值 (Find Maximum in Array)
**學習重點：** `function`, `array`, `for`, `if`
**說明：** 遍歷陣列尋找最大值，這是學習演算法 (Algorithm) 最基礎的步驟。

```javascript
function findMax(numbers) {
    if (numbers.length === 0) return null;
    
    let max = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i]; // 更新最大值
        }
    }
    return max;
}

const arr = [12, 45, 2, 78, 33];
console.log("Max value:", findMax(arr)); // 輸出: 78
```

### 2. 密碼驗證器 (Password Validator)
**學習重點：** `function`, `while`, `if`
**說明：** 使用 `while` 迴圈檢查密碼條件，直到找出不符合的規則或確認安全。

```javascript
function validatePassword(password) {
    let i = 0;
    let hasUpperCase = false;
    let hasNumber = false;

    if (password.length < 8) return false;

    while (i < password.length) {
        let char = password[i];
        if (char >= 'A' && char <= 'Z') {
            hasUpperCase = true;
        }
        if (char >= '0' && char <= '9') {
            hasNumber = true;
        }
        i++;
    }
    
    // 必須同時包含大寫字母與數字
    if (hasUpperCase && hasNumber) {
        return true;
    }
    return false;
}

console.log("Is valid?", validatePassword("SecurePass123")); // 輸出: true
```

### 3. 使用者設定檔解析 (User Profile Parser)
**學習重點：** `function`, `JSON`, `object`
**說明：** 模擬從伺服器接收 JSON 字串 (String) 並將其解析為 JavaScript 物件進行讀取。

```javascript
function parseUserProfile(jsonString) {
    // 將 JSON 字串解析為物件
    const profile = JSON.parse(jsonString);
    
    // 回傳格式化的歡迎訊息
    return `User: ${profile.username}, Role: ${profile.role}`;
}

const rawData = '{"username": "admin_sys", "role": "administrator", "active": true}';
console.log(parseUserProfile(rawData)); // 輸出: User: admin_sys, Role: administrator
```

### 4. 篩選異常連線 (Filter Suspicious Connections)
**學習重點：** `function`, `array`, `object`, `for`, `if`
**說明：** 給定一個包含多個連線物件的陣列，使用 `for` 迴圈與 `if` 判斷篩選出失敗次數過高的 IP。

```javascript
function getSuspiciousIPs(connections) {
    let suspicious = [];
    
    for (let i = 0; i < connections.length; i++) {
        let conn = connections[i];
        if (conn.failedAttempts >= 5) {
            suspicious.push(conn.ip);
        }
    }
    return suspicious;
}

const trafficLog = [
    { ip: "192.168.1.10", failedAttempts: 2 },
    { ip: "10.0.0.45", failedAttempts: 7 },
    { ip: "172.16.0.8", failedAttempts: 12 }
];
console.log("Suspicious IPs:", getSuspiciousIPs(trafficLog)); // 輸出: [ '10.0.0.45', '172.16.0.8' ]
```

### 5. 雙指標陣列反轉 (Two-Pointer Array Reversal)
**學習重點：** `function`, `array`, `while`
**說明：** 使用 `while` 迴圈與頭尾兩個指標 (Pointers) 在原地 (in-place) 交換陣列元素，是資料結構基礎技巧。

```javascript
function reverseArray(arr) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        // 交換元素 (Swap)
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        
        left++;
        right--;
    }
    return arr;
}

const dataStream = [1, 2, 3, 4, 5];
console.log("Reversed:", reverseArray(dataStream)); // 輸出: [ 5, 4, 3, 2, 1 ]
```

### 6. 狀態碼頻率統計 (Status Code Frequency Counter)
**學習重點：** `function`, `array`, `object`, `for`, `if`
**說明：** 計算陣列中各個元素出現的次數，並儲存在物件中 (Hash Map 概念)。

```javascript
function countStatusCodes(codes) {
    let frequency = {};

    for (let i = 0; i < codes.length; i++) {
        let code = codes[i];
        // 如果物件中已經有這個 key，次數 +1；否則初始化為 1
        if (frequency[code]) {
            frequency[code]++;
        } else {
            frequency[code] = 1;
        }
    }
    return frequency;
}

const logs = [200, 404, 200, 500, 404, 404, 200];
console.log("Frequency:", countStatusCodes(logs)); // 輸出: { '200': 3, '404': 3, '500': 1 }
```

### 7. JSON 資料清洗與序列化 (Data Cleaning & Stringify)
**學習重點：** `function`, `JSON`, `object`, `if`
**說明：** 清除物件中的敏感資料 (例如密碼)，然後再將其轉換回 JSON 字串。

```javascript
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
```

### 8. 權限檢查機制 (Permission Check)
**學習重點：** `function`, `object`, `array`, `if`
**說明：** 結合物件 (使用者) 與陣列 (需求權限)，檢查使用者是否具備執行特定操作的資格。

```javascript
function checkPermissions(user, requiredRole) {
    let hasRole = false;

    // 檢查使用者的 roles 陣列是否包含需要的權限
    for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i] === requiredRole) {
            hasRole = true;
            // 找到符合條件就跳出迴圈
            break; 
        }
    }

    if (hasRole && user.isActive) {
        return "Access Granted";
    } else {
        return "Access Denied";
    }
}

const sysAdmin = { name: "Bob", roles: ["user", "admin", "editor"], isActive: true };
console.log(checkPermissions(sysAdmin, "admin")); // 輸出: Access Granted
```

### 9. 尋找特定的 JSON 紀錄 (Find Specific JSON Record)
**學習重點：** `function`, `JSON`, `array`, `object`, `for`, `if`
**說明：** 解析包含多筆物件資料的 JSON 陣列字串，並根據特定條件尋找目標。

```javascript
function findTargetNode(jsonArrayString, targetId) {
    const nodes = JSON.parse(jsonArrayString);

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.id === targetId) {
            return node.hostname;
        }
    }
    return "Node not found";
}

const networkData = '[{"id": 1, "hostname": "web-01"}, {"id": 2, "hostname": "db-01"}]';
console.log("Found:", findTargetNode(networkData, 2)); // 輸出: db-01
```

### 10. 綜合演練：威脅情報摘要器 (Threat Intelligence Summarizer)
**學習重點：** 全部涵蓋 (`function`, `JSON`, `array`, `object`, `for`, `while`, `if`)
**說明：** 接收一段 JSON 字串，解析成陣列。使用 `while` 迴圈跳過空白或無效標籤，使用 `for` 迴圈統計威脅等級，並將結果封裝成一個新物件回傳。

```javascript
function analyzeThreats(jsonPayload) {
    // 1. JSON (字串轉陣列物件)
    const events = JSON.parse(jsonPayload); 
    
    // 2. Object (用來儲存最終統計結果)
    let report = {
        criticalCount: 0,
        highCount: 0,
        processedEvents: 0
    };

    // 3. while (處理前置條件，假設我們要跳過陣列開頭的特定測試用佔位符)
    let startIndex = 0;
    while (startIndex < events.length && events[startIndex].type === "test") {
        startIndex++;
    }

    // 4. for (從有效資料開始遍歷陣列)
    for (let i = startIndex; i < events.length; i++) {
        let currentEvent = events[i];
        
        // 5. if (條件判斷)
        if (currentEvent.severity === "critical") {
            report.criticalCount++;
        } else if (currentEvent.severity === "high") {
            report.highCount++;
        }
        
        report.processedEvents++;
    }

    return report;
}

// 模擬的 JSON 資料
const payload = `[
    {"type": "test", "severity": "low"},
    {"type": "malware", "severity": "critical"},
    {"type": "phishing", "severity": "high"},
    {"type": "intrusion", "severity": "critical"}
]`;

console.log("Report:", analyzeThreats(payload)); 
// 輸出: { criticalCount: 2, highCount: 1, processedEvents: 3 }
```

---

需要我為其中哪一個練習進行**逐行程式碼解析 (Line-by-line breakdown)**，或是探討這些迴圈在執行時的**時間複雜度 (Time Complexity)** 嗎？