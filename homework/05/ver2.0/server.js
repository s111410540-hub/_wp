const express = require('express');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const app = express();
const DB_PATH = path.join(__dirname, 'blog.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

async function initDB() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT,
      bio TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      subtitle TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      tags TEXT,
      is_featured INTEGER DEFAULT 0,
      read_time INTEGER DEFAULT 3,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      post_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, post_id)
    )
  `);
  
  const userExists = db.exec("SELECT COUNT(*) FROM users WHERE username = 'writer'")[0];
  if (!userExists || userExists.values[0][0] === 0) {
    db.run("INSERT INTO users (username, display_name, bio, avatar_url) VALUES (?, ?, ?, ?)", 
      ['writer', '寫作者', '熱愛分享知識與想法的創作者', 'https://api.dicebear.com/7.x/initials/svg?seed=Writer&backgroundColor=0a0a0a']);
  }
  
  const samplePosts = [
    { title: '探索前端開發的無限可能', subtitle: '從基礎到進階的旅程', content: '前端開發是一個充滿挑戰與創意的領域。在這篇文章中，我們將探討如何從基礎開始，逐步掌握現代前端開發的核心技術。\n\n首先，HTML 是網頁的骨架。了解正確的語義化標籤使用方式，能讓你的頁面更具可訪問性和SEO友好。\n\n其次，CSS 是網頁的皮膚。Flexbox 和 Grid 布局系統讓響應式設計變得更加直觀和強大。\n\n最後，JavaScript 是網頁的心臟。掌握 ES6+ 的新特性，理解非同步編程，是成為優秀前端工程師的必經之路。', tags: '前端,開發,JavaScript', is_featured: 1, read_time: 5 },
    { title: '設計思維：創造更好的用戶體驗', subtitle: '以人為本的設計方法論', content: '設計思維是一種以人為本的創新方法，強調深入理解用戶需求，通過迭代過程找到最佳解決方案。\n\n這個過程包含五個階段：同理心、定義、創意、原型和測試。每一個階段都至關重要，缺一不可。\n\n在同理心階段，我們需要觀察用戶、與他們交談，了解他們真正關心的問題，而不是我們認為他們需要的。\n\n定義階段是將觀察結果提煉成有價值的洞察，形成清晰的問題陳述。\n\n創意階段需要頭腦風暴，產生大量想法，不要急於批判。\n\n原型階段將想法快速轉化為可觸摸的形式。\n\n測試階段則是讓真實用戶驗證原型的有效性。', tags: '設計,用戶體驗,方法論', is_featured: 1, read_time: 4 },
    { title: 'Node.js 性能優化實踐', subtitle: '讓你的服務器跑得更快', content: 'Node.js 以其非阻塞 I/O 模型聞名，但在生產環境中仍需要持續優化。以下是一些實用的優化技巧。\n\n1. 使用進程管理器如 PM2，可以實現自動重啟和負載均衡。\n\n2. 開啟 Redis 緩存，大幅減少數據庫查詢次數。\n\n3. 合理使用連接池，避免頻繁建立和關閉連接。\n\n4. 壓縮響應內容，使用 Gzip 或 Brotli。\n\n5. 使用 HTTP/2 提升資源載入效率。\n\n記住，性能優化是一個持續的過程，需要持續監控和調整。', tags: 'Node.js,性能,後端', is_featured: 0, read_time: 6 }
  ];
  
  const postCount = db.exec("SELECT COUNT(*) FROM posts")[0];
  if (!postCount || postCount.values[0][0] === 0) {
    const userId = db.exec("SELECT id FROM users WHERE username = 'writer'")[0].values[0][0];
    samplePosts.forEach(post => {
      db.run("INSERT INTO posts (user_id, title, subtitle, content, tags, is_featured, read_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, post.title, post.subtitle, post.content, post.tags, post.is_featured, post.read_time]);
    });
  }
  
  saveDB();
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

app.get('/api/posts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  const posts = queryAll(`
    SELECT p.*, u.username, u.display_name, u.avatar_url,
           (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `, [limit, offset]);
  
  const total = queryOne("SELECT COUNT(*) as count FROM posts").count;
  
  res.json({ posts, total, page, limit, hasMore: offset + posts.length < total });
});

app.get('/api/posts/featured', (req, res) => {
  const posts = queryAll(`
    SELECT p.*, u.username, u.display_name, u.avatar_url,
           (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.is_featured = 1
    ORDER BY p.created_at DESC
    LIMIT 5
  `);
  res.json(posts);
});

app.get('/api/posts/recommended', (req, res) => {
  const posts = queryAll(`
    SELECT p.*, u.username, u.display_name, u.avatar_url,
           (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    ORDER BY like_count DESC, p.created_at DESC
    LIMIT 10
  `);
  res.json(posts);
});

app.get('/api/posts/user/:username', (req, res) => {
  const user = queryOne("SELECT * FROM users WHERE username = ?", [req.params.username]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const posts = queryAll(`
    SELECT p.*, u.username, u.display_name, u.avatar_url,
           (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `, [user.id]);
  
  const stats = {
    posts: posts.length,
    totalLikes: posts.reduce((sum, p) => sum + p.like_count, 0)
  };
  
  res.json({ user, posts, stats });
});

app.get('/api/posts/:id', (req, res) => {
  const post = queryOne(`
    SELECT p.*, u.username, u.display_name, u.avatar_url, u.bio,
           (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `, [parseInt(req.params.id)]);
  
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

app.post('/api/posts', (req, res) => {
  const { title, subtitle, content, cover_image, tags, user_id } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  db.run('INSERT INTO posts (user_id, title, subtitle, content, cover_image, tags, read_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id || 1, title, subtitle || '', content, cover_image || '', tags || '', readTime]);
  saveDB();
  
  const post = queryOne('SELECT * FROM posts WHERE id = last_insert_rowid()');
  res.status(201).json(post);
});

app.put('/api/posts/:id', (req, res) => {
  const { title, subtitle, content, cover_image, tags } = req.body;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  db.run(`UPDATE posts SET title = ?, subtitle = ?, content = ?, cover_image = ?, tags = ?, read_time = ? WHERE id = ?`,
    [title, subtitle || '', content, cover_image || '', tags || '', readTime, parseInt(req.params.id)]);
  saveDB();
  
  const post = queryOne('SELECT * FROM posts WHERE id = ?', [parseInt(req.params.id)]);
  res.json(post);
});

app.delete('/api/posts/:id', (req, res) => {
  db.run('DELETE FROM likes WHERE post_id = ?', [parseInt(req.params.id)]);
  db.run('DELETE FROM posts WHERE id = ?', [parseInt(req.params.id)]);
  saveDB();
  res.json({ message: 'Post deleted' });
});

app.post('/api/likes/:postId', (req, res) => {
  const userId = req.body.user_id || 1;
  const postId = parseInt(req.params.postId);
  
  const existing = queryOne('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
  if (existing) {
    db.run('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
    saveDB();
    res.json({ liked: false });
  } else {
    db.run('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
    saveDB();
    res.json({ liked: true });
  }
});

app.get('/api/users/:username', (req, res) => {
  const user = queryOne("SELECT * FROM users WHERE username = ?", [req.params.username]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.get('/api/users', (req, res) => {
  const users = queryAll("SELECT * FROM users ORDER BY created_at DESC");
  res.json(users);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDB().then(() => {
  app.listen(3001, () => {
    console.log('Medium-style blog running at http://localhost:3001');
  });
});
