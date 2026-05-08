# AI 對話總結：榮耀遊戲論壇網站架構指南
## 零、文件說明
我使用Claude總結了我與他的對話內容，以下是內容統整。

**專案名稱：** 榮耀遊戲情報論壇（Glory Game Forum）  
**技術主題：** 全端網站架構設計、Cloudflare 部署、資料庫設計、RESTful API  
**對話工具：** Claude AI（Anthropic）  
**學生：** 網頁設計課程期中專案

---

## 一、初始需求與架構選擇

### 問題提出
學生提出需求：開發一個類似 Stack Overflow 的遊戲技術論壇，主題為小說《全職高手》中的虛擬遊戲「榮耀」，需具備後端功能，並能部署至線上提供永久網址供教授 Demo 使用，同時能在本地預覽開發。

### AI 建議的架構
AI 分析學生需求後，建議採用以下技術組合，理由是整合度高、免費方案足夠、不需要維護獨立伺服器：

- **前端：** 純 HTML / CSS / JavaScript，部署於 Cloudflare Pages
- **後端：** Cloudflare Pages Functions（Serverless，Workers 執行環境）
- **資料庫：** Cloudflare D1（SQLite 語法的邊緣資料庫）
- **身份驗證：** JWT（JSON Web Token），使用 Web Crypto API 實作，無需第三方套件
- **開發工具：** Wrangler CLI（本地開發與部署）

AI 特別說明，由於 Cloudflare Pages Functions 執行於 Workers 環境而非 Node.js，無法使用 `require()` 語法或 `bcrypt` 等 Node.js 套件，所有程式碼必須使用 ES Modules 語法，密碼雜湊改以 Web Crypto API 的 SHA-256 實作。

---

## 二、資料庫設計

### 對話內容
學生詢問如何設計資料庫結構，AI 協助設計了 `schema.sql`，包含六張資料表：

- `users`：儲存帳號、密碼雜湊、建立時間
- `questions`：論壇問題，含標題、內容、作者、標籤
- `answers`：回答，關聯到問題
- `votes`：投票記錄，使用 UNIQUE 約束防止重複投票
- `materials`：榮耀遊戲素材資料（名稱、分類、稀有度、掉落來源）
- `listings`：素材交易市集，支援出售與收購兩種類型
- `messages`：私人訊息系統，含已讀狀態

### 關鍵學習點
AI 說明了為什麼使用 `INSERT OR REPLACE INTO` 而非 `INSERT INTO` 來執行種子資料，避免重複執行時產生 UNIQUE constraint 錯誤。並解釋了本地資料庫與遠端 D1 資料庫的差異，以及如何透過 `--local` 和 `--remote` 旗標分別操作兩個環境。

---

## 三、身份驗證系統

### 對話內容
學生詢問如何讓使用者登入後被系統記住。AI 說明了 JWT 的運作原理：使用者登入成功後，後端簽發一個包含使用者 ID 的 Token，前端存入 `localStorage`，之後每次發送 API 請求都在 `Authorization: Bearer <token>` header 中帶上，後端驗證 Token 的合法性。

AI 完整實作了 `functions/utils.js`，包含：
- `hashPassword()`：使用 Web Crypto API SHA-256 進行密碼雜湊
- `createJWT()`：手動建立符合規範的 JWT 字串
- `verifyJWT()`：驗證 JWT 簽章並回傳 payload

### 關鍵學習點
由於 Cloudflare Workers 環境不支援 Node.js 的 `crypto` 模組，必須改用瀏覽器規範的 `crypto.subtle` API。這讓學生理解到不同執行環境對程式碼相容性的影響。

---

## 四、Middleware 集中驗證機制

### 對話內容
在開發過程中，AI 建議建立 `functions/api/_middleware.js`，統一處理所有 API 路由的 JWT 驗證，避免在每個 API 檔案中重複撰寫驗證邏輯。

Middleware 的邏輯為：公開路由（如登入、註冊、GET 問題列表）直接放行，其餘路由驗證 JWT，驗證通過後將使用者資料附加至 `context.data`，供下游 handler 使用。

### 除錯過程
後來新增 `GET /api/users/:id` 個人主頁 API 時，發生 401 錯誤。學生透過 F12 DevTools 觀察到 Status Code 是 401 而非 404，AI 由此判斷問題不在檔案路徑，而在 Middleware 的白名單設定，指引學生找到並修正白名單規則。這個過程讓學生學到如何從 HTTP 狀態碼判斷錯誤來源。

---

## 五、RESTful API 設計

### 實作的 API 端點

| 方法 | 路徑 | 功能 | 是否需要登入 |
|------|------|------|------------|
| POST | /api/auth/register | 註冊 | 否 |
| POST | /api/auth/login | 登入 | 否 |
| GET | /api/questions | 取得問題列表 | 否 |
| POST | /api/questions | 發問 | 是 |
| GET | /api/answers?question_id= | 取得回答 | 否 |
| POST | /api/answers | 回答問題 | 是 |
| POST | /api/votes | 投票 | 是 |
| GET | /api/materials | 取得素材列表 | 否 |
| GET | /api/listings | 取得交易列表 | 否 |
| POST | /api/listings | 發布交易 | 是 |
| PUT | /api/listings/:id | 修改交易 | 是（本人） |
| DELETE | /api/listings/:id | 刪除交易 | 是（本人） |
| GET | /api/users/:id | 個人主頁 | 否 |
| GET | /api/messages | 對話列表 | 是 |
| POST | /api/messages | 寄送訊息 | 是 |
| GET | /api/messages/:user_id | 對話紀錄 | 是 |
| GET | /api/messages/unread | 未讀數量（輪詢用） | 是 |

### 關鍵學習點
AI 說明了 RESTful 設計原則：用 HTTP 方法（GET/POST/PUT/DELETE）表達操作意圖，用路徑表達資源，用狀態碼表達結果。學生也學到了 SQL Injection 防護的概念，理解為何所有查詢都必須使用 Prepared Statements 而非字串拼接。

---

## 六、部署流程

### 遇到的問題與解法

**問題一：database_id 佔位符**  
`wrangler.toml` 中 `database_id` 為預設佔位符，導致本地執行找不到資料庫。解法：執行 `wrangler d1 create forum-db` 取得真實 ID 後填入。

**問題二：binding 名稱不符**  
Wrangler 建議的 binding 名稱為 `forum_db`，但程式碼中使用 `env.DB`。解法：在 `wrangler.toml` 明確設定 `binding = "DB"`。

**問題三：GitHub 子目錄部署失敗**  
專案位於 GitHub repo 的子目錄 `Midterm_Project_HW/`，Cloudflare 的自動部署找不到 `public/` 資料夾。解法：改用 `wrangler pages deploy public` 從本地手動部署，繞過 GitHub 整合問題。

**問題四：JWT_SECRET 敏感資訊管理**  
不能將密鑰直接寫入 `wrangler.toml`（會被推上 GitHub）。解法：本地使用 `.dev.vars` 檔案（加入 `.gitignore`），線上在 Cloudflare Dashboard 的 Environment Variables 設定。

### 最終部署指令
```bash
# 本地開發
npx wrangler pages dev public

# 部署至線上
npx wrangler pages deploy public

# 推送資料庫 schema
npx wrangler d1 execute forum-db --remote --file=schema.sql

# 推送種子資料
npx wrangler d1 execute forum-db --remote --file=materials_seed.sql
```

---

## 七、進階功能設計

### 7.1 私人訊息系統與輪詢機制

學生詢問是否能實作私訊功能並達到即時通知效果。AI 說明了 Cloudflare Pages Functions 為無狀態 Serverless 架構，無法維持 WebSocket 長連線，因此無法實現真正的即時推播。

折衷方案為**短輪詢（Short Polling）**：前端每隔固定秒數自動呼叫 `GET /api/messages/unread`，查詢未讀訊息數量。AI 分析了免費方案的請求次數限制（每日 100,000 次），針對 Demo 環境（最多 3 位使用者）計算出 3 秒輪詢間隔即可在限制內正常運作。

優化策略：只在私訊頁面啟動輪詢，離開頁面時呼叫 `clearInterval()` 停止，避免不必要的請求消耗。

### 7.2 聲望稱號與徽章系統（可擴充功能）

設計了十個等級的稱號系統，以使用者累積獲讚總數為依據，稱號名稱完全依照榮耀遊戲世界觀設定：

從新手玩家（0讚）、見習冒險者（50讚）、進階玩家（200讚）、熟練玩家（500讚）、菁英冒險者（1,000讚）、神之領域居民（5,000讚）、天榜高手（10,000讚）、職業選手（20,000讚）、全服第一（50,000讚），到最高等級榮耀大神（100,000讚）。

技術實作上，`getBadge()` 函式加入 `utils.js` 統一管理，稱號為動態計算值，不需要在資料庫新增欄位，在回傳使用者資料時即時附加。

### 7.3 圖片支援（可擴充功能，詳見獨立報告段落）

討論了三種方案的技術難點與取捨，最終記錄於學習報告的可擴充功能章節。

---

## 八、Harness Engineering 文件化

AI 介紹了 Harness Engineering 的概念：為 AI 協作而優化的技術文件格式，強調用最少的字數傳遞最多的技術約束資訊。學生的專案建立了 `AGENT.md`，記錄執行環境硬性限制、開發指令、檔案結構、資料庫規則、API 合約與部署前檢查清單，讓 AI 在每次對話中都能快速理解專案背景，減少重複說明的成本。

---

## 九、學習成果總結

透過本次 AI 輔助開發，學生實際接觸並理解了以下技術概念：

**架構層面：** Serverless 架構的運作原理與限制、前後端分離設計、RESTful API 設計規範、Middleware 集中驗證機制。

**資料庫層面：** SQL 資料表設計、外鍵關聯、UNIQUE 約束、Prepared Statements 防 SQL Injection、本地與遠端資料庫的操作差異。

**安全性層面：** JWT 身份驗證流程、密碼雜湊（不可逆加密）、敏感資訊的環境變數管理、為何不能將密鑰推上 Git。

**除錯能力：** 如何透過 HTTP 狀態碼（401 vs 404）判斷錯誤類型、如何使用 F12 DevTools 的 Network 分頁追蹤 API 請求、如何閱讀 Wrangler 終端機的 server log。

**部署流程：** Cloudflare Pages 的手動部署流程、wrangler.toml 的 binding 設定、D1 資料庫的 schema 與種子資料推送。
