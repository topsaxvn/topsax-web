"use client";

import ReactDOM from "react-dom";

// Mở kết nối sớm tới các origin bên ngoài (Cloudinary cho ảnh, Supabase cho
// data) trước khi trình duyệt thực sự cần tới chúng - giảm độ trễ TLS
// handshake trên request đầu tiên tới các domain này.
export function PreconnectHints() {
  ReactDOM.preconnect("https://res.cloudinary.com");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) ReactDOM.preconnect(supabaseUrl);

  return null;
}
