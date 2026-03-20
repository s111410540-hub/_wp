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