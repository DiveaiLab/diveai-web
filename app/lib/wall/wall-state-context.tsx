"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import { mockWallPosts, type WallPost, type WallPostKind, type WallPostScene, type WallPostStatus } from "./mock-posts";
import { mockTeamGroups, type TeamGroup } from "./mock-teams";
import { supabase, isSupabaseConfigured } from "@/app/lib/supabase/client";

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

// localStorage 存檔用的 key（Supabase 沒設定時的 fallback 資料來源）。
const POSTS_STORAGE_KEY = "diveai-wall-posts-v1";
const TEAMS_STORAGE_KEY = "diveai-wall-teams-v1";

// 找目前最大的數字型 id，回傳「+1」給新文章用（只有 localStorage fallback
// 會用到；接了 Supabase 之後 id 交給資料庫的 identity 欄位自動產生）。
function nextPostId(posts: WallPost[]): string {
  const maxId = posts.reduce((max, post) => {
    const n = Number(post.id);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return String(maxId + 1);
}

// ------------------------------------------------------------------
// posts／teams 用 useSyncExternalStore 讀取一個外部資料源（而不是
// useState + useEffect 手動同步）：SSR／第一次 hydrate 時用
// getServerSnapshot，掛載後才切換成讀真正的資料，並且原生支援「別的地方
// 改了資料就通知重新讀取」。
//
// 這裡刻意讓 localStorage 版跟 Supabase 版共用同一組介面
// （getSnapshot／getServerSnapshot／subscribe／set），這樣
// WallStateProvider 裡呼叫 useSyncExternalStore 的寫法完全不用因為
// 「有沒有接 Supabase」而分支——分支只發生在建立 store 的當下（模組載入
// 時決定一次），不會出現「同一個 component 依條件呼叫不同 hook」的問題。
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
    // 只有「別的分頁」寫入 localStorage 才會收到瀏覽器原生的 storage 事件，
    // 同一分頁自己呼叫 set() 是走上面 listeners.forEach，兩者不會互相打架。
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

// articles 資料表的 row 形狀（snake_case）跟 WallPost（camelCase）互相轉換。
type ArticleRow = {
  id: number;
  kind: WallPostKind;
  title: string;
  body_md: string;
  cover_url: string;
  links: { label: string; url: string }[] | null;
  scene: WallPostScene[] | null;
  tech_tags: string[] | null;
  author_name: string;
  author_avatar_url: string;
  like_count: number;
  status: WallPostStatus;
  created_at: string;
};

function rowToPost(row: ArticleRow): WallPost {
  return {
    id: String(row.id),
    kind: row.kind,
    title: row.title,
    bodyMd: row.body_md,
    coverUrl: row.cover_url,
    links: row.links ?? [],
    scene: row.scene ?? [],
    techTags: row.tech_tags ?? [],
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url,
    likeCount: row.like_count,
    status: row.status,
    createdAt: row.created_at,
  };
}

function postToRow(input: Omit<WallPost, "id" | "likeCount">) {
  return {
    kind: input.kind,
    title: input.title,
    body_md: input.bodyMd,
    cover_url: input.coverUrl,
    links: input.links,
    scene: input.scene,
    tech_tags: input.techTags,
    author_name: input.authorName,
    author_avatar_url: input.authorAvatarUrl,
    status: input.status,
    created_at: input.createdAt,
  };
}

// Supabase 版的 posts store：資料存在 Supabase 的 articles 表，這裡維護一份
// 記憶體快取（cache）給 useSyncExternalStore 讀，並訂閱 Supabase Realtime
// 的 postgres_changes，別的分頁／別台裝置改了資料時整批重新 fetch 一次、
// 通知所有訂閱者重新 render——即使是不同裝置也能即時同步，比 localStorage
// 版（只能同一台瀏覽器跨分頁）更進一步。
// 只有 Supabase 版會用到：是否已經完成第一次 fetch。用模組層級變數而不是
// React state，是因為要跟 postsStore 共用同一組 listeners／notify 機制
// （fetch 完成時 cache 和這個旗標是同時更新的，訂閱 postsStore 的變動
// 就能同時知道「資料變了」跟「已經載入過了」，不用另外開一組 state 同步）。
let supabasePostsHasLoaded = false;

function createSupabasePostsStore(initial: WallPost[]): ExternalStore<WallPost[]> {
  let cache: WallPost[] = initial;
  const listeners = new Set<() => void>();
  let subscribed = false;

  function notify() {
    listeners.forEach((listener) => listener());
  }

  async function refetch() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("讀取共學牆文章失敗", error);
      supabasePostsHasLoaded = true; // 失敗也算「載入結束」，不要卡在載入中畫面
      notify();
      return;
    }
    cache = (data ?? []).map((row) => rowToPost(row as ArticleRow));
    supabasePostsHasLoaded = true;
    notify();
  }

  function ensureSubscribed() {
    if (subscribed || !supabase) return;
    subscribed = true;
    void refetch();
    supabase
      .channel("articles-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "articles" }, () => {
        void refetch();
      })
      .subscribe();
  }

  function getSnapshot() {
    return cache;
  }

  function getServerSnapshot() {
    return initial; // SSR／第一次 hydrate 一律用空陣列，掛載後才真的打 Supabase
  }

  function set(updater: WallPost[] | ((prev: WallPost[]) => WallPost[])) {
    cache = typeof updater === "function" ? updater(cache) : updater;
    notify();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    ensureSubscribed();
    return () => listeners.delete(listener);
  }

  return { getSnapshot, getServerSnapshot, set, subscribe };
}

// 模組載入時決定一次：有設定 Supabase 就整段走 Supabase，沒有就 fallback
// 回 localStorage 假資料（開發階段預設行為，不會因為沒接資料庫就壞掉）。
const postsStore: ExternalStore<WallPost[]> = isSupabaseConfigured
  ? createSupabasePostsStore([])
  : createLocalStorageStore<WallPost[]>(POSTS_STORAGE_KEY, mockWallPosts);

const teamsStore = createLocalStorageStore<TeamGroup[]>(TEAMS_STORAGE_KEY, mockTeamGroups);

// ------------------------------------------------------------------
// 開發階段假狀態，之後接 Supabase Auth 時要整段替換：
// - isLoggedIn／username／login／logout 模擬登入狀態（帳號用文字輸入，
//   不驗證密碼，純粹讓畫面上有「登入」的操作），之後改成讀取真實 session
// - likedPostIds／hasLiked／likePost 模擬 wall_likes 的 user_id + post_id
//   唯一鍵限制（同一使用者對同一篇文章只能按一次讚）
// - teams／小組動態目前還是純 localStorage 假資料，這次沒有要求接
//   Supabase，先維持原樣
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
  // Supabase 版一開始 posts 是空陣列，第一次 fetch 完成前先顯示載入中，
  // 避免閃一下「找不到文章」；localStorage 版資料一開始就有，永遠不是
  // loading。跟 posts 共用同一個 postsStore.subscribe，fetch 完成時兩者
  // 會同時更新，不需要額外的 state 同步。
  const postsLoading = useSyncExternalStore(
    postsStore.subscribe,
    () => (isSupabaseConfigured ? !supabasePostsHasLoaded : false),
    () => isSupabaseConfigured
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

      // 先樂觀更新本地畫面，Supabase 版再非同步把新的讚數寫回資料庫；
      // 失敗的話只在 console 記錄，不特別做復原（單純累加讚數，不是
      // 高風險操作，不值得為此增加畫面上的錯誤處理複雜度）。
      postsStore.set((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, likeCount: nextLikeCount } : post))
      );

      if (isSupabaseConfigured && supabase) {
        supabase
          .from("articles")
          .update({ like_count: nextLikeCount })
          .eq("id", Number(postId))
          .then(({ error }) => {
            if (error) console.error("按讚寫回 Supabase 失敗", error);
          });
      }
    },
    [isLoggedIn, likedPostIds]
  );

  const createPost = useCallback(async (input: Omit<WallPost, "id" | "likeCount">) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("articles")
        .insert(postToRow(input))
        .select()
        .single();
      if (error) throw new Error(`建立文章失敗：${error.message}`);
      const created = rowToPost(data as ArticleRow);
      postsStore.set((prev) => [created, ...prev]);
      return created;
    }

    let created!: WallPost;
    postsStore.set((prev) => {
      const id = nextPostId(prev);
      created = { ...input, id, likeCount: 0 };
      return [...prev, created];
    });
    return created;
  }, []);

  const updatePost = useCallback(
    async (id: string, updates: Partial<Omit<WallPost, "id">>) => {
      if (isSupabaseConfigured && supabase) {
        const row: Record<string, unknown> = {};
        if (updates.kind !== undefined) row.kind = updates.kind;
        if (updates.title !== undefined) row.title = updates.title;
        if (updates.bodyMd !== undefined) row.body_md = updates.bodyMd;
        if (updates.coverUrl !== undefined) row.cover_url = updates.coverUrl;
        if (updates.links !== undefined) row.links = updates.links;
        if (updates.scene !== undefined) row.scene = updates.scene;
        if (updates.techTags !== undefined) row.tech_tags = updates.techTags;
        if (updates.authorName !== undefined) row.author_name = updates.authorName;
        if (updates.authorAvatarUrl !== undefined) row.author_avatar_url = updates.authorAvatarUrl;
        if (updates.likeCount !== undefined) row.like_count = updates.likeCount;
        if (updates.status !== undefined) row.status = updates.status;
        if (updates.createdAt !== undefined) row.created_at = updates.createdAt;

        const { error } = await supabase.from("articles").update(row).eq("id", Number(id));
        if (error) throw new Error(`更新文章失敗：${error.message}`);
        postsStore.set((prev) =>
          prev.map((post) => (post.id === id ? { ...post, ...updates } : post))
        );
        return;
      }

      postsStore.set((prev) =>
        prev.map((post) => (post.id === id ? { ...post, ...updates } : post))
      );
    },
    []
  );

  const deletePost = useCallback(async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("articles").delete().eq("id", Number(id));
      if (error) throw new Error(`刪除文章失敗：${error.message}`);
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
