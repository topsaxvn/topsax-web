import type { z } from "zod";

export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const flat = error.flatten().fieldErrors;
  const result: Record<string, string> = {};
  for (const key in flat) {
    const messages = flat[key as keyof typeof flat];
    if (messages?.[0]) result[key] = messages[0];
  }
  return result;
}

export function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = (value ?? "").toString().trim();
  return str === "" ? null : str;
}
