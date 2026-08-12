export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Dữ liệu structured data do server tạo từ nội dung sản phẩm/bài viết
      // trong database, không phải input người dùng - an toàn để render trực tiếp.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
