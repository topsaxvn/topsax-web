-- Tone gốc bài hát (cột song_key) trước đây chỉ lưu pitch class (0-11), nên
-- không phân biệt được giọng trưởng và giọng thứ trùng tên nốt (vd: La
-- trưởng và La thứ đều là pitch class 9). Thêm cột song_key_mode để chọn
-- trưởng/thứ, phía hiển thị dùng ký hiệu "Am", "Bm", "Cm"... cho giọng thứ.

create type public.song_key_mode as enum ('major', 'minor');

alter table public.songs
  add column song_key_mode public.song_key_mode not null default 'major';
