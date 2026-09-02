"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import type { WallPost } from "./mock-posts";
import { mockTeamGroups, type TeamGroup } from "./mock-teams";

type WallStateContextValue = {
  posts: WallPost[];
  postsLoading: boolean;
  teams: TeamGroup[];
  isLoggedIn: boolean;
  username: string;
  login: (name: string) => void;
  logout: () => void;
  hasLiked: (postId: string) => boolean;
  likePost: (postId: string) => void;
  // 後台（app/admin/wall/）用的管理動作：
  createPost: (input: Omit<WallPost, "id" | "likeCount">) => Promise<WallPost>;
  updatePost: (id: string, updates: Partial<Omit<WallPost, "id">>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostById: (id: string) => WallPost | undefined;
  updateTeamGroup: (id: string, updates: Partial<Omit<TeamGroup, "id">>) => void;
};

const WallStateContext = createContext<WallStateContextValue | null>(null);

const TEAMS_STORAGE_KEY = "diveai-wall-teams-v1";

// 後台改資料、前台看不到的問題，跟別的地方沒有真正的「即時推播」機制
// （D1 沒有像 Supabase Realtime 那種訂閱功能），所以用一個簡單的定時
// 輪詢（POLL_INTERVAL_MS）逼近「即時同步」的效果：不是真正的 push，但
// 對這種內部小工具的使用規模來說已經足夠，不用為了這個另外接
// Durable Objects／WebSocket。
const POLL_INTERVAL_MS = 8000;

// ------------------------------------------------------------------
// teams 用 useSyncExternalStore 讀取一個外部資料源（而不是 useState +
// useEffect 手動同步）：SSR／第一次 hydrate 時用 getServerSnapshot，掛載後
// 才切換成讀真正的資料，並且原生支援「別的分頁改了資料就通知重新讀取」。
// ------------------------------------------------------------------
type ExternalStore<T> = {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
  set: (updater: T | ((prev: T) => T)) => void;
};

function createLocalStorageStore<T>(key: string, initial: T): ExternalStore<T> {
  let cachedRaw: string | null | undefined; // undefined = 還沒讀過
  let cachedValue: T = initial;
  const listeners = new Set<() => void>();

  function readRaw(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null; // 例如無痕模式擋存取，安靜地當作沒有存檔
    }
  }

  function getSnapshot(): T {
    const raw = readRaw();
    if (raw === cachedRaw) return cachedValue; // 沒變就回傳同一個參照，避免無限 render
    cachedRaw = raw;
    if (!raw) {
      cachedValue = initial;
      return cachedValue;
    }
    try {
      cachedValue = JSON.parse(raw) as T;
    } catch {
      cachedValue = initial; // 存檔壞掉或格式不對，安靜地當作沒有存檔
    }
    return cachedValue;
  }

  function getServerSnapshot(): T {
    return initial;
  }

  function set(updater: T | ((prev: T) => T)) {
    const prev = getSnapshot();
    const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
    cachedValue = next;
    cachedRaw = JSON.stringify(next);
    try {
      window.localStorage.setItem(key, cachedRaw);
    } catch {
      // 例如無痕模式或儲存空間滿了，安靜略過，不影響畫面上的操作
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    function handleStorageEvent(e: StorageEvent) {
      if (e.key === key) listener();
    }
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }

  return { getSnapshot, getServerSnapshot, set, subscribe };
}

// posts store：資料存在 Cloudflare D1（透過 app/api/wall/articles 這組
// API route，瀏覽器不能直接連 D1，只能打自己的後端 API），這裡維護一份
// 記憶體快取給 useSyncExternalStore 讀，first subscribe 時 fetch 一次，
// 之後每 POLL_INTERVAL_MS 重新 fetch 一次逼近即時同步。
let hasFetchedOnce = false;

function createPostsStore(): ExternalStore<WallPost[]> {
  let cache: WallPost[] = [];
  const listeners = new Set<() => void>();
  let polling = false;

  function notify() {
    listeners.forEach((listener) => listener());
  }

  async function refetch() {
    try {
      const res = await fetch("/api/wall/articles", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { items: WallPost[] };
      cache = data.items;
    } catch (err) {
      console.error("讀取共學牆文章失敗", err);
    } finally {
      hasFetchedOnce = true;
      notify();
    }
  }

  function ensurePolling() {
    if (polling) return;
    polling = true;
    void refetch();
    setInterval(() => {
      void refetch();
    }, POLL_INTERVAL_MS);
  }

  function getSnapshot() {
    return cache;
  }

  function getServerSnapshot() {
    return [] as WallPost[]; // SSR／第一次 hydrate 一律空陣列，掛載後才真的打 API
  }

  function set(updater: WallPost[] | ((prev: WallPost[]) => WallPost[])) {
    cache = typeof updater === "function" ? updater(cache) : updater;
    notify();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    ensurePolling();
    return () => listeners.delete(listener);
  }

  return { getSnapshot, getServerSnapshot, set, subscribe };
}

const postsStore = createPostsStore();
const teamsStore = createLocalStorageStore<TeamGroup[]>(TEAMS_STORAGE_KEY, mockTeamGroups);

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

// ------------------------------------------------------------------
// 開發階段假狀態，之後接真的登入系統時要整段替換：
// - isLoggedIn／username／login／logout 模擬登入狀態（帳號用文字輸入，
//   不驗證密碼，純粹讓畫面上有「登入」的操作），之後改成讀取真實 session
// - likedPostIds／hasLiked／likePost 模擬「同一使用者對同一篇文章只能按
//   一次讚」，之後要接真的使用者系統才能做到跨裝置記住按讚狀態
// - teams／小組動態目前還是純 localStorage 假資料，這次沒有要求接資料庫，
//   先維持原樣
// ------------------------------------------------------------------
export function WallStateProvider({ children }: { children: React.ReactNode }) {
  const posts = useSyncExternalStore(
    postsStore.subscribe,
    postsStore.getSnapshot,
    postsStore.getServerSnapshot
  );
  const teams = useSyncExternalStore(
    teamsStore.subscribe,
    teamsStore.getSnapshot,
    teamsStore.getServerSnapshot
  );
  // 第一次 fetch 完成前顯示載入中，避免閃一下「找不到文章」。
  const postsLoading = useSyncExternalStore(
    postsStore.subscribe,
    () => !hasFetchedOnce,
    () => true
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  const login = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUsername(trimmed);
    setIsLoggedIn(true);
    setLikedPostIds([]); // 模擬換一個使用者，清空已按讚紀錄
  }, []);

  const logout = useCallback(() => {
    setUsername("");
    setIsLoggedIn(false);
    setLikedPostIds([]);
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

      const target = postsStore.getSnapshot().find((post) => post.id === postId);
      const nextLikeCount = (target?.likeCount ?? 0) + 1;

      // 先樂觀更新本地畫面，再非同步把新的讚數寫回 D1；失敗的話只在
      // console 記錄，不特別做復原（單純累加讚數，不是高風險操作）。
      postsStore.set((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, likeCount: nextLikeCount } : post))
      );

      fetch(`/api/wall/articles/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likeCount: nextLikeCount }),
      }).catch((err) => console.error("按讚寫回失敗", err));
    },
    [isLoggedIn, likedPostIds]
  );

  const createPost = useCallback(async (input: Omit<WallPost, "id" | "likeCount">) => {
    const res = await fetch("/api/wall/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "建立文章失敗"));
    }
    const data = (await res.json()) as { item: WallPost };
    postsStore.set((prev) => [data.item, ...prev]);
    return data.item;
  }, []);

  const updatePost = useCallback(
    async (id: string, updates: Partial<Omit<WallPost, "id">>) => {
      const res = await fetch(`/api/wall/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        throw new Error(await parseErrorMessage(res, "更新文章失敗"));
      }
      const data = (await res.json()) as { item: WallPost };
      postsStore.set((prev) => prev.map((post) => (post.id === id ? data.item : post)));
    },
    []
  );

  const deletePost = useCallback(async (id: string) => {
    const res = await fetch(`/api/wall/articles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "刪除文章失敗"));
    }
    postsStore.set((prev) => prev.filter((post) => post.id !== id));
  }, []);

  const getPostById = useCallback(
    (id: string) => posts.find((post) => post.id === id),
    [posts]
  );

  const updateTeamGroup = useCallback(
    (id: string, updates: Partial<Omit<TeamGroup, "id">>) => {
      teamsStore.set((prev) =>
        prev.map((team) => (team.id === id ? { ...team, ...updates } : team))
      );
    },
    []
  );

  return (
    <WallStateContext.Provider
      value={{
        posts,
        postsLoading,
        teams,
        isLoggedIn,
        username,
        login,
        logout,
        hasLiked,
        likePost,
        createPost,
        updatePost,
        deletePost,
        getPostById,
        updateTeamGroup,
      }}
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
