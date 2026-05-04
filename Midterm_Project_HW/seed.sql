-- 密碼統一為: password123 (hashed: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f)
INSERT INTO users (id, username, email, password_hash) VALUES 
(1, 'GamerMaster', 'gamer@test.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
(2, 'ZeldaFan', 'zelda@test.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');

INSERT INTO questions (id, title, content, user_id, game_tag, vote_count, answer_count) VALUES 
(1, '薩爾達傳說王國之淚，人馬怎麼打？', '每次遇到白銀人馬都被秒殺，請問有什麼推薦的裝備或打法嗎？', 2, '薩爾達傳說', 5, 1),
(2, '柏德之門3 新手職業推薦', '剛買這款遊戲，請問第一輪推薦玩什麼職業比較好上手？', 1, '柏德之門3', 3, 0);

INSERT INTO answers (id, content, question_id, user_id, vote_count, is_accepted) VALUES 
(1, '建議先去收集蠻族套裝升級，然後練習盾反和林克時間。另外可以使用獸肉料理撐血量。', 1, 1, 10, 1);

-- Updates question 1 as solved
UPDATE questions SET is_solved = 1 WHERE id = 1;
