-- 密碼統一為: password123 (hashed: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f)
INSERT OR REPLACE INTO users (id, username, email, password_hash) VALUES 
(1, 'GamerMaster', 'gamer@test.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
(2, 'ZeldaFan', 'zelda@test.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');

INSERT OR REPLACE INTO questions (id, title, content, user_id, game_tag, vote_count, answer_count) VALUES 
(1, '這週的災厄之龍周本boss怎麼打？', '每次進到P2階段全場AOE都被秒殺，請問奶媽應該什麼時候開大？', 2, '周本boss', 5, 1),
(2, '死亡沙漠野圖boss重生時間', '請問有人知道死亡沙漠那隻沙蟲王多久重生一次嗎？', 1, '野圖boss', 3, 0),
(3, '週末公會戰防守陣容推薦', '我們公會目前排名第10，想請問防守據點應該放什麼職業組合比較好？', 2, '公會戰', 8, 0),
(4, '【主地圖情報】極光森林全隱藏寶箱位置一覽表！', '小弟花了三天三夜在極光森林裡地毯式搜索，終於把所有會掉落極光碎片的隱藏寶箱都找齊了。本篇將會詳細附上每一區的座標與觸發條件。建議大家可以搭配採集套裝一起服用，效率更高喔！\n\n如果這篇文章對你有幫助，請幫我點個讚！', 1, '主地圖情報', 125, 0),
(5, '新手村南方礦坑一直進不去？', '有人知道星落村南邊那個被石頭擋住的礦坑要怎麼進去嗎？我試過用炸藥跟土系魔法都打不開。', 2, '主地圖情報', 12, 0),
(6, '王城地下水道的神祕NPC', '昨天在地下水道刷怪時，偶然發現牆角有一個全身黑袍的NPC，對話只會說「時機未到」。有人解開這個隱藏任務了嗎？求分享情報！', 1, '主地圖情報', 42, 0),
(7, '【地圖彩蛋】落日峽谷的夕陽', '分享一個沒什麼用但很美的彩蛋：在遊戲時間下午五點整，走到落日峽谷最頂端的懸崖邊，會看到超真實的夕陽雲海。太神啦 Glory！', 2, '主地圖情報', 88, 0);

INSERT OR REPLACE INTO answers (id, content, question_id, user_id, vote_count, is_accepted) VALUES 
(1, 'P2階段王飛上去的時候，奶媽就要開始預備群補了。建議全員都要撐一點暗抗，否則就算補滿也很容易被秒。', 1, 1, 10, 1);

-- Updates question 1 as solved
UPDATE questions SET is_solved = 1 WHERE id = 1;