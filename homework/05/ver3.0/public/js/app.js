const app = document.getElementById('app');

let currentUser = null;
let isLoading = false;
let pullStartY = 0;
let pullCurrentY = 0;
let isPulling = false;

const db = {
  users: [
    { id: 1, username: 'writer', password: 'writer123', display_name: '寫作者', bio: '熱愛分享知識與想法的創作者', avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Writer&backgroundColor=0a0a0a', created_at: '2024-01-01' }
  ],
  posts: [
    { id: 1, user_id: 1, title: '探索前端開發的無限可能', subtitle: '從基礎到進階的旅程', content: '前端開發是一個充滿挑戰與創意的領域。在這篇文章中，我們將探討如何從基礎開始，逐步掌握現代前端開發的核心技術。\n\n首先，HTML 是網頁的骨架。了解正確的語義化標籤使用方式，能讓你的頁面更具可訪問性和SEO友好。\n\n其次，CSS 是網頁的皮膚。Flexbox 和 Grid 布局系統讓響應式設計變得更加直觀和強大。\n\n最後，JavaScript 是網頁的心臟。掌握 ES6+ 的新特性，理解非同步編程，是成為優秀前端工程師的必經之路。', tags: '前端,開發,JavaScript', is_featured: 1, read_time: 5, cover_image: '', created_at: '2024-01-15', like_count: 0 },
    { id: 2, user_id: 1, title: '設計思維：創造更好的用戶體驗', subtitle: '以人為本的設計方法論', content: '設計思維是一種以人為本的創新方法，強調深入理解用戶需求，通過迭代過程找到最佳解決方案。\n\n這個過程包含五個階段：同理心、定義、創意、原型和測試。每一個階段都至關重要，缺一不可。\n\n在同理心階段，我們需要觀察用戶、與他們交談，了解他們真正關心的問題，而不是我們認為他們需要的。\n\n定義階段是將觀察結果提煉成有價值的洞察，形成清晰的問題陳述。\n\n創意階段需要頭腦風暴，產生大量想法，不要急於批判。\n\n原型階段將想法快速轉化為可觸摸的形式。\n\n測試階段則是讓真實用戶驗證原型的有效性。', tags: '設計,用戶體驗,方法論', is_featured: 1, read_time: 4, cover_image: '', created_at: '2024-01-10', like_count: 0 },
    { id: 3, user_id: 1, title: 'Node.js 性能優化實踐', subtitle: '讓你的服務器跑得更快', content: 'Node.js 以其非阻塞 I/O 模型聞名，但在生產環境中仍需要持續優化。以下是一些實用的優化技巧。\n\n1. 使用進程管理器如 PM2，可以實現自動重啟和負載均衡。\n\n2. 開啟 Redis 緩存，大幅減少數據庫查詢次數。\n\n3. 合理使用連接池，避免頻繁建立和關閉連接。\n\n4. 壓縮響應內容，使用 Gzip 或 Brotli。\n\n5. 使用 HTTP/2 提升資源載入效率。\n\n記住，性能優化是一個持續的過程，需要持續監控和調整。', tags: 'Node.js,性能,後端', is_featured: 0, read_time: 6, cover_image: '', created_at: '2024-01-08', like_count: 0 },
    { id: 4, user_id: 1, title: 'React Hooks 完全指南', subtitle: '掌握現代 React 開發的核心', content: 'React Hooks 徹底改變了我們撰寫 React 組件的方式。讓我們深入了解最常用的 Hooks。\n\nuseState 是最基礎的 Hook，用於在函數組件中添加狀態。\n\nuseEffect 讓我們可以在函數組件中執行副作用操作，如數據獲取、訂閱、手動 DOM 操作等。\n\nuseContext 解決了 prop drilling 的問題，讓我們可以跨層級傳遞數據。\n\nuseReducer 是 useState 的替代方案，適合管理複雜的狀態邏輯。\n\nuseMemo 和 useCallback 用於優化性能，避免不必要的重新渲染。\n\n掌握這些 Hooks，你就能應對大多數 React 開發場景。', tags: 'React,Hooks,前端', is_featured: 1, read_time: 7, cover_image: '', created_at: '2024-01-05', like_count: 0 },
    { id: 5, user_id: 1, title: '職場成長的七個關鍵習慣', subtitle: '從菜鳥到專業人士的蛻變', content: '在職場中，技術能力只是基礎。以下這些習慣能幫助你快速成長。\n\n主動學習：不要等待指示，主動尋找學習機會和挑戰。\n\n善於提問：好的問題比好的答案更有價值。學會問對問題。\n\n建立人脈：與同事、前輩建立良好關係，擴展你的職業網絡。\n\n時間管理：學會區分重要和緊急的事情，優先處理真正重要的事。\n\n接受反饋：把批評當作成長的機會，而不是攻擊。\n\n持續反思：每天花時間回顧自己的工作，思考如何做得更好。\n\n保持熱情：對工作保持熱情是長期成功的關鍵。', tags: '職場,成長,習慣', is_featured: 0, read_time: 5, cover_image: '', created_at: '2024-01-03', like_count: 0 },
    { id: 6, user_id: 1, title: '深入理解 TypeScript 泛型', subtitle: '讓你的代碼更靈活、更類型安全', content: 'TypeScript 的泛型是提高代碼复用性和類型安全性的強大工具。\n\n泛型允許你創建可重用的組件，同時保持完整的類型檢查。\n\n基礎泛型：使用 <T> 來表示一個類型參數。\n\n多個泛型參數：可以同時使用多個泛型參數，如 <T, K>。\n\n約束條件：使用 extends 關鍵字限制泛型的類型範圍。\n\n默認類型參數：為泛型參數指定默認值，增加靈活性。\n\n泛型接口和類：創建泛型的數據結構和類。\n\n實用工具類型：TypeScript 內置了許多實用的泛型工具類型，如 Partial、Required、Pick、Omit 等。', tags: 'TypeScript,JavaScript,前端', is_featured: 0, read_time: 8, cover_image: '', created_at: '2024-01-01', like_count: 0 },
    { id: 7, user_id: 1, title: '數據可視化：用圖表說故事', subtitle: '從數據到洞察的轉換藝術', content: '數據可視化是將複雜數據轉化為直觀理解的橋樑。好的可視化能讓數據說話。\n\n選擇正確的圖表類型是關鍵：\n\n- 比較數據使用柱狀圖或條形圖\n- 趨勢變化使用折線圖\n- 比例關係使用餅圖或環形圖\n- 分布情況使用直方圖或散點圖\n\n顏色的選擇也很重要：\n\n使用對比鮮明的顏色區分不同數據類別\n考慮色盲友好配色\n保持配色簡潔統一\n\n最後，記住可視化的目的：幫助觀眾快速理解數據，做出正確的決策。', tags: '數據,可視化,圖表', is_featured: 0, read_time: 6, cover_image: '', created_at: '2023-12-28', like_count: 0 },
    { id: 8, user_id: 1, title: '雲端運算的未來趨勢', subtitle: '無服務器架構與邊緣運算', content: '雲端運算正在經歷革命性的變化。以下趨勢將塑造未來的技術格局。\n\n無服務器架構（Serverless）讓開發者專注於業務邏輯，無需管理服務器。AWS Lambda、Azure Functions、Google Cloud Functions 是這個領域的代表。\n\n邊緣運算將計算推向網絡邊緣，減少延遲，提高響應速度。這對於物聯網和即時應用尤其重要。\n\n容器化和微服務已成為標準實踐。Kubernetes 提供了強大的容器編排能力。\n\nAI 和機器學習服務正變得越來越容易使用，讓每個開發者都能構建智能應用。', tags: '雲端,Serverless,邊緣運算', is_featured: 1, read_time: 6, cover_image: '', created_at: '2023-12-25', like_count: 0 },
    { id: 9, user_id: 1, title: '寫作的藝術：如何表達你的想法', subtitle: '從思維到文字的轉化', content: '寫作不僅是表達工具，更是深度思考的方式。好的寫作能讓你的想法產生更大的影響力。\n\n明確目標讀者：了解你為誰而寫，他們的背景和需求是什麼。\n\n結構清晰：用簡單的框架組織你的想法，如總分總結構。\n\n語言簡潔：避免冗長的句子和複雜的詞彙。短句更有力量。\n\n舉例說明：抽象的概念需要具體的例子來支撐。\n\n反覆修改：好文章是修改出來的。第一稿往往是粗糙的。\n\n最重要的是：開始寫。完美主義是最大的敵人。', tags: '寫作,表達,溝通', is_featured: 0, read_time: 5, cover_image: '', created_at: '2023-12-20', like_count: 0 },
    { id: 10, user_id: 1, title: '運動與大腦健康的秘密', subtitle: '為什麼你需要動起來', content: '運動不僅能強健身體，更能優化大腦功能。科學研究證明，定期運動能帶來諸多好處。\n\n改善記憶力：運動促進海馬體神經元生長，增強記憶力。\n\n提升情緒：運動釋放內啡肽，有效緩解壓力和焦慮。\n\n提高專注力：運動後的大腦更專注，學習效率更高。\n\n延緩衰老：運動能保護大腦免受認知衰退的影響。\n\n建議每週至少進行150分鐘的中等強度運動，如快走、游泳或騎自行車。\n\n從今天開始，讓運動成為你生活的一部分。', tags: '健康,運動,大腦', is_featured: 0, read_time: 4, cover_image: '', created_at: '2023-12-15', like_count: 0 }
  ],
  likes: []
};

function getUser(id) {
  return db.users.find(u => u.id === id);
}

function getUserByUsername(username) {
  return db.users.find(u => u.username === username);
}

function getPost(id) {
  return db.posts.find(p => p.id === parseInt(id));
}

function getPosts(options = {}) {
  let posts = [...db.posts];
  if (options.featured) {
    posts = posts.filter(p => p.is_featured === 1);
  }
  if (options.userId) {
    posts = posts.filter(p => p.user_id === options.userId);
  }
  if (options.sortByLikes) {
    posts.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
  } else {
    posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  return posts;
}

function addPost(post) {
  const newId = Math.max(...db.posts.map(p => p.id), 0) + 1;
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const newPost = {
    id: newId,
    user_id: post.user_id,
    title: post.title,
    subtitle: post.subtitle || '',
    content: post.content,
    cover_image: post.cover_image || '',
    tags: post.tags || '',
    is_featured: 0,
    read_time: readTime,
    created_at: new Date().toISOString(),
    like_count: 0
  };
  db.posts.unshift(newPost);
  saveData();
  return newPost;
}

function updatePost(id, data) {
  const post = getPost(id);
  if (!post) return null;
  if (data.title !== undefined) post.title = data.title;
  if (data.subtitle !== undefined) post.subtitle = data.subtitle;
  if (data.content !== undefined) {
    post.content = data.content;
    const wordCount = data.content.split(/\s+/).length;
    post.read_time = Math.max(1, Math.ceil(wordCount / 200));
  }
  if (data.tags !== undefined) post.tags = data.tags;
  if (data.cover_image !== undefined) post.cover_image = data.cover_image;
  saveData();
  return post;
}

function deletePost(id) {
  const index = db.posts.findIndex(p => p.id === parseInt(id));
  if (index > -1) {
    db.posts.splice(index, 1);
    db.likes = db.likes.filter(l => l.post_id !== parseInt(id));
    saveData();
    return true;
  }
  return false;
}

function toggleLike(userId, postId) {
  const existing = db.likes.find(l => l.user_id === userId && l.post_id === postId);
  const post = getPost(postId);
  if (!post) return { liked: false };
  
  if (existing) {
    db.likes = db.likes.filter(l => !(l.user_id === userId && l.post_id === postId));
    post.like_count = Math.max(0, (post.like_count || 0) - 1);
    saveData();
    return { liked: false };
  } else {
    db.likes.push({ user_id: userId, post_id: postId, created_at: new Date().toISOString() });
    post.like_count = (post.like_count || 0) + 1;
    saveData();
    return { liked: true };
  }
}

function registerUser(username, password, display_name) {
  if (db.users.find(u => u.username === username)) {
    throw new Error('用户名已被使用');
  }
  const avatar_url = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=0a0a0a`;
  const newUser = {
    id: db.users.length + 1,
    username,
    password,
    display_name: display_name || username,
    bio: '',
    avatar_url,
    created_at: new Date().toISOString()
  };
  db.users.push(newUser);
  saveData();
  return { id: newUser.id, username: newUser.username, display_name: newUser.display_name, avatar_url: newUser.avatar_url };
}

function loginUser(username, password) {
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) {
    throw new Error('用户名或密码错误');
  }
  return { id: user.id, username: user.username, display_name: user.display_name, avatar_url: user.avatar_url, bio: user.bio };
}

function saveData() {
  localStorage.setItem('blog_db', JSON.stringify({ users: db.users, posts: db.posts, likes: db.likes }));
}

function loadData() {
  const saved = localStorage.getItem('blog_db');
  if (saved) {
    const data = JSON.parse(saved);
    if (data.posts && data.posts.length > 0) {
      data.posts.forEach(p => {
        if (!db.posts.find(dp => dp.id === p.id)) db.posts.push(p);
      });
    }
    if (data.users && data.users.length > 0) {
      data.users.forEach(u => {
        if (!db.users.find(du => du.id === u.id)) db.users.push(u);
      });
    }
    if (data.likes) db.likes = data.likes;
  }
}

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
  const [path, query] = url.split('?');
  const params = {};
  if (query) {
    query.split('&').forEach(p => {
      const [k, v] = p.split('=');
      params[k] = v;
    });
  }

  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  if (path === '/api/posts') {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const offset = (page - 1) * limit;
    const posts = getPosts().map(p => ({
      ...p,
      ...getUser(p.user_id)
    }));
    return {
      posts: posts.slice(offset, offset + limit),
      total: posts.length,
      page,
      limit,
      hasMore: offset + limit < posts.length
    };
  }

  if (path === '/api/posts/featured') {
    return getPosts({ featured: true }).map(p => ({ ...p, ...getUser(p.user_id) }));
  }

  if (path === '/api/posts/recommended') {
    return getPosts({ sortByLikes: true }).map(p => ({ ...p, ...getUser(p.user_id) }));
  }

  if (path === '/api/posts/user/:username') {
    const username = path.split('/').pop();
    const user = getUserByUsername(username);
    if (!user) throw new Error('User not found');
    const posts = getPosts({ userId: user.id }).map(p => ({ ...p, ...user }));
    const stats = {
      posts: posts.length,
      totalLikes: posts.reduce((sum, p) => sum + (p.like_count || 0), 0)
    };
    return { user, posts, stats };
  }

  const postMatch = path.match(/^\/api\/posts\/(\d+)$/);
  if (postMatch) {
    const post = getPost(postMatch[1]);
    if (!post) throw new Error('Post not found');
    const user = getUser(post.user_id);
    return { ...post, ...user };
  }

  if (method === 'POST' && path === '/api/posts') {
    if (!body.title || !body.content) throw new Error('Title and content are required');
    const newPost = addPost({ ...body, user_id: body.user_id || 1 });
    return newPost;
  }

  if (method === 'PUT' && path.startsWith('/api/posts/')) {
    const id = parseInt(path.split('/').pop());
    const post = updatePost(id, body);
    if (!post) throw new Error('Post not found');
    return post;
  }

  if (method === 'DELETE' && path.startsWith('/api/posts/')) {
    const id = path.split('/').pop();
    deletePost(id);
    return { message: 'Post deleted' };
  }

  const likeMatch = path.match(/^\/api\/likes\/(\d+)$/);
  if (method === 'POST' && likeMatch) {
    const userId = body.user_id || 1;
    return toggleLike(userId, parseInt(likeMatch[1]));
  }

  if (path === '/api/users') {
    return db.users.map(u => ({ id: u.id, username: u.username, display_name: u.display_name, avatar_url: u.avatar_url, created_at: u.created_at }));
  }

  const userMatch = path.match(/^\/api\/users\/(.+)$/);
  if (userMatch) {
    const user = getUserByUsername(userMatch[1]);
    if (!user) throw new Error('User not found');
    return user;
  }

  if (method === 'POST' && path === '/api/auth/register') {
    return registerUser(body.username, body.password, body.display_name);
  }

  if (method === 'POST' && path === '/api/auth/login') {
    return loginUser(body.username, body.password);
  }

  throw new Error('Unknown API endpoint');
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
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  
  if (hash === '/' || hash === '') return { page: 'home' };
  if (parts[0] === 'login') return { page: 'login' };
  if (parts[0] === 'register') return { page: 'register' };
  if (parts[0] === 'discover') return { page: 'discover' };
  if (parts[0] === 'profile' && parts[1]) return { page: 'profile', username: parts[1] };
  if (parts[0] === 'article' && parts[1]) return { page: 'article', id: parts[1] };
  if (parts[0] === 'write') return { page: 'write', id: parts[1] || null };
  return { page: 'home' };
}

async function navigate(url) {
  window.location.hash = url;
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

window.addEventListener('hashchange', () => render(parseRoute()));

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-link]');
  if (link) {
    e.preventDefault();
    const href = link.getAttribute('href');
    navigate(href);
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
loadData();
if (!window.location.hash) {
  window.location.hash = '/';
}
render(parseRoute());
