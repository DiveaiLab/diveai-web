import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// 讓 `next dev`（一般開發指令，跑在 Node.js，不是 Cloudflare Worker）也能讀
// 到 wrangler.jsonc 裡設定的 D1／R2 binding（本機用 wrangler 的本地模擬資料，
// 不會動到雲端真正的資料庫）。開發階段用 API route 裡的 getCloudflareContext()
// 才拿得到這些 binding，這行只是啟動時的初始化，不用 await。
//
// 只在真的跑 `npm run dev` 時才呼叫：next.config.ts 也會被 eslint-config-next
// （檢查專案設定用）跟 build 流程載入，這兩種情境不需要、也不應該啟動本機
// wrangler 模擬環境——實測發現不加這個判斷，`npm run lint` 會被這行拖慢到
// 兩三分鐘（wrangler 在背後嘗試啟動本地代理），加了判斷之後就恢復正常速度。
if (process.env.npm_lifecycle_event === "dev") {
  void initOpenNextCloudflareForDev();
}
