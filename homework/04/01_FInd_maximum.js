function findMax(numbers) {
    if (numbers.length === 0) return null;

    //在js相等符號是三個，跟c語言不同。
    //numbers.length是JS自帶的語法，當建立一個array時，這個物件會獲得名為length的屬性

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

//JS的input /output