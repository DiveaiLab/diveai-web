"use client";

import { FormEvent, useState } from "react";
import styles from "./SubscribeSection.module.css";

export function SubscribeSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <div id="subscribe" className={styles.subscribe} aria-labelledby="subscribe-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>DIVEAI LETTER</p>
        <h2 id="subscribe-title">訂閱 DiveAI Letter</h2>
        <p>收到 DiveAI 整理的 AI 日報與學習資訊，不必自己追完所有消息。</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email">Email</label>
        <div className={styles.fields}>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            onChange={() => setIsSubmitted(false)}
          />
          <button type="submit">立即訂閱</button>
        </div>
        <p className={styles.note} aria-live="polite">
          {isSubmitted
            ? "訂閱成功！正式寄送功能上線後，我們會在這裡與你見面。"
            : "目前為展示版，不會儲存或傳送你的 Email。"}
        </p>
      </form>
    </div>
  );
}
