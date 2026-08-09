"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { mockWallPosts, type WallPost } from "./mock-posts";

type WallStateContextValue = {
  posts: WallPost[];
  isLoggedIn: boolean;
  toggleLogin: () => void;
  hasLiked: (postId: string) => boolean;
  likePost: (postId: string) => void;
};

const WallStateContext = createContext<WallStateContextValue | null>(null);

// ------------------------------------------------------------------
// 開發階段假狀態，之後接 Supabase Auth／wall_likes 資料表時要整段替換：
// - isLoggedIn／toggleLogin 模擬登入狀態，之後改成讀取真實 session
// - likedPostIds／hasLiked／likePost 模擬 wall_likes 的 user_id + post_id
//   唯一鍵限制（同一使用者對同一篇文章只能按一次讚）
// 用 Context 包在 layout 裡，是為了讓列表頁與單篇頁（兩個不同路由）
// 共用同一份模擬登入 / 按讚狀態，體驗上比較接近真實登入情境。
// ------------------------------------------------------------------
export function WallStateProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<WallPost[]>(mockWallPosts);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  const toggleLogin = useCallback(() => {
    setIsLoggedIn((prev) => !prev);
    setLikedPostIds([]); // 模擬換一個使用者，清空已按讚紀錄
  }, []);

  const hasLiked = useCallback(
    (postId: string) => likedPostIds.includes(postId),
    [likedPostIds]
  );

  const likePost = useCallback(
    (postId: string) => {
      if (!isLoggedIn) {
        window.alert("請先登入才能按讚！");
        return;
      }
      if (likedPostIds.includes(postId)) {
        return; // 按鈕本身已 disabled，這裡是防呆
      }
      setLikedPostIds((prev) => [...prev, postId]);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post
        )
      );
    },
    [isLoggedIn, likedPostIds]
  );

  return (
    <WallStateContext.Provider
      value={{ posts, isLoggedIn, toggleLogin, hasLiked, likePost }}
    >
      {children}
    </WallStateContext.Provider>
  );
}

export function useWallState() {
  const ctx = useContext(WallStateContext);
  if (!ctx) {
    throw new Error("useWallState must be used within WallStateProvider");
  }
  return ctx;
}
