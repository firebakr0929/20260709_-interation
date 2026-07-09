# 生動有趣的地震預警介紹網頁 — 計畫書 (PLAN.md)

## 一、專案概述

**目標**：打造一個專屬一般大眾的「資訊儀表板 + 動畫」風格地震預警介紹網頁，獨立於現有平台，以暗色科幻視覺呈現。

**路徑**：`C:\ai_space\20260709_opencode_and_github\生動有趣的地震預警介紹網頁`

**技術棧**：純前端（HTML5 / CSS3 / Vanilla JS），無需建置工具。

**架構原則**：按職責拆分為多個 JS 模組，避免單一檔案巨集；每個模組透過全域命名空間（`window.App`）註冊，降低耦合。

---

## 二、資訊架構與功能區塊

共 **6 大功能區塊**（對應你選的 1~5, 7），以頁籤（Tab）切換導覽：

### 1. 首頁大廳（Home Dashboard）
- 即時狀態列：模擬測站數、模擬最近事件、系統狀態
- ⚠️ **免責聲明**：所有顯示數據（測站數、事件、模擬器 PGA）均為**教育展示用模擬數據**，非來自中央氣象署之即時觀測資料。頁面底部固定顯示 `本網站為教育展示用途，實際地震資訊請參考交通部中央氣象署官方公告。`
- 地震波 SVG 動畫 header
- 各功能區塊的快速入口卡片（含圖示與一句話描述）
- 臺灣地震環境速覽：板塊示意、每年地震統計數字

### 2. 地震知識科普（Knowledge）
- **板塊運動**：菲律賓海板塊 vs 歐亞大陸板塊示意圖（Canvas 繪製 + 動畫箭頭）
- **P 波 vs S 波**：對比動畫，展示速度差與破壞力差異
- **臺灣地震環境**：
  - 1900 年以來 7 次大規模災害地震統計
  - 過去 10 年災害地震列表（2016 美濃、2018 花蓮、2022 池上、2024 花蓮、2025 大埔）
  - 每日約 100 個地震、每年約 100 個顯著有感地震
- **地震測報中心簡介**：60 人團隊、24 小時輪班、3000 個觀測頻道

### 3. 預警原理互動（EEW Principle）
- **強震即時警報原理**：P 波抵達 → 運算 → S 波抵達前發布警報，圖文化流程
- **現地型 (In-situ)**：2~3 秒反應，盲區小，單站觸發
- **區域型 (Regional)**：8~12 秒反應，盲區較大，多站精算
- **發布時效演進**：30 年前 102 秒 → 現在 7 秒，盲區半徑從 35km → 25km
- **發布管道**：細胞廣播、電視插播、網路推播、App、LINE

### 4. 地震波傳播模擬器（Simulator）
- **Canvas 臺灣地圖**：沿用現有平台之台灣輪廓座標，繪製島嶼、城市節點、震央。此模組使用專屬 `<canvas id="sim-canvas">`，與其他功能區塊的 Canvas 完全隔離。
- **⚠️ 地理座標修正**：城市同時儲存像素位置 (x, y) 與真實經緯度 (lat, lng)。預警時間計算使用 **Haversine 公式** 算真實地理距離 → 物理波速 (km/s) → 秒數，像素距離僅供 Canvas 繪圖，不再作為物理計算依據。
  - **⚠️ Haversine cache 含失效機制**：快取 key 為 `"${epicenterKey}_${cityKey}"`（如 `hualien_taipei`、`custom_taipei`），震央切換或重新點擊自訂位置時自動失效。cache 在 `triggerEarthquake()` 開頭以 `distCache = {}` 清空。
- **像素→經緯度反投影**：自訂震央透過 Canvas 點擊取得像素座標後，使用 Taiwan outline 的 bounding box 做**雙線性插值**近似（緯度 ~21.9°N–25.3°N、經度 ~120.0°E–122.2°E）。精度足以滿足教育展示需求。
- **Retina 處理**：Canvas 初始化時讀取 `devicePixelRatio`，將內部解析度等比放大，避免高 DPI 顯示器模糊。
- **單一 `requestAnimationFrame` 迴圈**：捨棄 `setInterval(50ms)`，改以 `rAF` 配合 delta-time 累積推進 `simTime`，確保邏輯更新與畫面渲染同步。DOM 更新（城市狀態列表）以 throttle（~200ms）批次執行，避免每幀重建。
- **參數控制面板**：
  - 震央選擇（花蓮外海 / 嘉義梅山 / 宜蘭外海 / 台南甲仙 / 自訂點擊）
  - 規模滑桿（M1.0 ~ M9.0）
  - 區域預警延遲滑桿（5~15 秒）
  - 模擬速度（0.5x ~ 3.0x）
- **波傳播動畫**：
  - P 波（青色半透明圓）以 ~6.0 km/s 等比例擴散
  - S 波（紅色半透明圓）以 ~3.5 km/s 等比例擴散
  - 無線廣播訊號（琥珀色虛線）高速擴散，最大半徑 = Canvas 對角線長度（動態計算），無硬編碼 magic number
- **⚠️ 規模對模擬的物理影響**：
  - 規模 M 影響**預估 PGA**（峰值加速度），公式：`PGA = 10^(0.6*M - 1.0) / (R + 10)`，其中 R 為 Haversine 距離 (km)。驗證值：M7.2 震央 R=0 → `10^(4.32-1.0) / 10 = 2089/10 ≈ 209 gal`（shake）；M6.0 震央 R=0 → `398/10 ≈ 40 gal`（alert）；M7.2 R=50km → `2089/60 ≈ 35 gal`（alert）；M7.2 R=100km → `2089/110 ≈ 19 gal`（safe）
  - PGA ≥ 80 gal → 城市狀態為 `shake`（紅）；PGA ≥ 25 gal → `alert`（琥珀）；PGA ≥ 8 gal → `detect`（青）；其餘 `safe`（綠）
  - 規模影響**現地型預警觸發閾值**（M ≥ 4.5 才觸發現地型）
  - ⚠️ **盲區判定統一為動態計算**，不再使用獨立盲區半徑常數。盲區定義：`sArrivalTime ≤ warningReceivedTime`（S 波在預警送達前或同時抵達）。此計算已內含於 cityState 的 warningTime === 0 邏輯，與 PGA 狀態各自獨立、不衝突。
- **城市狀態面板**：
  - 即時顯示各縣市狀態：安全（綠）、P 波偵測（青）、警報（琥珀）、搖晃（紅）
  - 預警秒數倒數、避難窗口時間
  - ⚠️ **所有秒數皆以真實世界秒為單位**（即距離/波速，不受 `simState.speed` 影響），確保教育意義不被倍速扭曲。不受 `simState.speed` 影響）
  - 盲區標示（預警時間 = 0s）
  - 顯示預估 PGA 數值
- **EEW 觸發時間軸**：顯示現地型 vs 區域型警報發布時間點
- **自訂震央邏輯**：自訂點擊時，經由反投影取得近似經緯度，再透過 Haversine 計算與所有城市距離。距離最近城市 ≤ 30km 時對該城市套用現地型預警邏輯；否則所有城市均走區域型預警。

### 5. 歷史災害地震案例（History）
- **時間軸或卡片式瀏覽**，包含以下地震：
  - 1999/9/21 M7.3 集集地震
  - 2016/2/6 M6.6 美濃地震
  - 2018/2/6 M6.2 花蓮地震
  - 2022/9/18 M6.8 池上地震
  - 2024/4/3 M7.1 花蓮地震
  - 2025/1/21 M6.4 大埔地震
- **每張卡片內容**：日期、規模、震央、傷亡損失、照片佔位、教訓與預警相關性
- **可點擊展開**查看詳細說明

### 6. AI 次世代預警展示（AI Agents）
- **代理節點網路圖**：Sensor → Ingestion → EEW / ShakeMap → Advisory → Seismo-LLM
- **觸發按鈕**：啟動模擬，依時間序展示各代理運作
- **即時 Log 日誌**：每個代理的執行細節
- **LLM 報告生成**：模擬 Seismo-LLM 產出地震報告（含震度分布、避難指引）
- **參考連結**：Docker Hub 上的 CWA EEW 系統 (cwadayi/earthworm_ubuntu22.04_eew:v1)

### 7. 問答 Q&A 機器人（Chatbot）
- 對話介面：使用者輸入框 + 對話泡泡
- **⚠️ 意圖匹配改進**：
  - 分層優先級：否定詞優先偵測（「不、沒、不是」等前贅詞 → 排除該意圖）
  - 精準關鍵詞 + 前後文窗口比對，避免「下載速度太慢」誤觸「速度」意圖
  - **confidence 計分機制**：每條意圖定義一組正向關鍵詞與否定關鍵詞。匹配得分 = 命中正向詞數 × 權重 − 命中否定詞數 × 權重，標準化至 [0, 1]。最高分意圖若 ≥ 0.4 則採用，否則 fallback。0.4 為實驗起始值，可於 `chatbot.js` 頂部常量 `CONFIDENCE_THRESHOLD` 調校。
  - 支援同義詞映射表（如「盲區」=「blind zone、預警盲點、躲不掉」）
- 支援關鍵詞：
  - 「盲區」→ 解釋預警盲區
  - 「P 波 / S 波 / 速度」→ 波速與破壞力差異
  - 「AI / 代理 / Agent」→ 次世代 AI 代理介紹
  - 「現地型 / 區域型」→ 兩種預警模式比較
  - 「陳達毅 / 科長」→ 作者介紹
  - 其他 → 友善提示引導

---

## 三、資料來源

**⚠️ 注意**：本專案為教育展示用，所有資料（歷史地震、預警原理、AI Agent 流程）**直接硬編碼於 `data.js`**，來源為現有專案中的兩份簡報 MD 檔案。網頁執行時不 fetch 任何外部檔案，無網路相依性，可離線執行，亦不受 `file://` 協議限制。

| 資料項目 | 原始來源檔案 |
|---------|-------------|
| 地震預警原理、歷史案例、統計數據 | `2026_0612_嘉義災防宣導-臺灣地震預警系統的演進與發展.md` |
| AI 代理、LLM、次世代技術 | `2026_0603_AI 代理群與大型語言模型在次世代地震測報之整合與應用.md` |
| 板塊運動、GNSS 速度場、海嘯警戒分區 | 中央氣象署官網公告 |
| 預警時效演進數據 | 學術參考：Chen et al., 2019; Wu et al., 2011 |
| 地震波速度、Pd 法 | 地震學基礎常識 + CWA 公開說明 |

---

## 四、檔案結構（模組化拆分）

```
生動有趣的地震預警介紹網頁/
├── index.html              # 主入口 HTML（SPA 架構）
│                           # 內含多個 <canvas>：各自獨立 id
│                           #   #home-canvas    (首頁大廳動畫)
│                           #   #knowledge-canvas (知識科普板塊動畫)
│                           #   #principle-canvas (預警原理示意圖)
│                           #   #sim-canvas     (模擬器臺灣地圖)
│                           #   #agents-canvas  (AI 節點網路圖)
│
├── style.css               # 暗色科幻主題樣式
│
├── js/
│   ├── core.js             # 路由/頁籤切換、狀態管理、事件匯流排
│   ├── data.js             # 常數與資料（城市座標、歷史地震、震央預設、波速）
│   ├── simulator.js        # 地震波傳播模擬器（Canvas 繪圖 + 物理運算）
│   ├── knowledge.js        # 地震知識科普（板塊、P/S 波、環境統計）
│   ├── eew-principle.js    # 預警原理互動（現地型 vs 區域型圖解）
│   ├── history.js          # 歷史災害地震案例（時間軸卡片）
│   ├── agents.js           # AI 次世代預警展示（節點網路 + LLM 報告）
│   ├── chatbot.js          # 問答 Q&A 機器人
│   └── utils.js            # 共用工具（Loading spinner、Toast、Haversine 快取）
│
├── PLAN.md                 # 本計畫書
```

**模組載入順序**：`data.js` → `utils.js` → 功能模組（`knowledge.js`、`eew-principle.js`、`simulator.js`、`history.js`、`agents.js`、`chatbot.js`）→ `core.js`（最後初始化路由與頁籤）。

**命名空間**：所有模組掛載至 `window.App`，例如 `App.simulator.start()`、`App.chatbot.respond()`。

---

## 五、資料結構設計

### 5.1 地震歷史案例資料結構
```javascript
const HISTORICAL_EARTHQUAKES = [
  {
    id: '1999-chi-chi',  // ⚠️ 使用連字號 + 無空格，避免 CSS selector 與 querySelector 解析失敗
    date: '1999-09-21',
    title: '集集地震',
    magnitude: 7.3,
    location: '南投縣集集鎮',
    depth: 8.0,
    casualties: 2415,
    injuries: 11305,
    buildings: 51711,
    summary: '此次地震...',
    lesson: '凸顯預警系統...'
  },
  // ...
]

// ⚠️ 欄位完整性：render 時對 casualties / injuries / buildings 等數值欄位做
// ?? '-' 保護；lesson 為空字串 ('') 時隱藏該區塊。
```

### 5.2 模擬器狀態
```javascript
const simState = {
  running: false,
  rafId: null,        // rAF 回傳 ID，供 cancelAnimationFrame 清除
  time: 0,            // 模擬秒數
  speed: 1.0,         // 播放速度倍率
  epicenter: 'hualien',
  epiLat: 23.99,      // 當前震央緯度（自訂震央時由反投影填入）
  epiLng: 121.61,     // 當前震央經度
  magnitude: 7.2,
  regionalDelay: 9.0  // 區域預警延遲秒數
}
```

### 5.3 AI Agent 時間軸（定義於 `agents.js`，非 `data.js`）
```javascript
// ⚠️ delay 為「觸發間隔（ms）」，採相對 delay 累加模式：
// sensor 在 t=500ms → ingestion 在 t=(500+1500)=2000ms → eew 在 t=3500ms → ...
const AGENT_TIMELINE = [
  { delay: 500,  agent: 'sensor',    action: () => { setNodeActive('sensor');    addLog('sensor', '偵測到 P 波'); } },
  { delay: 1500, agent: 'ingestion', action: () => { setNodeActive('ingestion'); addLog('ingestion', '分析數據中'); } },
  { delay: 3000, agent: 'eew',       action: () => { setNodeActive('eew');      addLog('eew', '運算預警參數'); } },
  // ...
]
```

### 5.4 城市資料（含真實經緯度）
```javascript
const CITIES = {
  taipei:    { x: 260, y: 70,  name: '台北', lat: 25.0330,  lng: 121.5654 },
  yilan:     { x: 275, y: 120, name: '宜蘭', lat: 24.7021,  lng: 121.7378 },
  hualien:   { x: 250, y: 220, name: '花蓮', lat: 23.9921,  lng: 121.6070 },
  taichung:  { x: 175, y: 190, name: '台中', lat: 24.1477,  lng: 120.6736 },
  chiayi:    { x: 150, y: 310, name: '嘉義', lat: 23.4811,  lng: 120.4527 },
  tainan:    { x: 140, y: 350, name: '台南', lat: 23.0042,  lng: 120.1861 },
  kaohsiung: { x: 145, y: 400, name: '高雄', lat: 22.6273,  lng: 120.3014 },
  taitung:   { x: 210, y: 380, name: '台東', lat: 22.7549,  lng: 121.1179 }
}

// ⚠️ 預警時間計算流程：lat/lng → Haversine 距離 (km) → 除以波速 (km/s) → 秒數
// 像素 (x, y) 僅作為 Canvas 繪圖定位使用，不參與物理計算。
```

### 5.5 震央預設（含真實經緯度）
```javascript
const EPICENTERS = {
  hualien: { x: 265, y: 220, name: '花蓮外海',   lat: 23.99, lng: 121.85 },
  chiayi:  { x: 150, y: 310, name: '嘉義梅山斷層', lat: 23.55, lng: 120.55 },
  yilan:   { x: 275, y: 120, name: '宜蘭外海',   lat: 24.70, lng: 122.10 },
  tainan:  { x: 140, y: 350, name: '台南甲仙',   lat: 23.10, lng: 120.55 }

// ⚠️ 所有經緯度皆須落在 pixelToLatLng BOUNDS 範圍內：lat [21.9, 25.3], lng [120.0, 122.2]
// 宜蘭外海 lng=122.10 在此範圍內，若調整 BOUNDS 則需同步檢查。
}
```

### 5.6 像素→經緯度反投影（自訂震央用）
```javascript
function pixelToLatLng(px, py, canvasW, canvasH) {
  // Taiwan outline 經緯度邊界
  const BOUNDS = { minLat: 21.9, maxLat: 25.3, minLng: 120.0, maxLng: 122.2 };
  // 線性插值（忽略投影變形，適合教育展示精度）
  const lat = BOUNDS.maxLat - (py / canvasH) * (BOUNDS.maxLat - BOUNDS.minLat);
  const lng = BOUNDS.minLng + (px / canvasW) * (BOUNDS.maxLng - BOUNDS.minLng);
  return { lat, lng };
}
```

---

## 六、邊界條件與錯誤處理

| 情境 | 處理方式 |
|------|---------|
| 模擬器規模 < 1 或 > 9 | 滑桿限制 min=1, max=9，無效值自動糾正 |
| 模擬器時間超過 30 秒 | 自動停止模擬，顯示「地震波已完全通過」 |
| 自訂震央點擊到台灣範圍外 | 限制點擊區域在 canvas 範圍內，超出則忽略 |
| 資料載入失敗 | 所有資料硬編碼於 `data.js`，無外部相依，此情境不存在 |
| 瀏覽器不支援 SpeechSynthesis | **TTS 按鈕只在首次使用者互動（點擊/觸碰）後才啟用**；若 `speechSynthesis` 回傳空語系列表，按鈕顯示為禁用狀態並帶 tooltip 說明 |
| Canvas 不支援 | 顯示 fallback 提示 |
| Chatbot 無匹配回答（confidence < 0.4） | 回覆友善提示，引導詢問已知關鍵詞 |
| 頁籤切換時模擬器仍在執行 | **完全重置**：呼叫 `resetEarthquake()` → `cancelAnimationFrame(simState.rafId)`、`simState.rafId = null`、重置 `simTime`、復原按鈕狀態。模擬器不支援切 tab 後 resume，避免狀態混亂 |
| 模擬器在**瀏覽器分頁/視窗**被隱藏時 | 使用 `document.hidden`（Page Visibility API）**暫停** `rAF`（`cancelAnimationFrame` + 記錄時間戳），分頁恢復 visible 時續跑。此機制與上方的頁籤切換 reset 不衝突：同一頁面內換功能 ＝ reset；切到其他瀏覽器分頁再回來 ＝ pause/resume |
| 非模擬器 Canvas 動畫（knowledge、principle、home）在頁籤切換時 | 每個模組實作 `activate()` / `deactivate()` 生命週期。`core.js` 在頁籤切換時：呼叫舊模組的 `deactivate()`（停止該模組的 rAF、清除 interval）、再呼叫新模組的 `activate()`。所有 Canvas 動畫模組統一遵循此契約，無例外 |
| 螢幕尺寸 < 480px | RWD 調整為單欄佈局，觸控友善 |
| 主題切換狀態持久化 | 使用 `localStorage.setItem('theme', 'dark'|'light')`，**頁面載入時在 `<script>` 最頂端同步讀取**，避免 flash of unstyled content（FOUC） |
| `file://` 協定直接瀏覽 | 本專案所有資料硬編碼於 `data.js`，**無 `fetch()` 呼叫**，可直接從檔案總管雙擊開啟，無需 HTTP server |
| Haversine 每幀重複計算 | 快取機制：震央不變時，各城市到震央的距離在 `triggerEarthquake()` 時一次性計算並存入 `distCache = {}`，模擬進行中不再重新計算 |
| 規模滑桿調整時模擬已觸發 | **不鎖定**：模擬進行中允許調整規模，每次 input 事件即時重算各城市的 PGA 與對應狀態。速度與波傳動畫不受影響。震央滑桿同理即時反應 |
| 歷史地震資料欄位缺失 | 渲染時 `casualties ?? '-'` 保護；`lesson` 為空字串 `''` 時隱藏該區塊 |

---

## 七、使用者體驗流程

```
使用者進入首頁大廳
  ├─ 看到動態地震波 header + 即時狀態
  ├─ 點擊「地震知識科普」→ 學習板塊/P波S波/臺灣環境
  ├─ 點擊「預警原理互動」→ 觀看現地型 vs 區域型動畫解說
  ├─ 點擊「地震波傳播模擬器」→ 調整參數、觸發地震、觀看波擴散與城市預警
  ├─ 點擊「歷史災害地震案例」→ 瀏覽時間軸、點擊展開詳細
  ├─ 點擊「AI 次世代預警」→ 啟動模擬、觀看代理協作流程
  └─ 點擊「Q&A 機器人」→ 輸入問題、獲得回答
```

---

## 八、開發順序

1. **專案初始化**：建立目錄結構 `js/`、`index.html`（內含 5 個 Canvas）、`style.css`、空模組檔
2. **共用層 `data.js` + `utils.js`**：城市經緯度資料、Haversine 快取 wrapper、震央經緯度、歷史地震陣列、Loading spinner 元件
3. **路由層 `core.js`**：頁籤切換、每個模組的 `activate()`/`deactivate()` 生命週期、主題 `localStorage` 持久化 + 防 FOUC
4. **首頁大廳**：Hero header + 快速入口卡片 + 狀態列
5. **地震知識科普 `knowledge.js`**：板塊示意圖、P/S 波動畫、統計數據展示
6. **預警原理互動 `eew-principle.js`**：現地型 vs 區域型流程圖解、發布管道示意
7. **地震波傳播模擬器 `simulator.js`**：Canvas 地圖 + Retina 支援 + 單一 `rAF` 迴圈 + Haversine 快取 + PGA 計算 + 城市狀態面板 + 自訂震央反投影 + 規模物理效應
8. **歷史災害地震案例 `history.js`**：時間軸卡片 + 展開詳細資料 + 欄位缺失保護
9. **AI 次世代預警展示 `agents.js`**：節點網路圖 + 時間序模擬（action 為 callback 模式）+ Log + LLM 報告
10. **Q&A 機器人 `chatbot.js`**：對話介面 + 權重計分意圖匹配 + 否定詞過濾 + 可調 threshold
11. **邊界條件與錯誤處理**：Page Visibility API 整合、TTS 降級偵測、模擬中規模即時重算
12. **RWD 響應式調校**：手機/平板/桌面適配
13. **測試**：見下方第十一章

---

## 九、現有專案可沿用資源

- **臺灣輪廓座標**：`TAIWAN_OUTLINE` 陣列
- **城市像素座標**：基於現有 `CITIES` 物件（需擴增 lat/lng）
- **震央預設**：`EPICENTERS` 物件（需擴增 lat/lng）
- **P/S 波物理速度**：`~6.0 km/s` / `~3.5 km/s`（不再是 px/s，改用 km/s 搭配 Haversine）
- **AI Agent 階段式執行模式**：參考 `runAgentStage()` 的 `setTimeout` 鏈式呼叫設計，但 `action` 需使用 callback 函數而非字串
- **聊天機器人匹配模式**：參考 `getChatResponse()` 的關鍵詞匹配理念，但需升級為權重計分 + 否定詞過濾，不再使用 `String.includes()`
- **暗色科幻主題色系**：`--bg: #0a0e1a`, `--card: #121827`, `--accent: #ff6b35`, `--accent2: #00d4ff`

---

## 十、無障礙設計（Accessibility）

### 10.1 色彩替代標示
- 城市狀態以顏色編碼時，**同步附加文字標籤**：`<span class="city-status" style="color: ...">● 搖晃中</span>`，不依賴單一色彩傳達資訊。
- 符合 WCAG 2.1 AA 色彩對比度標準。

### 10.2 Canvas 替代內容
- 每個 `<canvas>` 元素附加 `role="img"` 與 `aria-label`（如 `aria-label="臺灣地圖地震波傳播模擬動畫"`）。
- 動態變化的城市狀態列表以 HTML 文字形式存在於 Canvas 之外，可供螢幕閱讀器讀取。

### 10.3 鍵盤操作
- 主要操作（觸發地震、切換頁籤、問答輸入）均支援鍵盤（Tab 導航 + Enter 觸發）。
- 滑桿支援鍵盤左右方向鍵控制。

### 10.4 模擬器震動提示
- 搖晃狀態的城市名稱前附加 `aria-live="polite"` 區域，當城市從 `alert` 轉為 `shake` 時螢幕閱讀器會自動朗讀。

---

## 十一、測試策略

本專案無自動化測試 runner，採**手動測試清單 + 瀏覽器開發者工具驗證**。

### 11.1 模擬器正確性驗證（每次修改後執行）
| # | 測試項目 | 預期結果 | 驗證方式 |
|---|---------|---------|---------|
| 1 | 花蓮外海 M7.2 觸發 | P 波先抵達台北、S 波隨後；花蓮縣顯示盲區 | 看城市面板秒數 ≤ 0 |
| 2 | 規模調至 M3.0 觸發 | 所有城市維持 `safe`，無警報 | 城市面板全綠 |
| 3 | 規模調至 M6.0 觸發 | 近震央城市進入 `alert`，遠距城市 `safe` | 觀察顏色變化 |
| 4 | 自訂震央點擊台東外海 | 台東市顯示現地型預警（若距離 ≤ 30km） | 城市面板顯示預警秒數 |
| 5 | 模擬速度調至 3x | 波速明顯加快，時間軸加速 | 肉眼觀察動畫速度 |
| 6 | 模擬進行中切到歷史頁籤 | 模擬完全重置、按鈕恢復可點擊、城市面板全綠 | 切回模擬器確認所有狀態歸零 |
| 7 | 模擬進行中切到其他瀏覽器分頁再回來 | 模擬暫停，返回後續跑 | 時間數字停滯後繼續 |

### 11.2 Chatbot 邊界案例
| # | 輸入 | 預期回覆 |
|---|------|---------|
| 1 | 「什麼是盲區」 | 正確回覆盲區解釋 |
| 2 | 「沒有盲區吧」 | 否定詞過濾，不觸發盲區意圖，fallback 友善提示 |
| 3 | 「下載速度太慢」 | 不誤觸「速度」意圖，fallback 友善提示 |
| 4 | 「」空字串送出 | 忽略，不發送請求 |

### 11.3 Canvas 與 Retina
| # | 測試項目 | 預期結果 |
|---|---------|---------|
| 1 | 150% 縮放 Windows 顯示器 | Canvas 文字與線條不模糊 |
| 2 | MacBook Retina 螢幕 | Canvas 解析度正確反映 devicePixelRatio |
| 3 | Canvas 不支援（模擬 `HTMLCanvasElement` 為 null） | 顯示 fallback 文字提示 |

### 11.4 跨瀏覽器基本驗證
- Chrome / Edge / Firefox / Samsung Internet 各跑一次流程，確認無 JS Error。
- 螢幕旋轉（手機）：佈局不破裂，Canvas 重新計算尺寸。

### 11.5 回歸檢查清單
每次 PR（合併）前手動完整跑一次上述清單，任何一項失敗即需修正後再合併。
