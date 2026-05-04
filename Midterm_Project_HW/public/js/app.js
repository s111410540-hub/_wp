document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});

function renderNavbar() {
  const navContainer = document.getElementById('nav-links');
  if (!navContainer) return;
  
  const user = window.api.getUser();
  
  if (user) {
    navContainer.innerHTML = `
      <span class="text-muted">歡迎, ${user.username}</span>
      <a href="/index.html" class="btn btn-outline">首頁</a>
      <button onclick="logout()" class="btn">登出</button>
    `;
  } else {
    navContainer.innerHTML = `
      <a href="/index.html" class="btn btn-outline">首頁</a>
      <a href="/login.html" class="btn btn-outline">登入</a>
      <a href="/register.html" class="btn">註冊</a>
    `;
  }
}

function logout() {
  window.api.clearToken();
  window.location.href = '/index.html';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

function escapeHtml(unsafe) {
    return (unsafe || '').toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
