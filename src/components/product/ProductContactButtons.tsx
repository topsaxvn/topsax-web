"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MessengerIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/site-config";

export function ProductContactButtons({ productName }: { productName: string }) {
  const [copied, setCopied] = useState(false);
  const message = `Tôi đang quan tâm đến sản phẩm ${productName}`;
  const messengerHref = `${siteConfig.messengerUrl}?text=${encodeURIComponent(message)}`;

  // Zalo (link zalo.me/<số điện thoại> cho tài khoản cá nhân) không hỗ trợ
  // tham số URL để soạn sẵn nội dung tin nhắn như Messenger (m.me?text=) -
  // nên copy sẵn nội dung vào clipboard để khách dán vào khung chat.
  async function handleZaloClick() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      // Trình duyệt chặn clipboard (vd. không phải HTTPS/context không an
      // toàn) - vẫn cho link Zalo mở bình thường, chỉ là không copy được.
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Button href={siteConfig.phoneHref} variant="brass">
          Gọi ngay
        </Button>
        <Button href={siteConfig.zaloUrl} variant="outline" onClick={handleZaloClick}>
          Nhắn Zalo
        </Button>
        <Button href={messengerHref} variant="outline">
          <MessengerIcon className="h-4 w-4" />
          Nhắn Messenger
        </Button>
      </div>
      {copied && (
        <p className="mt-2 text-xs text-brass-deep">
          Đã copy nội dung tin nhắn - dán vào khung chat Zalo nhé.
        </p>
      )}
    </div>
  );
}
