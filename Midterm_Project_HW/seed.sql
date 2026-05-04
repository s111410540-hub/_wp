-- 密碼統一為: password123 (hashed: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f)
INSERT INTO users (id, username, email, password_hash) VALUES 
(1, 'GamerMaster', 'gamer@test.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
(2, 'ZeldaFan', 'zelda@test.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');

INSERT INTO questions (id, title, content, user_id, game_tag, vote_count, answer_count) VALUES 
(1, '這週的災厄之龍周本boss怎麼打？', '每次進到P2階段全場AOE都被秒殺，請問奶媽應該什麼時候開大？', 2, '周本boss', 5, 1),
(2, '死亡沙漠野圖boss重生時間', '請問有人知道死亡沙漠那隻沙蟲王多久重生一次嗎？', 1, '野圖boss', 3, 0),
(3, '週末公會戰防守陣容推薦', '我們公會目前排名第10，想請問防守據點應該放什麼職業組合比較好？', 2, '公會戰', 8, 0);

INSERT INTO answers (id, content, question_id, user_id, vote_count, is_accepted) VALUES 
(1, 'P2階段王飛上去的時候，奶媽就要開始預備群補了。建議全員都要撐一點暗抗，否則就算補滿也很容易被秒。', 1, 1, 10, 1);

-- Updates question 1 as solved
UPDATE questions SET is_solved = 1 WHERE id = 1;
