# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

> 以上區塊由 Next.js 16.2+ 的 `create-next-app` 自動生成，用途是提醒 AI agent 這個框架版本可能跟訓練資料中的舊版寫法不同，動手寫 Next.js 相關程式碼前，請先查閱 `node_modules/next/dist/docs/` 裡版本對應的官方文件。之後升級 Next.js 版本時，`next dev` 會自動維護、更新這個 block，不需要手動改動。

---

本文件下半部提供給 AI coding agent（Claude Code、Cursor 等）閱讀，說明本專案**前端部分**的架構、慣例與注意事項。**修改程式碼前請先讀完本文件。**

> 本文件目前僅涵蓋前端範疇，後端／資料庫（Supabase）、管理後台等內容之後會另外整理。

---

## 前端技術棧

| 類別 | 技術 |
|---|---|
| 前端框架 | Next.js（App Router） |
| 樣式 | Tailwind CSS |
| 內容格式 | MDX |
| 部署 | Cloudflare（Pages / Workers） |
| 版本控制 | GitHub |
| 分析工具 | GA4 或 Umami（尚未定案） |
| 套件管理 | npm |

> **注意**：Next.js App Router 部署到 Cloudflare Pages/Workers 時，部分 Node.js API 與 SSR 特性可能受 Edge Runtime 限制（通常需搭配 `@cloudflare/next-on-pages` 或 OpenNext 這類轉接工具）。若實作中遇到某個 API route 或 middleware 在本機正常、但懷疑在 Cloudflare 上會有相容性問題，請先標註 TODO 詢問，不要自行更換架構。

---

## 開發指令

> 請依實際 `package.json` 為準，以下為預期指令，若不一致請以專案內實際設定為準：

```bash
npm install        # 安裝依賴
npm run dev         # 啟動開發伺服器
npm run build        # 建置正式版
npm run lint         # 執行 ESLint
npm run format        # 執行 Prettier（若有設定）
```

修改程式碼後，agent 應主動執行 `npm run lint` 確認無誤，再回報完成。

**測試機制目前尚未決定**（單元測試、E2E 測試框架都還沒選定）。在確定之前：
- **不要**自行安裝或設定 Vitest、Jest、Playwright 等測試框架
- 驗證變更是否正確，目前請以「lint 通過」＋「本機 `npm run dev` 手動檢查畫面」為主
- 若任務明顯需要測試覆蓋（例如處理複雜邏輯的 util function），請在 PR 說明中標註「建議之後補測試」，而不是自己決定框架並動手加

---

## 專案結構慣例（Monorepo）

本專案是 **monorepo**：前端、後端、admin panel 會放在同一個 repo 底下的不同 workspace，而不是分開三個 repo。**這對 agent 特別重要**——修改功能時要先確認自己在哪個 workspace 底下，避免把前端邏輯寫進後端 workspace，或反過來。

> 目前 workspace 的確切分法（例如 `apps/web`、`apps/admin`、`packages/*` 之類的命名）尚未定案，agent 實際操作前請先用 `view` 確認 repo 根目錄結構，不要憑本文件假設路徑。本文件之後會補上確切的 workspace 對照表。

前端 workspace 內部慣例：

- `app/`：Next.js App Router 頁面與路由
- `content/daily/YYYY-MM-DD.mdx`：AI 日報，檔名即日期——**為什麼用檔名當日期**：這樣可以直接用檔名判斷「今天的日報是否已經產生過」，不需要額外查資料庫或額外的去重機制
- `content/articles/`、`content/courses/` 等：其他 MDX 內容模組（依實際目錄為準）
- **為什麼用 MDX 而不是純資料庫內容**：文章與日報共用同一套渲染邏輯（同樣是 MDX render pipeline），且 Git 本身就提供內容版本歷史，不用額外做 CMS 版本控制
- 元件命名、資料夾切分請優先依「功能模組」（如文章模組、課程模組）切分，而非技術層（components/utils/hooks）切分——這是因為團隊是依模組而非前後端角色分工，資料夾結構要對應團隊分工方式，方便非工程背景成員也能找到對應功能的檔案

---

## 設計系統（Design Tokens）

修改任何 UI 元件前，請務必套用以下 tokens，不要自行發明新色彩或字重：

**色票**
| 名稱 | Hex |
|---|---|
| Primary | `#6FC1CC` |
| Secondary | `#32738F` |
| Tertiary / Warm | `#F8C0A0` |
| Dark / Onyx | `#0E0E2C` |
| Slate | `#8C8CA1` |
| Dorian | `#ECF1F4` |
| Cloud | `#FAFCFE` |

**字體**：LINE Seed TW（Regular / Bold / ExtraBold）

Figma 是目前的 primary living spec，設計相關疑問應以 Figma 檔案為準，程式中的樣式應盡量與 Figma tokens 對齊。**為什麼要嚴格套用**：Figma 是設計負責人維護的唯一事實來源（single source of truth），程式碼裡的色彩／字重如果和 Figma 不同步，會導致視覺不一致且難以追查是設計改了還是程式碼漏改。

---

## 程式風格

- TypeScript 優先（若專案採用）
- Tailwind class 直接寫在 JSX 上，避免另外寫大量自訂 CSS
- Commit message 建議使用清楚的中／英文皆可，但需說明「做了什麼」而非「改了什麼檔案」
- Pull Request 請附上簡短說明與（若涉及 UI）截圖或 Cloudflare preview link

---

## 團隊背景（agent 應留意的溝通情境）

團隊成員技術程度不一，包含完全沒有寫程式經驗的成員。若 agent 產生的說明、註解或 PR 描述是給 team 內部人員看的，請盡量用淺白語言，避免堆疊術語；純程式碼內部邏輯則不受此限制。

---

## 工作流程與決策權責

本專案的實際開發方式：**每位組員各自負責一個分頁／功能，各自用 agent vibe coding 完成**，視覺細節不用每個決策都先問過再做；等所有分頁都完成後，會有一次**整合階段**統一調整視覺一致性。

因此 agent 的行為原則：

- 遇到設計細節沒有明確規範（例如某個間距、某個次要元件的顏色深淺），**優先用本文件的 design tokens 做出合理判斷並直接實作**，不要為了小細節卡住等回覆——先做出可運作、可視覺呈現的版本比較重要。
- 但如果做出的判斷**明顯偏離** design tokens（例如根本沒有對應的 token 可用、或需要新增一個新的色彩／字重），請在程式碼註解或 PR 說明中簡短記錄「這裡是自行判斷，整合時可能需要調整」，方便整合階段快速抓出需要對齊的地方。
- 產品邏輯層級的不確定（例如某功能要不要串資料、某頁面要不要有登入才能看），才需要真的標註「待確認」交給負責人——這類決策不是靠整合階段能補救的，猜錯了會影響其他分頁的實作方向。
- 目標是：**視覺小出入留到整合階段一次處理，產品／架構層級的不確定才需要即時確認**。