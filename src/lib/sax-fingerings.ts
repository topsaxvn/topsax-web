// Thế bấm lấy từ McGill Music Sax School Finger Chart (Bb3 → F7, gồm altissimo).
// images[i] là thế bấm chính của nốt viết baseMidi + i; alternates[i] là các thế bấm thay thế.
export type FingeringData = { baseMidi: number; images: string[]; alternates?: string[][] };

let fingeringPromise: Promise<FingeringData> | null = null;

export function loadSaxFingerings(): Promise<FingeringData> {
  if (!fingeringPromise) {
    fingeringPromise = fetch("/cam-am/sax-fingerings.json")
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được thế bấm");
        return res.json() as Promise<FingeringData>;
      })
      .catch((err) => {
        fingeringPromise = null;
        throw err;
      });
  }
  return fingeringPromise;
}
