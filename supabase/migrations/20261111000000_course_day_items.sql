-- TOPSAX: mỗi ngày học có nhiều bài (luyện nốt, bài hát, bài thêm) + bài giảng
--
-- Chạy MỘT LẦN trong Supabase SQL Editor, SAU file 20261110000000_admin_role_and_course.sql.
-- Cả file nằm trong một transaction: lỗi ở đâu thì không gì thay đổi.
--
-- Trước: mỗi ngày (course_lessons) đúng một bản nhạc (course_lesson_scores) và
-- tiến độ tính theo ngày (course_progress).
-- Sau:
--   course_items          các bài trong ngày: tên, loại, thứ tự (ai xem được ngày thì xem được)
--   course_item_content   nốt nhạc + link video của từng bài (chỉ người có quyền)
--   course_lesson_guides  bài giảng chữ của ngày (chỉ người có quyền)
--   course_item_progress  kết quả tốt nhất của từng bài
-- Bản nhạc và tiến độ đã có được chuyển sang bảng mới (thành bài "bài hát"
-- của ngày đó), rồi hai bảng cũ bị xóa.

begin;

-- Ai mở được nội dung của một ngày: admin, học viên đã mua, hoặc ngày học
-- thử của khóa học đã mở bán. Dùng chung cho nốt nhạc, video và bài giảng.
create or replace function public.can_open_lesson(p_lesson uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.course_lessons l
      join public.courses c on c.id = l.course_id
      where l.id = p_lesson
        and l.is_published
        and (public.has_course_access(c.id) or (l.is_free and c.status = 'published'))
    );
$$;

revoke all on function public.can_open_lesson(uuid) from public;
grant execute on function public.can_open_lesson(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Bảng mới
-- ---------------------------------------------------------------------------
create table public.course_items (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  -- notes = luyện nốt, song = bài hát, bonus = bài thêm (không bắt buộc)
  kind text not null check (kind in ('notes', 'song', 'bonus')),
  position integer not null default 0,
  title text not null default '',
  subtitle text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- tải lại cùng một file thì cập nhật bài cũ, không sinh bài mới
  unique (lesson_id, kind, title)
);

create index course_items_lesson_id_idx on public.course_items (lesson_id);

create trigger course_items_set_updated_at
  before update on public.course_items
  for each row execute function public.set_updated_at();

create table public.course_item_content (
  item_id uuid primary key references public.course_items (id) on delete cascade,
  score jsonb not null,
  file_name text not null default '',
  video_url text not null default '',
  updated_at timestamptz not null default now()
);

create trigger course_item_content_set_updated_at
  before update on public.course_item_content
  for each row execute function public.set_updated_at();

create table public.course_lesson_guides (
  lesson_id uuid primary key references public.course_lessons (id) on delete cascade,
  guide text not null default '',
  updated_at timestamptz not null default now()
);

create trigger course_lesson_guides_set_updated_at
  before update on public.course_lesson_guides
  for each row execute function public.set_updated_at();

create table public.course_item_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item_id uuid not null references public.course_items (id) on delete cascade,
  best_score integer not null check (best_score between 0 and 100),
  stars integer not null check (stars between 0 and 3),
  attempts integer not null default 1 check (attempts >= 1),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index course_item_progress_item_id_idx on public.course_item_progress (item_id);

create trigger course_item_progress_set_updated_at
  before update on public.course_item_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Chuyển dữ liệu cũ
-- ---------------------------------------------------------------------------
insert into public.course_items (lesson_id, kind, position, title)
select s.lesson_id, 'song', 1, coalesce(nullif(l.title, ''), 'Bài hát')
from public.course_lesson_scores s
join public.course_lessons l on l.id = s.lesson_id;

insert into public.course_item_content (item_id, score, file_name)
select i.id, s.score, s.file_name
from public.course_lesson_scores s
join public.course_items i on i.lesson_id = s.lesson_id;

insert into public.course_item_progress (user_id, item_id, best_score, stars, attempts, updated_at)
select p.user_id, i.id, p.best_score, p.stars, p.attempts, p.updated_at
from public.course_progress p
join public.course_items i on i.lesson_id = p.lesson_id;

drop table public.course_lesson_scores;
drop table public.course_progress;

-- ---------------------------------------------------------------------------
-- Quyền
-- ---------------------------------------------------------------------------
alter table public.course_items enable row level security;
alter table public.course_item_content enable row level security;
alter table public.course_lesson_guides enable row level security;
alter table public.course_item_progress enable row level security;

-- Tên bài đi theo ngày: thấy được ngày (policy của course_lessons) thì thấy tên bài.
create policy "read items of visible lessons"
  on public.course_items for select
  to anon, authenticated
  using (exists (select 1 from public.course_lessons l where l.id = lesson_id));

create policy "admin manage items"
  on public.course_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "read content with access"
  on public.course_item_content for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.course_items i
      where i.id = item_id and public.can_open_lesson(i.lesson_id)
    )
  );

create policy "admin manage content"
  on public.course_item_content for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "read guides with access"
  on public.course_lesson_guides for select
  to anon, authenticated
  using (public.can_open_lesson(lesson_id));

create policy "admin manage guides"
  on public.course_lesson_guides for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "read own item progress"
  on public.course_item_progress for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "write own item progress"
  on public.course_item_progress for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "update own item progress"
  on public.course_item_progress for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Danh sách học viên: một ngày tính là xong khi mọi bài bắt buộc (luyện nốt,
-- bài hát) của ngày đó đã có kết quả. Bài thêm không bắt buộc.
-- ---------------------------------------------------------------------------
create or replace function public.admin_course_students(p_course uuid)
returns table (
  user_id uuid,
  email text,
  note text,
  granted_at timestamptz,
  lessons_done integer,
  last_activity timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not public.is_admin() then
    raise exception 'Chỉ admin mới xem được.' using errcode = '42501';
  end if;

  return query
  select
    e.user_id,
    u.email::text,
    e.note,
    e.created_at,
    (select count(*)::integer
       from public.course_lessons l
      where l.course_id = e.course_id
        and exists (select 1 from public.course_items i where i.lesson_id = l.id and i.kind <> 'bonus')
        and not exists (
          select 1 from public.course_items i
           where i.lesson_id = l.id and i.kind <> 'bonus'
             and not exists (
               select 1 from public.course_item_progress p
                where p.item_id = i.id and p.user_id = e.user_id
             )
        )),
    (select max(p.updated_at)
       from public.course_item_progress p
       join public.course_items i on i.id = p.item_id
       join public.course_lessons l on l.id = i.lesson_id
      where p.user_id = e.user_id and l.course_id = e.course_id)
  from public.course_enrollments e
  join auth.users u on u.id = e.user_id
  where e.course_id = p_course
  order by e.created_at desc;
end;
$$;

commit;
