"use client";

import { FormEvent, useState } from "react";
import styles from "./ai-toolbox.module.css";
import { toolNames } from "./tools";

// 工具許願池
//
// 讓大家說出「希望有什麼工具」，作為之後決定要開發哪些工具的依據。
//
// 許願分成三種類型，而不是「工具／功能」與「新增／修改」兩組選擇——
// 兩組交叉會出現「新增工具又要修改」這種無效組合，合併成一個維度後
// 每個選項都對應一種明確情況，也才知道要不要追問是針對哪個工具。
//
// 目前沒有後端，新許願只存在於當前瀏覽階段的 React state，重新整理頁面就會
// 消失——做法與共學牆的留言區一致（見 feature/wall-page 的 CommentSection）。
// 之後接上資料庫時，改成寫入後端並讀取真實的敲碗數即可。
//
// TODO（待負責人確認）：許願要不要限定登入後才能送出？敲碗數要不要做成
// 可即時投票？這兩題會影響要不要接 Auth，先標註不自行決定。

type WishKindId = "new-tool" | "new-feature" | "improve";

type WishKind = {
  id: WishKindId;
  label: string;
  hint: string;
  needsTool: boolean;
};

const wishKinds: WishKind[] = [
  {
    id: "new-tool",
    label: "想要新工具",
    hint: "現在工具箱裡完全沒有的東西。",
    needsTool: false,
  },
  {
    id: "new-feature",
    label: "現有工具加功能",
    hint: "工具在，但少了你需要的某個能力。",
    needsTool: true,
  },
  {
    id: "improve",
    label: "現有功能想改進",
    hint: "功能有，但用起來不順或結果不夠好。",
    needsTool: true,
  },
];

type Wish = {
  id: string;
  kind: WishKindId;
  tool?: string;
  text: string;
  votes: number;
  meta: string;
};

// 展示用的既有許願，之後改為從資料庫讀取
const seedWishes: Wish[] = [
  {
    id: "seed-1",
    kind: "new-tool",
    text: "希望有工具可以幫我看程式碼哪裡錯，還要說明為什麼錯。",
    votes: 18,
    meta: "阿哲 · 3 天前",
  },
  {
    id: "seed-2",
    kind: "new-feature",
    tool: "報告小幫手",
    text: "希望可以直接吃 PDF，不用自己先複製貼上。",
    votes: 14,
    meta: "小魚 · 5 天前",
  },
  {
    id: "seed-3",
    kind: "improve",
    tool: "履歷健檢",
    text: "建議可以再具體一點，現在有些回饋看完還是不知道怎麼改。",
    votes: 11,
    meta: "Yuting · 上週",
  },
];

const kindLabel = (id: WishKindId) =>
  wishKinds.find((kind) => kind.id === id)?.label ?? "";

export function WishPool() {
  const [kind, setKind] = useState<WishKindId>("new-tool");
  const [tool, setTool] = useState(toolNames[0]);
  const [draft, setDraft] = useState("");
  const [nickname, setNickname] = useState("");
  const [wishes, setWishes] = useState<Wish[]>(seedWishes);
  const [justSent, setJustSent] = useState(false);

  const selectedKind =
    wishKinds.find((item) => item.id === kind) ?? wishKinds[0];
  const canSubmit = draft.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return; // 空白不可送出（按鈕本身也已 disabled，這裡是防呆）

    setWishes((prev) => [
      {
        id: `local-${prev.length}`,
        kind,
        tool: selectedKind.needsTool ? tool : undefined,
        text,
        votes: 1,
        meta: `${nickname.trim() || "匿名"} · 剛剛`,
      },
      ...prev,
    ]);
    setDraft("");
    setJustSent(true);
  }

  return (
    <div className={styles.wishLayout}>
      <form className={styles.wishForm} onSubmit={handleSubmit}>
        <h3>你希望有什麼工具？</h3>
        <p>
          想到什麼都可以說，不用寫得很完整。我們會把大家敲碗最多的需求，排進接下來的開發順序。
        </p>

        <fieldset className={styles.wishFieldset}>
          <legend>這是哪一種許願</legend>
          <div className={styles.wishKinds} data-wish-kinds>
            {wishKinds.map((item) => (
              <label
                className={styles.wishKind}
                key={item.id}
                data-needs-tool={item.needsTool ? "true" : "false"}
              >
                <input
                  type="radio"
                  name="wish-kind"
                  value={item.id}
                  data-hint={item.hint}
                  checked={kind === item.id}
                  onChange={() => {
                    setKind(item.id);
                    setJustSent(false);
                  }}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <p className={styles.wishHint}>{selectedKind.hint}</p>
        </fieldset>

        {/* 只有「針對現有工具」的許願才需要指定是哪一個 */}
        <div
          className={styles.wishField}
          data-tool-picker
          hidden={!selectedKind.needsTool}
        >
          <label htmlFor="wish-tool">針對哪個工具</label>
          <select
            id="wish-tool"
            className={styles.wishSelect}
            name="tool"
            value={tool}
            onChange={(event) => setTool(event.target.value)}
          >
            {toolNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.wishField}>
          <label htmlFor="wish-input">許願內容</label>
          <textarea
            id="wish-input"
            className={styles.wishInput}
            name="wish"
            placeholder="例如：希望有工具可以幫我把訪談逐字稿整理成重點。"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setJustSent(false);
            }}
          />
        </div>

        <div className={styles.wishField}>
          <label htmlFor="wish-nickname">你的暱稱（選填）</label>
          <input
            id="wish-nickname"
            className={styles.wishText}
            name="nickname"
            type="text"
            placeholder="例如：小布"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
        </div>

        <button className={styles.wishSubmit} type="submit" disabled={!canSubmit}>
          送出許願
        </button>

        <p className={styles.wishNote} aria-live="polite">
          {justSent
            ? "收到了！你的許願已經加到右邊的清單（目前為展示版，重新整理就會消失）。"
            : "目前為展示版，不會儲存或傳送你填的內容。"}
        </p>
      </form>

      <div className={styles.wishListWrap}>
        <h3>大家正在敲碗</h3>
        <ul className={styles.wishList} data-wish-list>
          {wishes.map((wish) => (
            <li className={styles.wishItem} key={wish.id}>
              <span className={styles.wishVotes} aria-label={`${wish.votes} 人敲碗`}>
                {wish.votes}
              </span>
              <div className={styles.wishBody}>
                <p className={styles.wishTags}>
                  <span className={`${styles.wishTag} ${styles[wish.kind]}`}>
                    {kindLabel(wish.kind)}
                  </span>
                  {wish.tool ? (
                    <span className={styles.wishTool}>{wish.tool}</span>
                  ) : null}
                </p>
                <p className={styles.wishContent}>{wish.text}</p>
                <p className={styles.wishMeta}>{wish.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
