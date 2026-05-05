document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  renderHistory();
});

function renderLayout() {
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  const user = window.api.getUser();
  
  // Create Left Sidebar
  const leftSidebar = document.createElement('aside');
  leftSidebar.className = 'sidebar-left';
  
  let authHtml = user ? `
    <div class="text-muted" style="font-size:0.85rem; word-break:break-all; font-weight:bold; color:var(--primary); text-align:center;">${user.username}</div>
    <button onclick="logout()" class="btn btn-outline btn-small mt-2" style="width:100%">登出</button>
  ` : `
    <a href="/login.html" class="btn btn-outline btn-small" style="display:block; text-align:center; width:100%">登入</a>
    <a href="/register.html" class="btn btn-small" style="display:block; text-align:center; margin-top:0.5rem; width:100%">註冊</a>
  `;

  leftSidebar.innerHTML = `
    <div class="sidebar-top">
      <a href="/index.html" class="nav-brand">Glory 討論版</a>
    </div>
    <div class="sidebar-nav">
      <a class="nav-item" onclick="navigateTag('')">▤ 全部板塊</a>
      <a class="nav-item" onclick="navigateTag('公會榜')">♜ 公會榜</a>
      <a class="nav-item" onclick="navigateTag('天榜')">♚ 天榜(個人排名)</a>
      <a class="nav-item" onclick="navigateTag('材料交易區')">❖ 材料交易區</a>
      <a class="nav-item" onclick="navigateTag('周本boss')">☠ 周本情報區</a>
      <a class="nav-item" onclick="navigateTag('野圖boss')">♞ 野圖boss情報</a>
      <a class="nav-item" onclick="navigateTag('公會戰')">⚑ 公會戰情報</a>
      <a class="nav-item" onclick="navigateTag('主地圖情報')">⌂ 主地圖情報</a>
      <a class="nav-item" onclick="navigateTag('神之領域情報')">✧ 神之領域情報</a>
    </div>
    <div class="sidebar-history">
      <div class="history-title">最近瀏覽</div>
      <div id="history-list"></div>
    </div>
  `;
  
  // Create Right Sidebar
  const rightSidebar = document.createElement('aside');
  rightSidebar.className = 'sidebar-right';
  rightSidebar.innerHTML = `
    <div class="sidebar-top-right" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px dashed var(--border);">
      <h3 style="font-size:1rem; margin-bottom:0.5rem; text-align:center;">帳號功能</h3>
      ${authHtml}
    </div>
    <h3 style="font-size:1rem; margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:2px solid var(--border)">版本資訊</h3>
    <div class="version-info">
      <div class="version-item">
        <div style="font-weight:bold; color:var(--primary)">v2.1.0 破曉之戰</div>
        <div class="version-date">2026-05-01</div>
        <ul style="margin-top:0.5rem; padding-left:1rem; color:var(--text-muted)">
          <li>新增周本boss「災厄之龍」</li>
          <li>開放神之領域全新地圖</li>
        </ul>
      </div>
      <div class="version-item">
        <div style="font-weight:bold; color:var(--primary)">v2.0.5 熱修復</div>
        <div class="version-date">2026-04-15</div>
        <ul style="margin-top:0.5rem; padding-left:1rem; color:var(--text-muted)">
          <li>修復材料交易區顯示BUG</li>
          <li>平衡性調整：刺客技能削弱</li>
        </ul>
      </div>
      <div class="version-item">
        <div style="font-weight:bold; color:var(--primary)">v2.0.0 公會崛起</div>
        <div class="version-date">2026-03-20</div>
        <ul style="margin-top:0.5rem; padding-left:1rem; color:var(--text-muted)">
          <li>公會戰第一季正式開打</li>
          <li>新增野圖boss「沙蟲王」</li>
        </ul>
      </div>
    </div>
  `;

  appRoot.insertBefore(leftSidebar, appRoot.firstChild);
  appRoot.appendChild(rightSidebar);
}

function navigateTag(tag) {
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    if (typeof loadQuestionsByTag === 'function') {
      loadQuestionsByTag(tag);
    }
  } else {
    window.location.href = '/index.html?tag=' + encodeURIComponent(tag);
  }
}

// Check URL params for tag on load (for index.html)
window.addEventListener('load', () => {
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    if (tag && typeof loadQuestionsByTag === 'function') {
      loadQuestionsByTag(tag);
    }
  }
});

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

// History Management
function saveToHistory(id, title) {
  let history = JSON.parse(localStorage.getItem('glory_history') || '[]');
  // Remove if exists
  history = history.filter(item => item.id !== id);
  // Add to front
  history.unshift({ id, title });
  // Keep last 5
  if (history.length > 5) history = history.slice(0, 5);
  localStorage.setItem('glory_history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;
  
  const history = JSON.parse(localStorage.getItem('glory_history') || '[]');
  if (history.length === 0) {
    list.innerHTML = '<div class="text-muted" style="font-size:0.8rem">暫無瀏覽紀錄</div>';
    return;
  }
  
  list.innerHTML = history.map(item => `
    <a href="/question.html?id=${item.id}" class="history-item" title="${escapeHtml(item.title)}">
      • ${escapeHtml(item.title)}
    </a>
  `).join('');
}
