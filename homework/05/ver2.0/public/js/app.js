const app = document.getElementById('app');

let currentUser = null;

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(await res.text());
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
        <div class="post-author">
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
        <div class="post-author">
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

async function renderHome() {
  app.innerHTML = `
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
          <div class="loading-spinner">載入中...</div>
        </div>
      </div>
    </div>
    
    <div class="feed-container">
      <div class="feed-header">
        <h2>最新文章</h2>
      </div>
      <div id="posts-feed">
        <div class="loading-spinner">載入中...</div>
      </div>
      <div class="load-more" id="load-more" style="display: none;">
        <button onclick="loadMorePosts()">載入更多</button>
      </div>
    </div>
  `;
  
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
  const btn = document.querySelector('#load-more button');
  btn.textContent = '載入中...';
  btn.disabled = true;
  
  try {
    const nextPage = window.postsData.page + 1;
    const data = await api(`/api/posts?page=${nextPage}&limit=5`);
    
    window.postsData = data;
    const feed = document.getElementById('posts-feed');
    data.posts.forEach(post => {
      feed.insertAdjacentHTML('beforeend', renderPostCard(post));
    });
    
    if (!data.hasMore) {
      document.getElementById('load-more').style.display = 'none';
    }
  } catch (err) {
    console.error(err);
  }
  
  btn.textContent = '載入更多';
  btn.disabled = false;
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
        <div class="loading-spinner">載入中...</div>
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
    <div class="loading-spinner">載入中...</div>
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
    <div class="loading-spinner">載入中...</div>
  `;
  
  try {
    const post = await api(`/api/posts/${id}`);
    
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
            <div class="article-author">
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
          ${post.content.split('\n').map(p => p.trim() ? `<p>${escapeHtml(p)}</p>` : '').join('')}
        </div>
        
        ${post.tags ? `
          <div class="article-tags">
            ${post.tags.split(',').map(tag => `<span class="tag">#${escapeHtml(tag.trim())}</span>`).join('')}
          </div>
        ` : ''}
        
        <div class="article-author-card">
          <img src="${escapeHtml(post.avatar_url) || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}" alt="${escapeHtml(post.display_name)}">
          <div class="info">
            <h3>${escapeHtml(post.display_name || post.username)}</h3>
            <p>${escapeHtml(post.bio) || '這位作者還沒有填寫個人簡介'}</p>
          </div>
        </div>
      </div>
    `;
    
    window.currentPost = post;
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

async function renderWrite(id = null) {
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
        body: JSON.stringify({ title, subtitle, content, tags })
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
      body: JSON.stringify({ user_id: 1 })
    });
    
    const btn = document.querySelector('.btn-like');
    const countEl = document.getElementById('like-count');
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
  switch (route.page) {
    case 'home':
      await renderHome();
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
  
  window.scrollTo(0, 0);
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

render(parseRoute());
