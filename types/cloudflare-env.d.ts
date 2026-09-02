// D1／R2 的最小型別宣告，對齊 feat-cms 分支同一個檔案的寫法（沒有另外裝
// @cloudflare/workers-types，用手刻的最小介面，兩個分支之後合併時容易對齊）。
type D1Result<T = unknown> = {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: unknown;
};

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

type R2PutOptions = {
  httpMetadata?: {
    contentType?: string;
  };
};

interface R2ObjectBody {
  body: ReadableStream;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: ArrayBuffer, options?: R2PutOptions): Promise<unknown>;
}

interface CloudflareEnv {
  DB: D1Database;
  WALL_ASSETS?: R2Bucket;
  WALL_ASSETS_ENABLED?: string;
  NODE_ENV?: string;
}
