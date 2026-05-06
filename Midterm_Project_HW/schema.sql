CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  reputation INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, 
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  game_tag TEXT, 
  vote_count INTEGER DEFAULT 0,
  answer_count INTEGER DEFAULT 0, 
  is_solved INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  question_id INTEGER NOT NULL REFERENCES questions(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  is_accepted INTEGER DEFAULT 0, 
  vote_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_type TEXT NOT NULL CHECK(target_type IN ('question','answer')),
  target_id INTEGER NOT NULL,
  value INTEGER NOT NULL CHECK(value IN (1,-1)),
  UNIQUE(user_id, target_type, target_id)
);

-- 素材資料表
CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('野外boss素材','周本稀有材料','地圖探索素材','特殊資源點素材')),
  description TEXT,
  rarity TEXT NOT NULL CHECK(rarity IN ('普通','稀有','史詩','傳說')),
  drop_source TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 交易列表
CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  material_id INTEGER NOT NULL REFERENCES materials(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  type TEXT NOT NULL CHECK(type IN ('出售','收購')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','sold','cancelled')),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
