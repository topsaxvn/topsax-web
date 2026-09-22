export type FingeringData = { baseMidi: number; images: string[] };

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
