// Thanh toán khóa học bằng chuyển khoản: tạo mã VietQR và đọc tin báo có.
// Không phụ thuộc Next/Supabase để thử được bằng node.
//
// Đơn hàng, mã đơn và nội dung chuyển khoản do Supabase tạo
// (supabase/migrations/20261112000000_course_orders.sql, create_course_order).

/** Mã đơn: "TS" + 6 ký tự, không có I, L, O, 0, 1 (trùng với ràng buộc trong SQL). */
export const ORDER_CODE_RE = /TS[A-HJKMNP-Z2-9]{6}/g;

export interface BankAccount {
  /** Mã BIN ngân hàng theo NAPAS, Vietcombank = 970436 */
  bin: string;
  bankName: string;
  accountNo: string;
  accountName: string;
}

/** Tài khoản nhận tiền từ biến môi trường; null nếu chưa khai báo đủ. */
export function bankAccountFromEnv(env: Record<string, string | undefined> = process.env): BankAccount | null {
  const bin = env.PAYMENT_BANK_BIN?.trim();
  const accountNo = env.PAYMENT_ACCOUNT_NO?.replace(/\s/g, "");
  const accountName = env.PAYMENT_ACCOUNT_NAME?.trim();
  if (!bin || !/^\d{6}$/.test(bin) || !accountNo || !/^\d{4,19}$/.test(accountNo) || !accountName) return null;
  return { bin, accountNo, accountName, bankName: env.PAYMENT_BANK_NAME?.trim() || "Ngân hàng" };
}

function tlv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

/** CRC-16/CCITT-FALSE (poly 0x1021, khởi tạo 0xFFFF) - trường 63 của chuẩn EMVCo. */
export function crc16(data: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(data)) {
    crc ^= byte << 8;
    for (let k = 0; k < 8; k++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Chuỗi QR chuyển khoản theo chuẩn VietQR (NAPAS 247, EMVCo): app ngân hàng
 * nào quét cũng điền sẵn tài khoản, số tiền và nội dung.
 */
export function vietQrPayload(account: BankAccount, amount: number, note: string): string {
  const cleanNote = note.replace(/[^A-Za-z0-9 ]/g, "").slice(0, 25);
  const merchant = tlv("00", "A000000727") + tlv("01", tlv("00", account.bin) + tlv("01", account.accountNo)) + tlv("02", "QRIBFTTA");
  const body =
    tlv("00", "01") +
    tlv("01", "12") + // QR động: có số tiền
    tlv("38", merchant) +
    tlv("53", "704") + // VND
    tlv("54", String(Math.round(amount))) +
    tlv("58", "VN") +
    tlv("62", tlv("08", cleanNote)) +
    "6304";
  return body + crc16(body);
}

export interface BankMessage {
  /** Số tiền có dấu: dương là tiền vào. null nếu không đọc được. */
  amount: number | null;
  /** Các mã đơn tìm thấy trong tin. */
  codes: string[];
}

/** "500,000" / "500.000" / "1,500,000.00" -> số đồng */
function toDong(raw: string): number | null {
  let s = raw.replace(/\s/g, "");
  // phần lẻ ",00" / ".00" ở cuối (sau một nhóm nghìn)
  if (/[.,]\d{3}[.,]\d{2}$/.test(s)) s = s.slice(0, -3);
  const digits = s.replace(/[.,]/g, "");
  if (!/^\d+$/.test(digits)) return null;
  const n = Number(digits);
  return Number.isSafeInteger(n) ? n : null;
}

/**
 * Đọc tin biến động số dư, ví dụ thông báo VCB Digibank:
 * "Số dư TK VCB 0123456789 +500,000 VND lúc 12-11-2026 09:15:22. Số dư 1,234,567 VND. Ref MBVCB.123.TSK7F3Q2 SAX30 NGUYEN VAN A"
 * Số tiền là con số đầu tiên có dấu + hoặc - đứng trước VND/đ; số dư (không dấu) bị bỏ qua.
 */
export function parseBankMessage(text: string): BankMessage {
  const t = text.normalize("NFC");
  const m = /([+-])\s?(\d[\d.,]*)\s?(?:VND|VNĐ|đ|đồng)/i.exec(t);
  const value = m ? toDong(m[2]) : null;
  const amount = value === null ? null : m![1] === "-" ? -value : value;

  const upper = t.toUpperCase();
  const codes = new Set<string>();
  // tìm cả trong bản bỏ dấu cách/dấu chấm, phòng ngân hàng chèn ký tự vào giữa
  for (const s of [upper, upper.replace(/[^A-Z0-9]/g, "")]) for (const c of s.match(ORDER_CODE_RE) ?? []) codes.add(c);
  return { amount, codes: [...codes] };
}

export function formatDong(n: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(n)}đ`;
}
