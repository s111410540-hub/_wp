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