
---

### 1. 尋找陣列中的最大值 (Find Maximum in Array)
* **題目敘述**：寫一個函式 (Function)，接收一個數字陣列 (Array)，並回傳陣列中的最大值。如果陣列為空，則回傳 `null`。
* **學習重點**：`function`, `array`, `for`, `if`, 邊界條件處理 (Edge Case Handling)。
* **範例測資**：
    | 輸入 (Input) | 輸出 (Output) |
    | :--- | :--- |
    | `[12, 45, 2, 78, 33]` | `78` |
    | `[]` | `null` |
* **答案與解析**：
    * **時間複雜度**：$O(N)$，需遍歷陣列一次。
    
```javascript
function findMax(numbers) {
   
    if (numbers.length === 0) return null;
    //在js相等符號是三個，跟c語言不同。
    //numbers.length是JS自帶的語法，當建立一個array時，這個物件會獲得名
    
    let max = numbers[0];
    
  
    for (let i = 1; i < numbers.length; i++) {
        
        if (numbers[i] > max) {
            max = numbers[i]; 
        }
    }
    
    return max;
}
```

### 2. 密碼驗證器 (Password Validator)
* **題目敘述**：實作一個密碼驗證器。密碼長度必須 $\ge 8$ 個字元 (Character)，且包含至少一個大寫英文字母 (Uppercase Letter) 與一個數字 (Number)。符合回傳 `true`，否則回傳 `false`。
* **學習重點**：`function`, `while`, `if`, 字串遍歷 (String Traversal)。
* **範例測資**：
    | 輸入 (Input) | 輸出 (Output) |
    | :--- | :--- |
    | `"SecurePass123"` | `true` |
    | `"securepass123"` | `false` |
* **答案與解析**：
    * **時間複雜度**：$O(N)$。
```javascript
function validatePassword(password) {
   
    if (password.length < 8) return false;

    let i = 0;
    let hasUpperCase = false; 
    let hasNumber = false;    

    
    while (i < password.length) {
        let char = password[i];
        
        
        if (char >= 'A' && char <= 'Z') hasUpperCase = true;
        if (char >= '0' && char <= '9') hasNumber = true;
        
        
        if (hasUpperCase && hasNumber) return true;
        
        i++; 
    }
    
    
    return false; 
}
```

### 3. 使用者設定檔解析 (User Profile Parser)
* **題目敘述**：將 JSON 格式字串解析 (Parse) 為物件 (Object)，抽取出 `username` 與 `role`，組合成指定歡迎字串回傳。
* **學習重點**：`function`, `JSON`, `object`, 字串串接。
* **範例測資**：
    | 輸入 JSON 字串 (Input) | 輸出字串 (Output) |
    | :--- | :--- |
    | `'{"username": "admin_sys", "role": "administrator"}'` | `"User: admin_sys, Role: administrator"` |
* **答案與解析**：
    * **時間複雜度**：$O(N)$ (取決於 JSON 字串長度)。
```javascript
function parseUserProfile(jsonString) {
    // 1. 將純文字的 JSON 字串轉換為可操作的 JavaScript 物件
    const profile = JSON.parse(jsonString);
    
    // 2. 使用模板字面值 (Template Literal, 反引號 `) 提取物件屬性並串接字串
    return `User: ${profile.username}, Role: ${profile.role}`;
}
```

### 4. 篩選異常連線 (Filter Suspicious Connections)
* **題目敘述**：給定一個連線紀錄物件陣列，篩選出 `failedAttempts` $\ge 5$ 的 IP，並組成新陣列回傳。
* **學習重點**：`function`, `array`, `object`, `for`, `if`, 陣列推入。
* **範例測資**：
    | 輸入 (Input) | 輸出 (Output) |
    | :--- | :--- |
    | `[{ip: "10.0.0.1", failedAttempts: 5}, {ip: "10.0.0.2", failedAttempts: 2}]` | `["10.0.0.1"]` |
* **答案與解析**：
    * **時間複雜度**：$O(N)$。
```javascript
function getSuspiciousIPs(connections) {
    let suspicious = []; // 1. 初始化一個空陣列，用來存放結果
    
    // 2. 遍歷所有的連線紀錄
    for (let i = 0; i < connections.length; i++) {
        let conn = connections[i]; // 3. 取出當前的連線物件
        
        // 4. 判斷失敗次數是否達標
        if (conn.failedAttempts >= 5) {
            // 5. 若達標，將該物件的 ip 屬性推入 (Push) 結果陣列中
            suspicious.push(conn.ip); 
        }
    }
    
    return suspicious; // 6. 回傳結果陣列
}
```

### 5. 雙指標陣列反轉 (Two-Pointer Array Reversal)
* **題目敘述**：不使用內建函式，使用 `while` 迴圈與雙指標 (Two Pointers) 在原地 (In-place) 反轉陣列並回傳。
* **學習重點**：`function`, `array`, `while`, 變數交換。
* **範例測資**：
    | 輸入 (Input) | 輸出 (Output) |
    | :--- | :--- |
    | `[1, 2, 3, 4, 5]` | `[5, 4, 3, 2, 1]` |
* **答案與解析**：
    * **時間複雜度**：$O(N)$。
    * **空間複雜度**：$O(1)$ (極度節省記憶體的寫法)。
```javascript
function reverseArray(arr) {
    let left = 0;                  // 1. 左指標 (Left Pointer)：從索引 0 開始
    let right = arr.length - 1;    // 2. 右指標 (Right Pointer)：從最後一個索引開始

    // 3. 當左指標還在右指標的左邊時，繼續執行
    while (left < right) {
        // 4. 宣告一個暫存變數 (temp)，準備進行資料交換 (Swap)
        let temp = arr[left];
        
        // 5. 將右邊的值覆蓋到左邊
        arr[left] = arr[right];
        
        // 6. 將暫存的左邊的值寫入右邊
        arr[right] = temp;
        
        // 7. 指標向中間靠攏
        left++;  
        right--; 
    }
    return arr; // 8. 回傳被原地修改後的陣列
}
```

### 6. 狀態碼頻率統計 (Status Code Frequency Counter)
* **題目敘述**：接收 HTTP 狀態碼陣列，計算各狀態碼出現的頻率 (Frequency)，以物件回傳 (鍵為狀態碼，值為次數)。
* **學習重點**：`function`, `array`, `object`, `for`, `if`, 雜湊映射 (Hash Map)。
* **範例測資**：
    | 輸入 (Input) | 輸出 (Output) |
    | :--- | :--- |
    | `[200, 404, 200, 500]` | `{'200': 2, '404': 1, '500': 1}` |
* **答案與解析**：
    * **時間複雜度**：$O(N)$。
```javascript
function countStatusCodes(codes) {
    let frequency = {}; // 1. 初始化空物件，作為雜湊映射表

    // 2. 遍歷每一個狀態碼
    for (let i = 0; i < codes.length; i++) {
        let code = codes[i];
        
        // 3. 檢查該狀態碼是否已經作為「鍵 (Key)」存在於物件中
        if (frequency[code]) {
            // 4. 若已存在，將該鍵對應的「值 (Value)」加 1
            frequency[code]++; 
        } else {
            // 5. 若不存在，建立該鍵，並將值初始化為 1
            frequency[code] = 1; 
        }
    }
    return frequency; // 6. 回傳統計完成的物件
}
```

### 7. JSON 資料清洗與序列化 (Data Cleaning & Stringify)
* **題目敘述**：保留物件的 `id` 與 `name`，捨棄 `password`，將 `isVerified` 布林值轉換為 `status` 字串 ("Verified" 或 "Pending")，最後序列化 (Serialize) 為 JSON 字串回傳。
* **學習重點**：`function`, `JSON`, `object`, `if`, 資料序列化。
* **範例測資**：
    | 輸入 (Input) | 輸出 (Output) |
    | :--- | :--- |
    | `{id: 1, name: "A", password: "123", isVerified: true}` | `'{"id":1,"name":"A","status":"Verified"}'` |
* **答案與解析**：
```javascript
function sanitizeData(userObj) {
    let safeUser = {}; // 1. 建立一個全新的安全物件
    
    // 2. 選擇性地複製無害的屬性
    safeUser.id = userObj.id;
    safeUser.name = userObj.name;
    
    // 3. 根據布林值進行邏輯轉換
    if (userObj.isVerified) {
        safeUser.status = "Verified";
    } else {
        safeUser.status = "Pending";
    }

    // 4. 將 JavaScript 物件轉換 (Stringify) 為 JSON 字串格式
    return JSON.stringify(safeUser);
}
```

### 8. 權限檢查機制 (Permission Check)
* **題目敘述**：檢查使用者物件的 `isActive` 是否為真，且 `roles` 陣列包含目標權限。符合回傳 `"Access Granted"`，否則回傳 `"Access Denied"`。
* **學習重點**：`function`, `object`, `array`, `if`, 權限驗證。
* **範例測資**：
    | 輸入 (Input) | 輸出 (Output) |
    | :--- | :--- |
    | `user={roles:["user","admin"], isActive:true}, role="admin"` | `"Access Granted"` |
    | `user={roles:["user"], isActive:true}, role="admin"` | `"Access Denied"` |
* **答案與解析**：
```javascript
function checkPermissions(user, requiredRole) {
    // 1. 防呆：若帳號處於停權/非活躍狀態，直接拒絕
    if (!user.isActive) return "Access Denied";

    let hasRole = false; // 2. 預設沒有該權限

    // 3. 遍歷使用者的權限陣列
    for (let i = 0; i < user.roles.length; i++) {
        // 4. 比對是否與要求的權限相符
        if (user.roles[i] === requiredRole) {
            hasRole = true; // 5. 標記為找到
            break;          // 6. 找到即可跳出迴圈，無須檢查後續元素
        }
    }

    // 7. 根據搜尋結果回傳對應的字串
    if (hasRole) {
        return "Access Granted";
    } else {
        return "Access Denied";
    }
}
```

### 9. 尋找特定的 JSON 紀錄 (Find Specific JSON Record)
* **題目敘述**：解析 JSON 陣列字串，找出 `id` 符合目標的主機物件，回傳其 `hostname`。找不到則回傳 `"Node not found"`。
* **學習重點**：`function`, `JSON`, `array`, `object`, `for`, `if`, 線性搜尋 (Linear Search)。
* **範例測資**：
    | 輸入 (Input) | 輸出 (Output) |
    | :--- | :--- |
    | `'[{"id": 1, "hostname": "web"}, {"id": 2, "hostname": "db"}]', 2` | `"db"` |
* **答案與解析**：
```javascript
function findTargetNode(jsonArrayString, targetId) {
    // 1. 將 JSON 陣列字串解析為 JavaScript 陣列
    const nodes = JSON.parse(jsonArrayString);

    // 2. 遍歷整個陣列進行線性搜尋 (Linear Search)
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        
        // 3. 檢查物件的 id 屬性是否等於目標 ID
        if (node.id === targetId) {
            return node.hostname; // 4. 找到目標，直接回傳主機名稱並結束函式
        }
    }
    
    // 5. 若迴圈執行完畢仍未 return，代表找不到
    return "Node not found"; 
}
```

### 10. 綜合演練：威脅情報摘要器 (Threat Intelligence Summarizer)
* **題目敘述**：解析資安事件 JSON 陣列。使用 `while` 跳過開頭 `type` 為 `"test"` 的事件。用 `for` 統計剩下事件的威脅等級 (`severity`)，回傳包含 `criticalCount`、`highCount` 與 `processedEvents` 的物件。
* **學習重點**：`function`, `JSON`, `array`, `object`, `for`, `while`, `if`, 資料前處理。
* **範例測資**：
    | 輸入 JSON (Input) | 輸出物件 (Output) |
    | :--- | :--- |
    | `'[{"type":"test"}, {"severity":"critical"}, {"severity":"high"}]'` | `{criticalCount: 1, highCount: 1, processedEvents: 2}` |
* **答案與解析**：
```javascript
function analyzeThreats(jsonPayload) {
    // 1. 解析資料
    const events = JSON.parse(jsonPayload); 
    
    // 2. 建立統計報告的骨架 (物件)
    let report = {
        criticalCount: 0,
        highCount: 0,
        processedEvents: 0
    };

    let startIndex = 0;
    
    // 3. 資料前處理：跳過無效的測試資料
    // 注意：需先確保 startIndex 未超出陣列長度，避免存取錯誤
    while (startIndex < events.length && events[startIndex].type === "test") {
        startIndex++; // 移動起始指標
    }

    // 4. 從第一個「有效」的事件開始遍歷
    for (let i = startIndex; i < events.length; i++) {
        let currentEvent = events[i];
        
        // 5. 分類統計
        if (currentEvent.severity === "critical") {
            report.criticalCount++;
        } else if (currentEvent.severity === "high") {
            report.highCount++;
        }
        
        // 6. 紀錄處理過的總件數
        report.processedEvents++;
    }

    // 7. 回傳最終報告
    return report;
}
```

---

