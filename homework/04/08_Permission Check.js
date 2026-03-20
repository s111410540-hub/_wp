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