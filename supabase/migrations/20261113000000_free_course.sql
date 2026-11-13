-- TOPSAX: khóa học miễn phí (giá 0đ)
--
-- Chạy trong Supabase SQL Editor, sau các file 2026111x trước. Chạy lại nhiều
-- lần cũng không sao (chỉ thay định nghĩa hàm).
--
-- Muốn học thì PHẢI đăng nhập (trang web chỉ cho đăng nhập bằng Google).
-- Khóa học đang mở (published) mà giá = 0: mọi người đã đăng nhập mở được mọi
-- ngày đã đăng, không cần mua. Đặt giá > 0 thì quay lại như cũ: người đã đăng
-- nhập mở được ngày học thử, còn lại phải mua. Khách chưa đăng nhập không mở
-- được bài nào.
--
-- join_free_course(): học viên đã đăng nhập vào học một khóa miễn phí thì được
-- ghi vào course_enrollments, để admin vẫn thấy danh sách người học và tiến độ.

begin;

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
        and (
          public.has_course_access(c.id)
          or (
            c.status = 'published'
            and auth.uid() is not null
            and (l.is_free or c.price <= 0)
          )
        )
    );
$$;

create or replace function public.join_free_course(p_course uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return false;
  end if;
  if not exists (select 1 from public.courses where id = p_course and status = 'published' and price <= 0) then
    return false;
  end if;
  insert into public.course_enrollments (course_id, user_id, note)
  values (p_course, auth.uid(), 'Khóa miễn phí')
  on conflict (course_id, user_id) do nothing;
  return true;
end;
$$;

revoke all on function public.join_free_course(uuid) from public;
grant execute on function public.join_free_course(uuid) to authenticated;

commit;
