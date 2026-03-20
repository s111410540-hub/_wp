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