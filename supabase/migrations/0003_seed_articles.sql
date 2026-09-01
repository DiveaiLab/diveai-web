-- 把原本 app/lib/wall/mock-posts.ts 裡的 17 篇假資料匯入 articles 表，
-- 讓改接 Supabase 後前台還是有內容可以看，不用從空的開始。到 Supabase
-- 的 SQL editor 貼上整段執行即可（在 0001_articles.sql 之後執行）。
insert into public.articles
  (kind, title, body_md, cover_url, links, scene, tech_tags, author_name, author_avatar_url, like_count, status, created_at)
values
  ('project', '從零打造一個個人記帳網站', '第一次嘗試獨立完成一個全端專案，用 HTML/CSS/JS 加上簡單的後端 API，記錄每天的收支並畫出圖表。

## 我原本的程度

只會寫基本的 HTML 和 CSS，沒寫過任何 JavaScript 邏輯，也沒碰過後端。

## 花了多久

大約花了 3 週，每天下班後投入 1-2 小時。

## 卡在哪、怎麼解決

卡在前後端資料串接一直失敗，後來發現是 CORS 設定沒開，查了官方文件加上一行設定就解決了。', 'https://picsum.photos/seed/wall1/400/240', '[{"label":"GitHub Repo","url":"https://github.com/example/budget-app"},{"label":"線上 Demo","url":"https://example.com/budget-demo"}]'::jsonb, ARRAY['職涯', '日常']::text[], ARRAY['JavaScript', 'API 串接', 'CORS']::text[], '小美', 'https://i.pravatar.cc/64?img=1', 12, 'published', '2026-06-10'),
  ('project', '校內黑客松：從發想到上台簡報', '紀錄一次校內黑客松三天內從零做出一個 MVP 的完整過程，包含分工、踩雷與最後的簡報準備。

## 我原本的程度

有寫過幾個小專案，但沒有團隊協作跟時間壓力下開發的經驗。

## 花了多久

三天兩夜，幾乎全程投入。

## 卡在哪、怎麼解決

卡在團隊分工混亂導致進度落後，後來改用每 4 小時一次的站立會議同步進度才追上。', 'https://picsum.photos/seed/wall2/400/240', '[{"label":"簡報投影片","url":"https://example.com/hackathon-slides"}]'::jsonb, ARRAY['課業', '職涯']::text[], ARRAY['專案管理', '網站開發']::text[], '小凱', 'https://i.pravatar.cc/64?img=5', 20, 'published', '2026-07-01'),
  ('project', '用 Notion API 做課程進度儀表板', '串接 Notion API，把散落在各科作業清單自動整理成一個每週進度儀表板，不用再手動更新表格。

## 我原本的程度

會寫基本的 JavaScript，但沒串接過任何第三方 API。

## 花了多久

斷斷續續花了 10 天左右。

## 卡在哪、怎麼解決

卡在 Notion API 的分頁機制一直漏抓資料，後來照著官方文件把 pagination 邏輯補齊才修好。', 'https://picsum.photos/seed/wall3/400/240', '[{"label":"專案介紹","url":"https://example.com/notion-dashboard"}]'::jsonb, ARRAY['課業']::text[], ARRAY['Notion AI', 'API 串接', 'JavaScript']::text[], '阿仁', 'https://i.pravatar.cc/64?img=7', 6, 'published', '2026-06-20'),
  ('project', '打造社團官網並串接報名表單', '幫系學會做了一個簡單的官網，串接 Google Form 當作活動報名表單，並自動同步到試算表。

## 我原本的程度

會用網頁模板工具，但沒自己寫過完整的網站。

## 花了多久

大約 2 週，主要是社課空檔時間。

## 卡在哪、怎麼解決

卡在手機版排版一直跑掉，後來改用 Flexbox 重寫版面才解決。', 'https://picsum.photos/seed/wall4/400/240', '[{"label":"官網連結","url":"https://example.com/club-site"},{"label":"開發筆記","url":"https://example.com/club-site-notes"}]'::jsonb, ARRAY['實習', '日常']::text[], ARRAY['網站開發', 'API 串接']::text[], '小雨', 'https://i.pravatar.cc/64?img=9', 15, 'published', '2026-07-10'),
  ('project', '重現一個經典小遊戲練手感', '純粹想練習遊戲迴圈跟碰撞判斷的邏輯，用 Canvas 重現了一款經典小遊戲。

## 我原本的程度

上過一學期程式入門課，沒寫過需要處理動畫與碰撞的邏輯。

## 花了多久

一個週末，大約 8 小時。

## 卡在哪、怎麼解決

卡在畫面會閃爍，後來才知道要用 requestAnimationFrame 取代 setInterval 才順。', '', '[]'::jsonb, ARRAY['日常']::text[], ARRAY['JavaScript', '演算法']::text[], '阿凱', 'https://i.pravatar.cc/64?img=11', 3, 'published', '2026-05-15'),
  ('agent', '用 AI Agent 自動整理讀書筆記', '串接筆記軟體與 LLM API，自動幫每天讀的文章整理成摘要，省下手動整理的時間。

## 我原本的程度

有基本的 Python 能力，但沒寫過 agent 相關的程式。

## 花了多久

大約 2 週，主要是晚上的零碎時間。

## 卡在哪、怎麼解決

卡在 API 呼叫額度限制，後來改成先分段摘要、再彙整總結才解決。', 'https://picsum.photos/seed/wall6/400/240', '[{"label":"專案筆記","url":"https://example.com/note-agent"}]'::jsonb, ARRAY['實習']::text[], ARRAY['LLM', 'Agent 開發', '自動化流程']::text[], '小華', 'https://i.pravatar.cc/64?img=3', 9, 'published', '2026-07-20'),
  ('agent', '打造一個自動整理讀書會逐字稿的 Agent', '用 LLM API 串接語音轉文字結果，自動幫讀書會產出重點摘要與待辦事項。

## 我原本的程度

會寫基本的 Python，但沒接過任何 LLM API，也不知道 prompt 要怎麼設計。

## 花了多久

大約 2 週，主要是晚上跟週末的零碎時間。

## 卡在哪、怎麼解決

卡在逐字稿太長會超過 token 上限，後來改成先分段摘要、再彙整成總結才解決。', 'https://picsum.photos/seed/wall7/400/240', '[{"label":"使用心得","url":"https://example.com/agent-notes"}]'::jsonb, ARRAY['實習', '日常']::text[], ARRAY['LLM', 'Agent 開發', '自動化流程']::text[], '小葉', 'https://i.pravatar.cc/64?img=8', 8, 'published', '2026-07-15'),
  ('agent', '用 Agent 自動生成每週讀書會摘要信件', '把讀書會逐字稿摘要串接成每週固定寄出的信件，省下手動整理跟轉寄的時間。

## 我原本的程度

會寫基本的 Python，串過一次簡單的 API，但沒寄過信件自動化。

## 花了多久

大約 1 週。

## 卡在哪、怎麼解決

卡在寄信服務的每日額度限制，後來改成分批寄送才解決。', 'https://picsum.photos/seed/wall11/400/240', '[{"label":"使用心得","url":"https://example.com/agent-mail-notes"}]'::jsonb, ARRAY['日常']::text[], ARRAY['Agent 開發', '自動化流程', '內容整理']::text[], '阿廷', 'https://i.pravatar.cc/64?img=15', 4, 'published', '2026-06-05'),
  ('agent', '打造一個自動偵測作業截止日的提醒 Agent', '串接課程平台的作業列表，自動在截止前一天提醒，避免忘記交作業。

## 我原本的程度

會寫基本的 JavaScript，但沒寫過排程相關的程式。

## 花了多久

大約 1.5 週。

## 卡在哪、怎麼解決

卡在時區換算一直算錯提醒時間，後來統一改用 UTC 儲存才解決。', 'https://picsum.photos/seed/wall12/400/240', '[]'::jsonb, ARRAY['課業']::text[], ARRAY['Agent 開發', '自動化流程']::text[], '阿哲', 'https://i.pravatar.cc/64?img=17', 7, 'published', '2026-06-18'),
  ('agent', '用 Agent 幫忙整理課堂錄音逐字稿重點', '把課堂錄音轉成逐字稿後，用 LLM 抓出重點跟待辦事項，複習更有效率。

## 我原本的程度

有基本的 Python 能力，沒處理過語音轉文字的資料。

## 花了多久

大約 2 週，主要是週末時間。

## 卡在哪、怎麼解決

卡在逐字稿有很多口語贅字影響摘要品質，後來加了一個前處理步驟過濾掉才改善。', '', '[{"label":"專案筆記","url":"https://example.com/lecture-agent-notes"}]'::jsonb, ARRAY['課業', '日常']::text[], ARRAY['LLM', 'Python', 'Agent 開發']::text[], '小庭', 'https://i.pravatar.cc/64?img=19', 3, 'published', '2026-05-20'),
  ('note', '學習筆記：理解遞迴的三個階段', '整理自己學習遞迴時的心得，從看不懂、硬背、到真正理解的過程。

## 我原本的程度

完全不懂遞迴，看到程式碼會頭暈。

## 花了多久

斷斷續續花了 2 個月才真正理解。

## 卡在哪、怎麼解決

一直卡在不知道遞迴什麼時候會結束，後來用畫圖追蹤呼叫堆疊的方式，才終於想通。', '', '[{"label":"參考文章","url":"https://example.com/recursion-guide"}]'::jsonb, ARRAY['課業']::text[], ARRAY['演算法', '讀書會筆記']::text[], '阿強', '', 5, 'published', '2026-05-02'),
  ('note', '讀書會筆記：LLM 微調的核心概念', '這週讀書會討論 LLM fine-tuning 的基本概念，整理成筆記給沒來的夥伴補課用。

## 我原本的程度

知道 LLM 是什麼，但完全不懂 fine-tuning 跟 prompt engineering 的差別。

## 花了多久

讀書會 2 小時 + 自己整理筆記 1 小時。

## 卡在哪、怎麼解決

卡在分不清 fine-tuning 跟 RAG 的使用時機，後來畫了一張比較表才釐清。', 'https://picsum.photos/seed/wall9/400/240', '[{"label":"投影片","url":"https://example.com/finetune-slides"}]'::jsonb, ARRAY['課業', '職涯']::text[], ARRAY['LLM', 'Fine-tuning', '讀書會筆記']::text[], '小婷', 'https://i.pravatar.cc/64?img=13', 11, 'published', '2026-07-02'),
  ('note', '讀書會筆記：Prompt Engineering 常見誤區', '整理這週讀書會討論的幾個常見 prompt 設計誤區，附上修正前後的對照範例。

## 我原本的程度

會用 ChatGPT，但沒有系統性想過 prompt 設計的原則。

## 花了多久

讀書會 2 小時 + 整理筆記 1 小時。

## 卡在哪、怎麼解決

卡在不知道怎麼判斷 prompt 是不是「太模糊」，後來用「拆解成步驟」的方式練習才有感。', 'https://picsum.photos/seed/wall14/400/240', '[{"label":"對照範例文件","url":"https://example.com/prompt-pitfalls"}]'::jsonb, ARRAY['課業']::text[], ARRAY['Prompt Engineering', 'ChatGPT', '讀書會筆記']::text[], '阿廷', 'https://i.pravatar.cc/64?img=21', 6, 'published', '2026-04-10'),
  ('note', '讀書會筆記：RAG 系統的資料前處理眉角', '這週讀書會聚焦在 RAG 的資料前處理環節，整理常見的切塊策略跟踩雷點。

## 我原本的程度

知道 RAG 的基本流程，但沒實際處理過真實文件的切塊。

## 花了多久

讀書會 2 小時 + 自己再讀相關文章 1 小時。

## 卡在哪、怎麼解決

卡在切塊大小抓不準，太大檢索不準、太小失去上下文，後來抓中間值搭配重疊視窗才改善。', 'https://picsum.photos/seed/wall15/400/240', '[{"label":"投影片","url":"https://example.com/rag-preprocess-slides"}]'::jsonb, ARRAY['職涯']::text[], ARRAY['RAG', '資料處理', '讀書會筆記']::text[], '阿哲', 'https://i.pravatar.cc/64?img=23', 9, 'published', '2026-06-25'),
  ('note', '讀書會筆記：如何評估 LLM 輸出品質', '整理讀書會討論的幾種 LLM 輸出評估方法，從人工評分到自動化指標都有涵蓋。

## 我原本的程度

知道要評估輸出品質，但不知道有哪些具體的做法可以參考。

## 花了多久

讀書會 2 小時。

## 卡在哪、怎麼解決

卡在自動化指標跟實際體感常常對不上，後來理解要搭配少量人工抽樣才踏實。', 'https://picsum.photos/seed/wall16/400/240', '[]'::jsonb, ARRAY['課業', '職涯']::text[], ARRAY['LLM', '讀書會筆記']::text[], '小凱', 'https://i.pravatar.cc/64?img=25', 5, 'published', '2026-07-20'),
  ('note', '（草稿）還沒寫完的實習心得', '這篇故意設成草稿狀態，用來測試前台列表是否正確排除未發布的文章。', '', '[]'::jsonb, ARRAY['實習']::text[], ARRAY['讀書會筆記']::text[], '測試用作者', '', 0, 'draft', '2026-08-04');
