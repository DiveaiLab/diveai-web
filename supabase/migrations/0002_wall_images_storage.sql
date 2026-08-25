-- 共學牆圖片上傳用的 Storage bucket：封面圖跟內文裡插入的圖片都放這裡，
-- 用路徑前綴區分（covers/... 跟 content/...），不用開兩個 bucket。
insert into storage.buckets (id, name, public)
values ('wall-images', 'wall-images', true)
on conflict (id) do nothing;

-- 跟 0001_articles.sql 的 RLS 一樣：後台目前沒有登入門檻，所以先開放 anon
-- 角色可以上傳圖片；bucket 設為 public，讀取不需要任何權限即可直接用
-- 網址存取（前台文章要能直接顯示圖片）。之後收斂權限時一併調整。
create policy "wall_images_public_read" on storage.objects
  for select using (bucket_id = 'wall-images');

create policy "wall_images_public_insert" on storage.objects
  for insert with check (bucket_id = 'wall-images');
