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