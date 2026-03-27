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
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  saveDB();
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

app.get('/api/posts', (req, res) => {
  const posts = db.exec('SELECT * FROM posts ORDER BY created_at DESC')[0];
  if (!posts) return res.json([]);
  const cols = posts.columns;
  const rows = posts.values.map(row => {
    const obj = {};
    cols.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
  res.json(rows);
});

app.get('/api/posts/:id', (req, res) => {
  const result = db.exec('SELECT * FROM posts WHERE id = ?', [parseInt(req.params.id)]);
  if (result.length && result[0].values.length) {
    const cols = result[0].columns;
    const row = result[0].values[0];
    const post = {};
    cols.forEach((col, i) => post[col] = row[i]);
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
  saveDB();
  const result = db.exec('SELECT * FROM posts WHERE id = last_insert_rowid()');
  const cols = result[0].columns;
  const row = result[0].values[0];
  const post = {};
  cols.forEach((col, i) => post[col] = row[i]);
  res.status(201).json(post);
});

app.delete('/api/posts/:id', (req, res) => {
  db.run('DELETE FROM posts WHERE id = ?', [parseInt(req.params.id)]);
  saveDB();
  res.json({ message: 'Post deleted' });
});

initDB().then(() => {
  app.listen(3000, () => {
    console.log('Blog server running at http://localhost:3000');
  });
});
