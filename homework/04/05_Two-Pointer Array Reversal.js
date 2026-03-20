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