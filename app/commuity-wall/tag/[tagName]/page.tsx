import TagOverviewClient from "../../components/TagOverviewClient";

// Next.js 16：params 是 Promise，需在 Server Component 裡 await 後再往下傳給
// Client Component。
//
// 實測發現這個版本的動態路由片段（tagName）並不會自動做 URL decode——
// 點擊帶有中文或空格的標籤（例如「API 串接」）時，params.tagName 拿到的是
// 原始的 "API%20%E4%B8%B2%E6%8E%A5"，不是解碼後的 "API 串接"，會導致跟
// techTags 陣列裡的純文字完全比對不上。所以這裡要自己 decodeURIComponent。
export default async function TagOverviewPage({
  params,
}: {
  params: Promise<{ tagName: string }>;
}) {
  const { tagName } = await params;
  const decodedTagName = decodeURIComponent(tagName);
  return <TagOverviewClient tagName={decodedTagName} />;
}
