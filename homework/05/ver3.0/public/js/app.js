const app = document.getElementById('app');

let currentUser = null;
let isLoading = false;
let pullStartY = 0;
let pullCurrentY = 0;
let isPulling = false;

function initAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
  updateNav();
}

function saveUser(user) {
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
  updateNav();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateNav();
  navigate('/');
}

function updateNav() {
  const navActions = document.getElementById('nav-actions');
  const navProfile = document.getElementById('nav-profile');
  
  if (currentUser) {
    navActions.innerHTML = `
      <div class="user-menu" id="user-menu">
        <button class="user-menu-trigger" onclick="toggleUserMenu()">
          <img src="${escapeHtml(currentUser.avatar_url) || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}" alt="${escapeHtml(currentUser.display_name || currentUser.username)}">
        </button>
        <div class="user-dropdown" id="user-dropdown">
          <div class="user-dropdown-header">
            <img src="${escapeHtml(currentUser.avatar_url) || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}" alt="">
            <div>
              <div class="user-dropdown-name">${escapeHtml(currentUser.display_name || currentUser.username)}</div>
              <div class="user-dropdown-username">@${escapeHtml(currentUser.username)}</div>
            </div>
          </div>
          <div class="user-dropdown-divider"></div>
          <a href="/profile/${escapeHtml(currentUser.username)}" class="user-dropdown-item" data-link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            我的主頁
          </a>
          <a href="/write" class="user-dropdown-item" data-link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            寫文章
          </a>
          <div class="user-dropdown-divider"></div>
          <button class="user-dropdown-item logout" onclick="logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            登出
          </button>
        </div>
      </div>
    `;
    navProfile.href = `/profile/${currentUser.username}`;
  } else {
    navActions.innerHTML = `
      <a href="/login" class="btn-login" data-link>登入</a>
      <a href="/register" class="btn-register" data-link>註冊</a>
    `;
    navProfile.href = '/login';
  }
}

function toggleUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  dropdown.classList.toggle('active');
  
  document.addEventListener('click', function closeDropdown(e) {
    if (!e.target.closest('.user-menu')) {
      dropdown.classList.remove('active');
      document.removeEventListener('click', closeDropdown);
    }
  });
}

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
}

function parseRoute() {
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);
  
  if (parts.length === 0) return { page: 'home' };
  if (parts[0] === 'login') return { page: 'login' };
  if (parts[0] === 'register') return { page: 'register' };
  if (parts[0] === 'discover') return { page: 'discover' };
  if (parts[0] === 'profile' && parts[1]) return { page: 'profile', username: parts[1] };
  if (parts[0] === 'article' && parts[1]) return { page: 'article', id: parts[1] };
  if (parts[0] === 'write') return { page: 'write', id: parts[1] || null };
  return { page: 'home' };
}

async function navigate(url) {
  history.pushState(null, '', url);
  const route = parseRoute();
  await render(route);
}

function renderPostCard(post) {
  return `
    <div class="post-card" onclick="navigate('/article/${post.id}')">
      <div class="post-content">
        <div class="post-author" onclick="event.stopPropagation(); navigate('/profile/${escapeHtml(post.username)}')">
          <img src="${escapeHtml(post.avatar_url) || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}" alt="${escapeHtml(post.display_name || post.username)}">
          <span>${escapeHtml(post.display_name || post.username)}</span>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        ${post.subtitle ? `<p class="post-subtitle">${escapeHtml(post.subtitle)}</p>` : ''}
        <div class="post-meta">
          <span>${formatDate(post.created_at)}</span>
          <span>${post.read_time || 3} 分鐘閱讀</span>
          <span>♥ ${post.like_count || 0}</span>
        </div>
      </div>
      ${post.cover_image ? `
        <div class="post-cover">
          <img src="${escapeHtml(post.cover_image)}" alt="${escapeHtml(post.title)}">
        </div>
      ` : ''}
    </div>
  `;
}

function renderPostGridCard(post) {
  return `
    <div class="post-grid-card" onclick="navigate('/article/${post.id}')">
      ${post.cover_image ? `
        <div class="post-cover">
          <img src="${escapeHtml(post.cover_image)}" alt="${escapeHtml(post.title)}">
        </div>
      ` : ''}
      <div class="post-info">
        <div class="post-author" onclick="event.stopPropagation(); navigate('/profile/${escapeHtml(post.username)}')">
          <img src="${escapeHtml(post.avatar_url) || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}" alt="${escapeHtml(post.display_name || post.username)}">
          <span>${escapeHtml(post.display_name || post.username)}</span>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <div class="post-meta">
          <span>${formatDate(post.created_at)}</span>
          <span>${post.read_time || 3} 分鐘</span>
          <span>♥ ${post.like_count || 0}</span>
        </div>
      </div>
    </div>
  `;
}

function setupPullToRefresh() {
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0 && !isLoading) {
      pullStartY = e.touches[0].clientY;
      isPulling = true;
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isPulling) return;
    pullCurrentY = e.touches[0].clientY;
    const pullDistance = pullCurrentY - pullStartY;
    
    if (pullDistance > 0 && pullDistance < 100) {
      const indicator = document.querySelector('.pull-to-refresh');
      if (indicator) {
        indicator.style.transform = `translateY(${Math.min(pullDistance - 60, 0)}px)`;
        const arrow = indicator.querySelector('.pull-to-refresh-arrow');
        if (arrow) {
          if (pullDistance > 60) {
            arrow.style.transform = 'rotate(180deg)';
          } else {
            arrow.style.transform = 'rotate(0deg)';
          }
        }
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!isPulling) return;
    const pullDistance = pullCurrentY - pullStartY;
    
    if (pullDistance > 60) {
      const indicator = document.querySelector('.pull-to-refresh');
      if (indicator) {
        indicator.classList.add('active', 'loading');
        indicator.querySelector('.pull-to-refresh-arrow svg').innerHTML = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.4" stroke-dashoffset="0"/>';
      }
      
      if (window.postsData) {
        window.postsData.page = 1;
        refreshPosts();
      }
    } else {
      const indicator = document.querySelector('.pull-to-refresh');
      if (indicator) {
        indicator.style.transform = 'translateY(-100%)';
      }
    }
    
    isPulling = false;
    pullStartY = 0;
    pullCurrentY = 0;
  }, { passive: true });
}

function setupInfiniteScroll() {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollTop > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }

    if (isLoading || !window.postsData || !window.postsData.hasMore) return;
    
    const feedContainer = document.getElementById('posts-feed');
    if (!feedContainer) return;
    
    const rect = feedContainer.getBoundingClientRect();
    const isNearBottom = rect.bottom - window.innerHeight < 200;
    
    if (isNearBottom) {
      loadMorePosts();
    }
  }, { passive: true });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function refreshPosts() {
  try {
    const data = await api('/api/posts?page=1&limit=5');
    window.postsData = data;
    
    const indicator = document.querySelector('.pull-to-refresh');
    if (indicator) {
      indicator.classList.remove('active', 'loading');
      indicator.style.transform = 'translateY(-100%)';
    }
    
    renderPosts(data.posts);
    
    const loadMore = document.getElementById('load-more');
    if (loadMore) {
      loadMore.style.display = data.hasMore ? 'block' : 'none';
    }
  } catch (err) {
    console.error(err);
    const indicator = document.querySelector('.pull-to-refresh');
    if (indicator) {
      indicator.classList.remove('loading');
      indicator.innerHTML = '<span style="color: #d97706;">刷新失敗，下拉重試</span>';
    }
  }
}

async function renderHome() {
  const pullIndicator = `
    <div class="pull-to-refresh">
      <div class="pull-to-refresh-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </div>
    </div>
  `;
  
  app.innerHTML = `
    ${pullIndicator}
    <div class="home-hero">
      <h1>探索故事的海洋</h1>
      <p>在這裡，每一個文字都有力量，每一個故事都值得被看見</p>
    </div>
    
    <div class="featured-section">
      <div class="featured-container">
        <div class="featured-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h2>精選文章</h2>
        </div>
        <div class="featured-grid" id="featured-posts">
          <div class="loading-spinner">載入中</div>
        </div>
      </div>
    </div>
    
    <div class="feed-container">
      <div class="feed-header">
        <h2>最新文章</h2>
      </div>
      <div id="posts-feed">
        <div class="loading-spinner">載入中</div>
      </div>
      <div class="load-more" id="load-more" style="display: none;">
        <div class="loading-indicator">載入更多</div>
      </div>
    </div>
  `;
  
  setupPullToRefresh();
  setupInfiniteScroll();
  
  try {
    const [featured, posts] = await Promise.all([
      api('/api/posts/featured'),
      api('/api/posts?page=1&limit=5')
    ]);
    
    document.getElementById('featured-posts').innerHTML = featured.length 
      ? featured.map(renderPostGridCard).join('')
      : '<p style="color: var(--text-tertiary);">暫無精選文章</p>';
    
    window.postsData = posts;
    renderPosts(posts.posts);
    
    if (posts.hasMore) {
      document.getElementById('load-more').style.display = 'block';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('posts-feed').innerHTML = '<p>載入失敗，請稍後重試</p>';
  }
}

function renderPosts(posts) {
  document.getElementById('posts-feed').innerHTML = posts.map(renderPostCard).join('');
}

async function loadMorePosts() {
  if (isLoading || !window.postsData || !window.postsData.hasMore) return;
  
  isLoading = true;
  const loadMoreEl = document.getElementById('load-more');
  loadMoreEl.innerHTML = '<div class="loading-indicator">載入中</div>';
  
  try {
    const nextPage = window.postsData.page + 1;
    const data = await api(`/api/posts?page=${nextPage}&limit=5`);
    
    window.postsData = data;
    const feed = document.getElementById('posts-feed');
    data.posts.forEach(post => {
      feed.insertAdjacentHTML('beforeend', renderPostCard(post));
    });
    
    if (!data.hasMore) {
      loadMoreEl.innerHTML = '<div class="end-of-feed">已載入所有文章</div>';
    } else {
      loadMoreEl.innerHTML = '<div class="loading-indicator">載入更多</div>';
    }
  } catch (err) {
    console.error(err);
    loadMoreEl.innerHTML = '<button onclick="loadMorePosts()" style="background: var(--bg-secondary); border: 1px solid var(--border); padding: 12px 24px; border-radius: 20px; cursor: pointer;">點擊重試</button>';
  }
  
  isLoading = false;
}

async function renderLogin() {
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <h1>歡迎回來</h1>
          <p>登入您的帳戶開始寫作</p>
        </div>
        
        <form class="auth-form" id="login-form">
          <div class="form-group">
            <label for="username">用戶名</label>
            <input type="text" id="username" name="username" placeholder="輸入用戶名" required>
          </div>
          
          <div class="form-group">
            <label for="password">密碼</label>
            <input type="password" id="password" name="password" placeholder="輸入密碼" required>
          </div>
          
          <div class="form-error" id="login-error" style="display: none;"></div>
          
          <button type="submit" class="btn-auth">登入</button>
        </form>
        
        <div class="auth-footer">
          還沒有帳戶？<a href="/register" data-link>立即註冊</a>
        </div>
        
        <div class="auth-demo">
          <p>測試帳戶：用戶名 <strong>writer</strong> 密碼 <strong>writer123</strong></p>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.querySelector('.btn-auth');
    
    submitBtn.disabled = true;
    submitBtn.textContent = '登入中...';
    
    try {
      const result = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      saveUser(result.user);
      navigate('/');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = '登入';
    }
  });
}

async function renderRegister() {
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <h1>加入我們</h1>
          <p>創建帳戶開始您的創作之旅</p>
        </div>
        
        <form class="auth-form" id="register-form">
          <div class="form-group">
            <label for="username">用戶名</label>
            <input type="text" id="username" name="username" placeholder="3-20個字符" required minlength="3" maxlength="20">
          </div>
          
          <div class="form-group">
            <label for="display_name">顯示名稱</label>
            <input type="text" id="display_name" name="display_name" placeholder="您想在網站上顯示的名稱">
          </div>
          
          <div class="form-group">
            <label for="password">密碼</label>
            <input type="password" id="password" name="password" placeholder="至少6個字符" required minlength="6">
          </div>
          
          <div class="form-group">
            <label for="confirm_password">確認密碼</label>
            <input type="password" id="confirm_password" name="confirm_password" placeholder="再次輸入密碼" required>
          </div>
          
          <div class="form-error" id="register-error" style="display: none;"></div>
          
          <button type="submit" class="btn-auth">註冊</button>
        </form>
        
        <div class="auth-footer">
          已有帳戶？<a href="/login" data-link>立即登入</a>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const display_name = document.getElementById('display_name').value.trim();
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;
    const errorEl = document.getElementById('register-error');
    const submitBtn = document.querySelector('.btn-auth');
    
    if (password !== confirm_password) {
      errorEl.textContent = '兩次輸入的密碼不相同';
      errorEl.style.display = 'block';
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = '註冊中...';
    
    try {
      const result = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, display_name })
      });
      
      saveUser(result);
      navigate('/');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = '註冊';
    }
  });
}

async function renderDiscover() {
  app.innerHTML = `
    <div class="discover-hero">
      <h1>探索精彩內容</h1>
      <p>發現值得一讀的好文章</p>
    </div>
    
    <div class="discover-section">
      <h2 class="section-title">推薦閱讀</h2>
      <div class="posts-grid" id="recommended-posts">
        <div class="loading-spinner">載入中</div>
      </div>
    </div>
  `;
  
  try {
    const posts = await api('/api/posts/recommended');
    document.getElementById('recommended-posts').innerHTML = posts.length
      ? posts.map(renderPostGridCard).join('')
      : '<p style="color: var(--text-tertiary);">暫無推薦文章</p>';
  } catch (err) {
    console.error(err);
    document.getElementById('recommended-posts').innerHTML = '<p>載入失敗，請稍後重試</p>';
  }
}

async function renderProfile(username) {
  app.innerHTML = `
    <div class="loading-spinner">載入中</div>
  `;
  
  try {
    const data = await api(`/api/posts/user/${username}`);
    
    app.innerHTML = `
      <div class="profile-header">
        <div class="profile-container">
          <div class="profile-avatar">
            <img src="${escapeHtml(data.user.avatar_url) || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}" alt="${escapeHtml(data.user.display_name)}">
          </div>
          <div class="profile-info">
            <h1>${escapeHtml(data.user.display_name || data.user.username)}</h1>
            <p class="bio">${escapeHtml(data.user.bio) || '這位作者還沒有填寫個人簡介'}</p>
            <div class="profile-stats">
              <div class="stat">
                <div class="stat-value">${data.stats.posts}</div>
                <div class="stat-label">文章</div>
              </div>
              <div class="stat">
                <div class="stat-value">${data.stats.totalLikes}</div>
                <div class="stat-label">收藏</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="profile-content">
        <div class="profile-tabs">
          <div class="profile-tab active">文章列表</div>
        </div>
        <div class="feed-container" style="max-width: 800px; padding: 0;">
          ${data.posts.length 
            ? data.posts.map(renderPostCard).join('')
            : '<p style="color: var(--text-tertiary); text-align: center; padding: 48px;">這位作者還沒有發布文章</p>'
          }
        </div>
      </div>
    `;
  } catch (err) {
    app.innerHTML = `
      <div style="text-align: center; padding: 100px;">
        <h2>找不到這個作者</h2>
        <p style="color: var(--text-secondary); margin-top: 16px;">
          <a href="/" data-link style="color: var(--accent);">返回首頁</a>
        </p>
      </div>
    `;
  }
}

async function renderArticle(id) {
  app.innerHTML = `
    <div class="loading-spinner">載入中</div>
  `;
  
  try {
    const post = await api(`/api/posts/${id}`);
    
    const contentHtml = post.content.split('\n').map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('# ')) return `<h2>${escapeHtml(p.substring(2))}</h2>`;
      if (p.startsWith('## ')) return `<h3>${escapeHtml(p.substring(3))}</h3>`;
      if (p.startsWith('> ')) return `<blockquote>${escapeHtml(p.substring(2))}</blockquote>`;
      if (p.match(/^\d+\.\s/)) return `<li>${escapeHtml(p.replace(/^\d+\.\s/, ''))}</li>`;
      if (p.startsWith('- ')) return `<li>${escapeHtml(p.substring(2))}</li>`;
      return `<p>${escapeHtml(p)}</p>`;
    }).join('');
    
    app.innerHTML = `
      <div class="article-detail">
        <a href="/" class="back-link" data-link>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回
        </a>
        
        <header class="article-header">
          <h1 class="article-title">${escapeHtml(post.title)}</h1>
          ${post.subtitle ? `<p class="article-subtitle">${escapeHtml(post.subtitle)}</p>` : ''}
          
          <div class="article-meta">
            <div class="article-author" onclick="navigate('/profile/${escapeHtml(post.username)}')" style="cursor: pointer;">
              <img src="${escapeHtml(post.avatar_url) || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}" alt="${escapeHtml(post.display_name)}">
              <div class="article-author-info">
                <div class="name">${escapeHtml(post.display_name || post.username)}</div>
                <div class="date">${formatDate(post.created_at)} · ${post.read_time || 3} 分鐘閱讀</div>
              </div>
            </div>
            <div class="article-actions">
              <button class="btn-like ${post.is_liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${post.is_liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span id="like-count">${post.like_count || 0}</span>
              </button>
              <button class="btn-share" onclick="shareArticle(${post.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                </svg>
                分享
              </button>
            </div>
          </div>
        </header>
        
        ${post.cover_image ? `
          <img class="article-cover" src="${escapeHtml(post.cover_image)}" alt="${escapeHtml(post.title)}">
        ` : ''}
        
        <div class="article-content">
          ${contentHtml}
        </div>
        
        ${post.tags ? `
          <div class="article-tags">
            ${post.tags.split(',').map(tag => `<span class="tag">#${escapeHtml(tag.trim())}</span>`).join('')}
          </div>
        ` : ''}
        
        <div class="article-author-card" onclick="navigate('/profile/${escapeHtml(post.username)}')" style="cursor: pointer;">
          <img src="${escapeHtml(post.avatar_url) || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}" alt="${escapeHtml(post.display_name)}">
          <div class="info">
            <h3>${escapeHtml(post.display_name || post.username)}</h3>
            <p>${escapeHtml(post.bio) || '這位作者還沒有填寫個人簡介'}</p>
          </div>
        </div>
      </div>
      
      <div class="article-floating-actions" id="floating-actions">
        <button class="btn-like ${post.is_liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${post.is_liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>${post.like_count || 0}</span>
        </button>
        <button class="btn-share" onclick="shareArticle(${post.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
          </svg>
        </button>
      </div>
    `;
    
    window.currentPost = post;
    setupArticleScrollHandler();
  } catch (err) {
    app.innerHTML = `
      <div style="text-align: center; padding: 100px;">
        <h2>找不到這篇文章</h2>
        <p style="color: var(--text-secondary); margin-top: 16px;">
          <a href="/" data-link style="color: var(--accent);">返回首頁</a>
        </p>
      </div>
    `;
  }
}

function setupArticleScrollHandler() {
  const floatingActions = document.getElementById('floating-actions');
  
  window.addEventListener('scroll', () => {
    const articleHeader = document.querySelector('.article-header');
    if (!articleHeader) return;
    
    const rect = articleHeader.getBoundingClientRect();
    if (rect.bottom < 0) {
      floatingActions.classList.add('visible');
    } else {
      floatingActions.classList.remove('visible');
    }
  }, { passive: true });
}

async function renderWrite(id = null) {
  if (!currentUser) {
    navigate('/login');
    return;
  }
  
  let post = { title: '', subtitle: '', content: '', tags: '' };
  
  if (id) {
    try {
      post = await api(`/api/posts/${id}`);
    } catch (err) {
      console.error(err);
    }
  }
  
  app.innerHTML = `
    <div class="write-container">
      <div class="write-header">
        <h1>${id ? '編輯文章' : '撰寫新文章'}</h1>
        <div class="write-actions">
          <button class="btn-save" onclick="saveDraft()">儲存草稿</button>
          <button class="btn-publish" onclick="publishArticle()">發布</button>
        </div>
      </div>
      
      <div class="write-form">
        <div class="form-group">
          <input type="text" class="title-input" id="title" placeholder="標題" value="${escapeHtml(post.title)}">
        </div>
        <div class="form-group">
          <input type="text" class="subtitle-input" id="subtitle" placeholder="副標題（選填）" value="${escapeHtml(post.subtitle || '')}">
        </div>
        <div class="form-group">
          <textarea class="content-input" id="content" placeholder="在此開始撰寫你的故事...">${escapeHtml(post.content)}</textarea>
        </div>
        <div class="form-group tags-input">
          <input type="text" id="tags" placeholder="標籤（用逗號分隔）" value="${escapeHtml(post.tags || '')}">
        </div>
      </div>
    </div>
  `;
  
  window.editingPostId = id;
}

async function publishArticle() {
  if (!currentUser) {
    navigate('/login');
    return;
  }
  
  const title = document.getElementById('title').value.trim();
  const subtitle = document.getElementById('subtitle').value.trim();
  const content = document.getElementById('content').value.trim();
  const tags = document.getElementById('tags').value.trim();
  
  if (!title || !content) {
    alert('請填寫標題和內容');
    return;
  }
  
  try {
    let post;
    if (window.editingPostId) {
      post = await api(`/api/posts/${window.editingPostId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, subtitle, content, tags })
      });
    } else {
      post = await api('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, subtitle, content, tags, user_id: currentUser.id })
      });
    }
    
    navigate(`/article/${post.id}`);
  } catch (err) {
    alert('發布失敗，請稍後重試');
    console.error(err);
  }
}

function saveDraft() {
  const title = document.getElementById('title').value;
  const subtitle = document.getElementById('subtitle').value;
  const content = document.getElementById('content').value;
  const tags = document.getElementById('tags').value;
  
  localStorage.setItem('draft', JSON.stringify({ title, subtitle, content, tags }));
  alert('草稿已儲存');
}

async function toggleLike(postId) {
  try {
    const result = await api(`/api/likes/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ user_id: currentUser?.id || 1 })
    });
    
    const buttons = document.querySelectorAll('.btn-like');
    buttons.forEach(btn => {
      const countEl = btn.querySelector('span');
      if (!countEl) return;
      let count = parseInt(countEl.textContent) || 0;
      
      if (result.liked) {
        btn.classList.add('liked');
        btn.querySelector('svg').setAttribute('fill', 'currentColor');
        count++;
      } else {
        btn.classList.remove('liked');
        btn.querySelector('svg').setAttribute('fill', 'none');
        count--;
      }
      
      countEl.textContent = count;
    });
  } catch (err) {
    console.error(err);
  }
}

function shareArticle(id) {
  const url = `${window.location.origin}/article/${id}`;
  
  if (navigator.share) {
    navigator.share({
      title: window.currentPost?.title,
      url: url
    });
  } else {
    navigator.clipboard.writeText(url);
    alert('連結已複製到剪貼簿');
  }
}

async function render(route) {
  const floatingActions = document.getElementById('floating-actions');
  if (floatingActions) {
    floatingActions.classList.remove('visible');
  }
  
  switch (route.page) {
    case 'home':
      await renderHome();
      break;
    case 'login':
      await renderLogin();
      break;
    case 'register':
      await renderRegister();
      break;
    case 'discover':
      await renderDiscover();
      break;
    case 'profile':
      await renderProfile(route.username);
      break;
    case 'article':
      await renderArticle(route.id);
      break;
    case 'write':
      await renderWrite(route.id);
      break;
    default:
      navigate('/');
  }
  
  document.querySelectorAll('a[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.href);
    });
  });
  
  if (route.page !== 'article') {
    window.scrollTo(0, 0);
  }
  
  updateNav();
}

window.addEventListener('popstate', () => render(parseRoute()));

document.addEventListener('click', (e) => {
  if (e.target.matches('a[data-link]')) {
    e.preventDefault();
    navigate(e.target.href);
  }
});

window.navigate = navigate;
window.loadMorePosts = loadMorePosts;
window.scrollToTop = scrollToTop;
window.toggleLike = toggleLike;
window.shareArticle = shareArticle;
window.saveDraft = saveDraft;
window.publishArticle = publishArticle;
window.toggleUserMenu = toggleUserMenu;
window.logout = logout;

initAuth();
render(parseRoute());
