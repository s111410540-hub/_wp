# 網頁設計期中專案學習報告
## 零.前言 
由於教授的核心要求是要做出有`server`的網站，為了確實作出跑在伺服器端的功能，加上我個人希望可以在線上永久部屬一個有伺服器的網站，因此跟AI討論後決定使用***Cloudeflare***來架設網頁。
結構部分使用了:
 | 前端 | 後端 | 資料庫 |
| ------- | ------- | ------- |
|Cloudflare Pages  | Pages Functions | Cloudflare D1 |
HTML+CSS+JS|Cloudflare Workers|SQLite

此外使用了`Wrangler`的CLI工具來幫助我在電腦本地部署以及上傳到線上、設定環境等。

 這套相對一開始複雜的框架指令跟各種已經幫我打包的環境檔案，大多使用`JavaScript`來處理，學習跟閱讀難度會大大減少。
 > 註:一開始有想要使用React+Vite+Hono+Drizzle ORM 的組合，但由於AI生成後的專案結構過於複雜，一個專案有超過一萬個檔案，學習難度過高就放棄使用這個結構。

### 一開始專案的部分架構截圖:
 ![image](https://hackmd.io/_uploads/rkzo-CuAWx.png)

:::info 
### AI使用說明
本作業全程皆使用了 `Antigravity Gemini 3.1 pro(Low) `來撰寫程式碼，除非遇到前端的文本錯誤以及一些單個檔案的程式邏輯錯誤才會手打。
討論、思考、學習部分則是使用了 `Gemini 3 Flash`、`Claude Sonnet 4.6` 來規劃整個專案，跟詢問我不懂的地方。

-------->>  [AI對話總結](https://hackmd.io/@eT-gjmUJSiGm7xXaQjMCUw/SkUx36O0bl)
:::
:::success
### Harness Engineering
 由於在2026 的2月開始出現了**Harness Engineering**這個概念，因此我決定在這個專案使用這個概念。列出了多項規範跟在開發流程中增加回饋，並使用`Claude`寫出`Agent.md`，以便讓負責撰寫程式碼的`Gemini 3.1 pro(Low)` 能夠更穩定的產出代碼。
:::

## 一. 專案簡介
這次的專案是以中國網路小說**全職高手**內部的的遊戲 **榮耀** 為背景，去設計專為了玩家所設計的遊戲技術&情報論壇網站。整體參考現實中的`Stack Overflow` 與 `巴哈姆特` 這兩個論壇型網站。也有在部分介面參考了`apple.com`的便當盒&卡片化排版。

榮曜在小說設定中是全世界最受歡迎的網路遊戲，共有24種職業，地圖分成主世界與神之領域。玩家滿等為75等，且擁有職業聯賽與公會系統等**MMORPG**(大型多人線上角色扮演遊戲)的經典要素。
### 網站功能:
本專案實作了以下主要功能模組：
- **帳號系統**：使用者註冊、登入、JWT 身份驗證、個人主頁。

- **問答論壇**：發問、回答、投票（讚踩）、最新問題列表。

- **素材交易市集**：出售與收購交易發布、瀏覽、修改、下架。

- **私人訊息系統**：站內信箱、對話紀錄、未讀通知輪詢。

- **榮耀榜單**：天榜個人排名、公會榜，依照原著設定呈現。

- **聲望稱號系統**：依獲讚數自動顯示對應稱號。

## 二.系統架構說明
###  2.1 整體架構概覽
本專案採用前後端分離的 Serverless 架構，所有運算資源皆部署於 Cloudflare 的全球網路，不需要租用或維護獨立的伺服器主機。
:::info
### Serverless 與傳統架構的比較
傳統網站架構需要租用一台虛擬主機（VPS）或實體伺服器，在上面安裝 Node.js、Express、MySQL 等服務，並全天候維持運行。使用這種方式的優點是自由度高，但缺點是需要定期支付主機費用、管理伺服器安全性更新，以及處理流量突增時的擴容問題。

:::

使用Cloudflare對我而言是最輕鬆的方式，不用考慮環境問題，也可以單靠免費方案去處理API請求消耗。

### 2.2 專案檔案結構

```
Midterm_Project_HW/
├── functions/             後端 API（Cloudflare Pages Functions）
│   ├── api/
│   │   ├── _middleware.js    # 集中處理 JWT 驗證的中介層
│   │   ├── auth/
│   │   │   ├── login.js      # 登入 API
│   │   │   └── register.js   # 註冊 API
│   │   ├── questions/
│   │   │   ├── questions.js  # 問題列表（GET / POST）
│   │   │   └── [id].js       # 單一問題操作
│   │   ├── answers/
│   │   │   ├── answers.js    # 回答列表（GET / POST）
│   │   │   ├── [id].js       # 單一回答操作
│   │   │   └── [id]/accept.js # 標記最佳解答
│   │   ├── votes.js          # 投票讚踩 API
│   │   ├── materials.js      # 素材資料 API
│   │   ├── listings/
│   │   │   ├── listings.js   # 交易列表（GET / POST）
│   │   │   └── [id].js       # 修改 / 下架交易
│   │   ├── messages/
│   │   │   ├── messages.js   # 對話列表（GET / POST）
│   │   │   ├── [user_id].js  # 查看指定對話紀錄
│   │   │   └── unread.js     # 未讀數量（輪詢用）
│   │   └── users/
│   │       ├── [id].js       # 公開個人主頁
│   │       └── profile.js    # 當前登入者資料
│   └── utils.js              # 共用工具（JWT 建立 / 驗證、密碼雜湊）
├── public/              前端靜態資源
│   ├── css/style.css         # 網站樣式表
│   ├── js/
│   │   ├── api.js            # 後端 API 呼叫共用函式庫
│   │   └── app.js            # 前端主要邏輯與 DOM 操作
│   ├── index.html            # 首頁（問答列表）
│   ├── question.html         # 問題詳情與回答頁
│   ├── market.html           # 素材交易市集
│   ├── material.html         # 素材詳情頁
│   ├── leaderboard.html      # 天榜排行榜
│   ├── guilds.html           # 公會榜
│   ├── messages.html         # 私人訊息中心
│   ├── profile.html          # 個人主頁
│   ├── login.html            # 登入頁
│   └── register.html         # 註冊頁
├── schema.sql                # 資料庫結構定義（7 張資料表）
├── seed.sql                  # 初始資料（20 種榮耀遊戲素材）
├── wrangler.toml             # Cloudflare 設定檔案（D1 綁定、專案名稱）
└── Agent.md                  # 專案技術文件（供 AI 協作使用）
```

## 三.前端設計
如前言所說，為了降低學習門檻，前端採用純 HTML、CSS、JavaScript 撰寫，不使用 React、Vue 等前端框架。所有靜態檔案存放於 `public/` 資料夾，由 Cloudflare Pages 直接提供給使用者的瀏覽器，不需要經過任何編譯或建置步驟。


### 3.1 頁面架構

| 頁面 | 檔案 | 功能 | 需要登入 |
|------|------|------|----------|
| 首頁 | index.html | 顯示最新問答列表 | 否 |
| 問題詳情 | question.html | 問題內容與所有回答 | 否（互動需要） |
| 素材交易市集 | market.html | 瀏覽與發布交易 | 否（發布需要） |
| 素材詳情 | material.html | 單一素材的詳細資訊 | 否 |
| 榮耀榜單 | leaderboard.html | 天榜個人排名 | 否 |
| 公會榜 | guilds.html | 神之領域公會排名 | 否 |
| 私人訊息 | messages.html | 對話列表與訊息紀錄 | 是 |
| 個人主頁 | profile.html | 使用者資料與發文紀錄 | 否 |
| 登入 | login.html | 帳號登入 | 否 |
| 註冊 | register.html | 建立新帳號 | 否 |



### 3.2 前後端溝通方式

前端透過瀏覽器內建的 **Fetch API** 向後端發送非同步 HTTP 請求，取得 JSON 格式的資料後，用 JavaScript 動態操作 DOM 將資料渲染到頁面上，整個過程不需要重新載入頁面。

專案建立了 `public/js/api.js` 作為所有 API 呼叫的共用函式庫，把重複的邏輯封裝起來，讓各頁面的程式碼更簡潔：

```javascript
// api.js 的核心概念
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      // 有 token 就自動附上，沒有就略過
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  });
  return res.json();
}
```

這樣各頁面呼叫 API 時只需要一行，不需要每次重複寫 Header 設定：

```javascript
// 各頁面的呼叫方式
const data = await apiFetch('/api/questions');
const result = await apiFetch('/api/listings', {
  method: 'POST',
  body: JSON.stringify({ material_id, price, quantity })
});
```

JWT Token 的處理方式是：登入成功後後端回傳 Token，前端存入 `localStorage`。之後每次呼叫需要驗證的 API，`api.js` 自動從 `localStorage` 取出 Token 附加在 `Authorization` Header 中，後端收到後驗證身份。



### 3.3 使用者體驗

- #### 不強制登入
    這裡參考了[巴哈姆特](https://www.gamer.com.tw/)的方式，可以讓使用者直接觀看討論與文章。
    只有在嘗試發問、投票、發布交易或傳送私訊等互動行為時，才跳出登入提示。

- #### 私訊頁面的輪詢設計

    私訊的未讀通知功能透過短輪詢實現，前端在私訊頁面開啟時每隔 3 秒自動呼叫 `GET /api/messages/unread`，若未讀數量增加則在導航列顯示紅點提示。為了避免不必要的請求消耗，離開私訊頁面時會呼叫 `clearInterval()` 停止輪詢：

    ```javascript
    // 進入私訊頁面時啟動
    const timer = setInterval(checkUnread, 3000);

    // 離開頁面時停止
    window.addEventListener('beforeunload', () => clearInterval(timer));
    ```


## 四.後端 API 設計
為了防止任何人能夠輕易的在  <kbd>F12</kbd> 開啟開發者工具來竄改程式碼，需要撰寫運行在後端的程式碼，確保重要的功能不會被使用者濫用。

整個過流程如下:
```
使用者按下「發問」按鈕
        ↓
前端發送 POST /api/questions（帶著標題和內容）
        ↓
後端收到請求 → 驗證是否已登入 → 寫入資料庫
        ↓
後端回傳 { success: true }
        ↓
前端顯示「發問成功」
```
### 4.1  RESTful API 設計原則
本專案的 API 遵循 **RESTful** 設計風格，把網站上的所有東西都看成「資源」，用 HTTP 方法描述我想對這個資源做什麼：
 HTTP 方法 | 操作方式 
---|---
 GET | 取得資料 
 POST | 新增資料 
 PUT | 修改資料 
 DELETE | 刪除資料
 
 以這次網站的**材料交易區**為例子
 ```
GET    /api/listings    ->  瀏覽所有交易
POST   /api/listings    ->  發布一筆新交易
PUT    /api/listings/5  ->  修改第 5 筆交易
DELETE /api/listings/5  ->  下架第 5 筆交易
 ```
 :::info
 #### RESTful 設計原則
 在 REST(Representational State Transfer) 中，所有的東西都是資源（例如：一個使用者、一篇文章、一張圖片）。每個資源都必須有一個唯一的識別地址，即 **URI（統一資源識別碼）**。
 有了資源的地址之後，用 HTTP 方法說明你要對它做什麼操作，同一個 URL，搭配不同的 HTTP 方法，就能表達完全不同的意圖。
 :::
 :::success
#### HTTP 方法
每次前端發送請求給後端，都必須指定一個 HTTP 方法，告訴後端這次請求的意圖。
此外，等到後端執行完要求，會使用用 HTTP 狀態碼告訴前端結果如何。
常見的狀態碼為:
狀態碼|意義|可能的狀況
--|--|--
200|成功|GET 查詢成功
201|建立成功|POST 新增資料成功
400|請求格式錯誤|價格輸入負數
401|未登入|沒有附上 JWT Token
403|沒有權限|嘗試修改別人的交易
404|找不到資源|查詢不存在的問題
500|伺服器錯誤|資料庫操作失敗
 :::
 ### 4.2 完整 API 端點列表
 
本專案共實作 18 個 API 端點，共有五大功能，涵蓋帳號驗證、問答系統、素材交易、私人訊息與個人主頁。端點設計遵循 RESTful 原則，以資源路徑搭配 HTTP 方法表達操作意圖。

- #### 帳號驗證
    方法|路徑|功能
    --|--|--
    POST|/api/auth/register|使用者註冊
    POST|/api/auth/login|登入，回傳 JWT Token
- #### 問答系統
    | 方法 | 路徑 | 功能 | 需要登入 |
    |------|------|------|----------|
    | GET | /api/questions | 取得問題列表 | 否 |
    | POST | /api/questions | 發布新問題 | 是 |
    | GET | /api/answers | 取得問題的回答 | 否 |
    | POST | /api/answers | 回答問題 | 是 |
    | POST | /api/answers/:id/accept | 標記最佳解答 | 是 |
    | POST | /api/votes | 投票讚踩 | 是 |

- #### 素材交易市集
    | 方法 | 路徑 | 功能 | 需要登入 |
    |------|------|------|----------|
    | GET | /api/materials | 取得素材列表 | 否 |
    | GET | /api/listings | 取得交易列表 | 否 |
    | POST | /api/listings | 發布新交易 | 是 |
    | PUT | /api/listings/:id | 修改交易（限本人） | 是 |
    | DELETE | /api/listings/:id | 下架交易（限本人） | 是 |


- #### 私人訊息
    | 方法 | 路徑 | 功能 |
    |------|------|------|
    | GET | /api/messages | 查看對話列表 |
    | POST | /api/messages | 傳送私人訊息 |
    | GET | /api/messages/:user_id | 查看指定對話紀錄 |
    | GET | /api/messages/unread | 查詢未讀數量 |
- #### 個人主頁
    方法|路徑|功能
    | 方法 | 路徑 | 功能 | 需要登入 |
    |------|------|------|----------|
    | GET | /api/users/:id | 查看個人主頁 | 否 |

### 4.3  JWT 身份驗證機制
JWT（JSON Web Token）是一種開放標準的身份驗證機制，適合在無狀態的 Serverless 架構中使用，因為伺服器不需要儲存任何 Session 資料。

驗證流程如下：使用者輸入帳號密碼後，後端驗證正確性，使用`HMAC-SHA256` 演算法簽發一個包含使用者 ID 和過期時間的 Token 字串，回傳給前端。前端將 Token 存入 localStorage，之後每次發送需要驗證的 API 請求，都在 HTTP Header 中附上此 Token（格式為 `Authorization: Bearer <token>`）。後端收到請求時驗證 Token 的簽章是否正確，並從中取出使用者 ID，確認身份後才執行對應的資料庫操作。

由於 Cloudflare Workers 環境並非 Node.js，無法使用 jsonwebtoken 套件，因此 JWT 的建立與驗證完全透過 Web Crypto API 的 `crypto.subtle` 介面實作，包含 HMAC 金鑰匯入、資料簽章與簽章驗證。
:::info
#### JWT的結構
JWT 是一個由三段組成、用點號分隔的字串：
```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MywidXNlcm5hbWUiOiLoraHkv6AifQ.xK9z3Q...
        Header              Payload                    Signature
```
- Header： 聲明使用的簽章演算法（本專案使用 HMAC-SHA256）
- Payload： 存放使用者資料，例如 { id: 3, username: "葉修" }
- Signature： 用 JWT_SECRET 密鑰對前兩段進行簽署，防止竄改
:::

### 4.4 Middleware 集中驗證設計

為避免在每個 API 檔案中重複撰寫 JWT 驗證邏輯，專案建立了 `functions/api/_middleware.js`，作為所有 `/api/*` 路由的前置關卡。

Middleware 的運作邏輯是：每個 API 請求進來後，先由 Middleware 判斷該路由是否需要驗證。公開路由（如登入、註冊、GET 問題列表、GET 個人主頁）直接放行；其餘路由必須通過 JWT 驗證，驗證成功後將使用者資料附加至 `context.data`，讓下游的 handler 函式直接取用，不需要重複解析 Token。

這種設計讓驗證邏輯集中在單一位置管理，若日後需要修改驗證規則，只需修改 Middleware 一個檔案，而不用逐一修改所有 API 檔案。
## 五.資料庫設計

資料庫的設計核心是「每一種資料只存在一個地方」。本專案依照功能把資料拆分成七張獨立的資料表，各表之間透過外鍵（Foreign Key）建立關聯。例如一篇問題的作者不會直接把名字存在 questions 表裡，而是存一個 `user_id` 指向 users 表，需要作者名稱時再透過 JOIN 查詢取得。

這種設計的好處是當使用者修改名稱時，只需要改 users 表的一筆資料，所有關聯到這個使用者的問題、回答、交易都會自動反映新名稱，不需要逐一更新。
:::info
#### 外鍵（Foreign Key）
外鍵是一個資料表中的欄位，它的值必須對應到另一張資料表的主鍵（Primary Key）。簡單說，外鍵是兩張資料表之間的連結橋樑，確保關聯的資料真實存在。
:::

### 5.1 資料表關係

| 資料表 | 用途 | 關聯對象 |
|--------|------|----------|
| users | 儲存帳號與密碼雜湊 | 被其他所有表關聯 |
| questions | 論壇問題 | 關聯 users（發問者） |
| answers | 問題的回答 | 關聯 questions、users |
| votes | 讚踩投票記錄 | 關聯 users，目標可以是問題或回答 |
| materials | 榮耀遊戲素材資料 | 被 listings 關聯 |
| listings | 素材交易市集 | 關聯 materials、users |
| messages | 私人訊息 | 關聯 users（寄件者與收件者） |

---

### 5.2 三個設計決策

#### 決策一：密碼存雜湊值而非明文

users 表的 `password_hash` 欄位存放的不是使用者輸入的密碼，而是經過 SHA-256 演算法處理後的雜湊值。SHA-256 是單向的，只能從密碼算出雜湊值，無法從雜湊值反推回原始密碼。


#### 決策二：votes 表用 UNIQUE 約束防重複投票

```sql
UNIQUE(user_id, target_type, target_id)
```

這行約束的意思是：同一個使用者對同一個目標，只能有一筆投票記錄。當有人試圖重複投票時，資料庫會直接拒絕寫入並回傳錯誤，不需要在程式碼裡額外寫判斷邏輯。

把這個限制放在資料庫層而非程式碼層的原因是可靠性更高。程式碼有可能因為 bug 或並發請求而繞過檢查，但資料庫的約束是強制性的，任何情況下都會執行。

#### 決策三：CHECK 限制欄位只能存特定值

```sql
type TEXT NOT NULL CHECK(type IN ('出售','收購'))
status TEXT NOT NULL CHECK(status IN ('active','sold','cancelled'))
rarity TEXT NOT NULL CHECK(rarity IN ('普通','稀有','史詩','傳說'))
```

CHECK 約束確保這些欄位只能寫入預先定義的合法值，其他任何值都會被資料庫拒絕。這樣前端或 API 就算傳來非預期的資料，資料庫這一層也會擋下來，不會讓髒資料進入系統。

---

### 5.3 Prepared Statements 防 SQL Injection

SQL Injection 是最常見的資料庫攻擊方式。攻擊者在輸入欄位中夾帶惡意的 SQL 語法，試圖操控查詢邏輯。例如在登入頁面的帳號欄位輸入：

```
' OR '1'='1
```

如果後端用字串拼接組成 SQL，查詢就會變成：

```sql
SELECT * FROM users WHERE username = '' OR '1'='1'
```

`'1'='1'` 永遠成立，這個查詢會回傳所有使用者，攻擊者不需要密碼就能登入任何帳號。

本專案所有查詢都使用 Prepared Statements，用 `?` 佔位符取代直接拼接：

```javascript
//  危險：字串拼接
`SELECT * FROM users WHERE username = '${input}'`

// 安全：Prepared Statements
db.prepare('SELECT * FROM users WHERE username = ?').bind(input)
```

使用 `?` 時，使用者輸入的資料以參數形式傳入，資料庫引擎把它當作純粹的「資料」處理，裡面的任何 SQL 語法都不會被執行，徹底杜絕 SQL Injection 攻擊。

## 六.開發遇到的問題

### 問題一：database_id 佔位符錯誤

`wrangler.toml` 中的 `database_id` 欄位預設為佔位符字串，未替換為真實 ID，導致本地執行時找不到資料庫，所有 API 回傳 500 伺服器錯誤。

執行 `npx wrangler d1 create forum-db` 建立 D1 資料庫後，取得真實的 UUID 格式 ID 填入設定檔即可解決。這個問題讓我理解 `wrangler.toml` 的角色：它是整個專案與 Cloudflare 雲端資源之間的對應設定檔，定義了資料庫綁定、專案名稱、部署目錄等所有關鍵資訊，每個欄位都必須正確才能正常運作。

---

### 問題二：binding 名稱不一致

Wrangler 建議的 binding 名稱為 `forum_db`（底線），但程式碼中統一使用 `env.DB`（大寫）。兩者不一致導致執行時 `env.DB` 為 undefined，資料庫操作全部失敗。

在 `wrangler.toml` 的 `[[d1_databases]]` 區塊明確設定 `binding = "DB"` 後解決。這個問題讓我理解 binding 的概念：它是 Cloudflare 將雲端資源注入至 Functions 執行環境的橋樑，`wrangler.toml` 裡宣告的名稱必須與程式碼裡使用的名稱完全一致，差一個字母或大小寫都會失效。

---

### 問題三：Seed 資料重複執行衝突

第一次執行 `seed.sql` 成功後，再次執行時因主鍵 UNIQUE 約束衝突，回報 `UNIQUE constraint failed` 錯誤，無法繼續寫入。

將 seed.sql 中所有的 `INSERT INTO` 改為 `INSERT OR REPLACE INTO` 即可解決。此語法在發生衝突時，會先刪除原有記錄再插入新記錄，讓 seed 檔案可以安全地重複執行而不報錯。

---

### 問題四：JWT 驗證模組無法在 Workers 環境使用

起初嘗試使用 npm 套件 `jsonwebtoken` 處理 JWT，但 Cloudflare Workers 並非 Node.js 環境，無法使用 `require()` 語法，也無法存取 Node.js 內建的 `crypto` 模組，直接導致部署失敗。

改以瀏覽器內建的 Web Crypto API（`crypto.subtle`）手動實作 JWT 的建立與驗證函式，存放於 `functions/utils.js` 供所有 API 引用。這個過程讓我深入理解 JWT 的三段結構（Header.Payload.Signature）以及 HMAC-SHA256 簽章的運作原理，而不是只會呼叫套件。

---

### 問題五：Middleware 攔截導致 401 錯誤

新增個人主頁 API（`GET /api/users/:id`）後，直接在瀏覽器輸入網址測試卻回傳 401 Unauthorized。此 API 設計為公開存取，程式碼中並無任何驗證邏輯，但請求仍被攔截。

透過 F12 DevTools 的 Network 分頁觀察到狀態碼是 401 而非 404。這個差異是關鍵線索：401 代表「找到路由但沒有權限」，404 代表「找不到路由」。確認路由存在後，方向轉向前置處理機制，找到 `_middleware.js` 的白名單未涵蓋 `/api/users/*` 路徑，補上後問題解決。這次除錯讓我學會從 HTTP 狀態碼縮小問題範圍，避免在錯誤方向浪費時間。

---

### 問題六：GitHub 子目錄部署失敗

專案位於 GitHub Repository 的子目錄 `Midterm_Project_HW/` 下，Cloudflare Pages 的 GitHub 自動整合預設從 Repository 根目錄尋找 `public/` 資料夾，找不到時建置失敗。

改採 Wrangler CLI 的手動部署指令 `npx wrangler pages deploy public`，在本地端的 `Midterm_Project_HW/` 目錄執行，直接將 `public/` 資料夾推送至 Cloudflare Pages，完全繞過 GitHub 自動整合的限制。之後每次更新程式碼，只需重新執行此指令即可更新線上版本。

---

### 問題七：敏感資訊管理（JWT_SECRET）

`JWT_SECRET` 是簽署所有使用者 Token 的密鑰，若直接寫入 `wrangler.toml` 並推上 GitHub，密鑰將永久暴露在公開的版本控制歷史中，任何人都能偽造 Token。

本地開發改用 `.dev.vars` 檔案儲存 `JWT_SECRET`，並加入 `.gitignore` 確保不被 Git 追蹤。線上環境則在 Cloudflare Dashboard 的 Environment Variables 手動設定，密鑰存放於 Cloudflare 的加密儲存中，不會出現在任何程式碼或設定檔裡。這個問題讓我理解敏感資訊管理的基本原則：密鑰絕對不能出現在版本控制系統中。

## 七.可擴充功能
我認為這份專案還有可提升的地方，其中最重要功能的就是「**圖片上傳功能**」。

### 功能需求背景

在榮耀遊戲論壇的使用情境中，純文字的發文功能存在明顯的限制。玩家在分享周本 BOSS 站位、地圖跑法、裝備屬性比較或技能連段示意時，圖片的表達效率遠高於文字描述。

###  真正的圖片上傳：技術難點

**儲存層問題：** 關聯式資料庫並不適合儲存二進位檔案。圖片若直接以 Base64 編碼存入資料庫，單張圖片的大小可能是原始檔案的 1.33 倍，且每次查詢都需要傳輸大量不必要的資料。正確的做法是將圖片儲存在 Cloudflare R2 物件儲存服務中，但需要額外建立 bucket、設定 CORS 政策、處理存取權限，對初學者而言設定門檻較高。

**後端處理問題：** 接收圖片上傳需要處理 `multipart/form-data` 格式的 HTTP 請求，與一般 JSON API 的處理方式完全不同。後端需要解析二進位串流、驗證檔案類型、限制檔案大小、產生唯一的檔案名稱，每一個步驟都需要額外的程式邏輯。

**安全性問題：** 開放圖片上傳必然伴隨安全風險。完整的圖片上傳功能需要實作副檔名白名單、MIME type 驗證、檔案大小上限，以及速率限制，這些安全措施實作複雜度遠超過本專案範疇。

### 折衷方案：Markdown 語法支援

一個常見的折衷方案是引入 Markdown 語法，讓使用者以 `![說明](圖片網址)` 的方式嵌入圖片，前端使用 `marked.js` 套件轉換顯示。然而此方案存在以下缺點：

- **對一般使用者不友善：** Markdown 是專為技術寫作者設計的標記語言，要求一般玩家學習並靈活運用各種語法並不現實
- **圖片儲存責任轉移給使用者：** 使用者需自行上傳至圖床並取得公開網址，流程繁瑣
- **圖片持久性無法保障：** 若圖床服務關閉或使用者刪除帳號，論壇內的圖片將全數失效

### 理想的未來實作方向

前端使用富文本編輯器（如 Quill.js）取代純文字輸入框；圖片上傳至 Cloudflare R2；後端新增 `/api/upload` 端點接收圖片並回傳公開網址。
