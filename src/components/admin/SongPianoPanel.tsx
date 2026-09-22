"use client";

import { INSTRUMENTS, noteNameFromMidi, pitchClassName, type InstrumentKey, type NoteNaming } from "@/lib/music";
import { SCALES } from "@/lib/song-editor";
import { PianoKeyboard } from "@/components/admin/PianoKeyboard";

const selectClass =
  "w-full rounded-lg border border-border bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brass";
const smallBtn =
  "rounded-lg border border-border px-3 py-1.5 text-sm font-bold text-ink-soft hover:border-brass hover:text-brass-deep";

const PITCH_CLASSES = Array.from({ length: 12 }, (_, i) => i);

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-36 flex-col gap-1.5">
      <span className="text-xs text-muted">{label}</span>
      {children}
    </div>
  );
}

export function SongPianoPanel({
  scaleRoot,
  scaleType,
  instrument,
  songKey,
  naming,
  volume,
  tempTranspose,
  baseOctave,
  pressed,
  indicator,
  onScaleRoot,
  onScaleType,
  onInstrument,
  onSongKey,
  onNaming,
  onVolume,
  onTranspose,
  onTempTranspose,
  onOctave,
  onKeyPress,
}: {
  scaleRoot: number;
  scaleType: string;
  instrument: InstrumentKey;
  songKey: number;
  naming: NoteNaming;
  volume: number;
  tempTranspose: number;
  baseOctave: number;
  pressed: number[];
  indicator: string;
  onScaleRoot: (pc: number) => void;
  onScaleType: (type: string) => void;
  onInstrument: (key: InstrumentKey) => void;
  onSongKey: (pc: number) => void;
  onNaming: (naming: NoteNaming) => void;
  onVolume: (v: number) => void;
  onTranspose: (semitones: number) => void;
  onTempTranspose: (delta: number) => void;
  onOctave: (delta: number) => void;
  onKeyPress: (midi: number, shift: boolean) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4 border-b border-border pb-4">
        <Group label="Scale (Gam)">
          <div className="flex gap-2">
            <select value={scaleRoot} onChange={(e) => onScaleRoot(Number(e.target.value))} className={selectClass}>
              {PITCH_CLASSES.map((pc) => (
                <option key={pc} value={pc}>
                  {pitchClassName(pc, naming)}
                </option>
              ))}
            </select>
            <select value={scaleType} onChange={(e) => onScaleType(e.target.value)} className={selectClass}>
              {Object.entries(SCALES).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </Group>
        <Group label="Nhạc cụ">
          <select value={instrument} onChange={(e) => onInstrument(e.target.value as InstrumentKey)} className={selectClass}>
            {Object.entries(INSTRUMENTS).map(([key, inst]) => (
              <option key={key} value={key}>
                {inst.label}
              </option>
            ))}
          </select>
        </Group>
        <Group label="Tone gốc bài hát">
          <select value={songKey} onChange={(e) => onSongKey(Number(e.target.value))} className={selectClass}>
            {PITCH_CLASSES.map((pc) => (
              <option key={pc} value={pc}>
                {pitchClassName(pc, naming)}
              </option>
            ))}
          </select>
        </Group>
        <Group label="Dịch giọng (đổi nốt, lưu lại)">
          <div className="flex gap-2">
            <button type="button" title="Giáng thật 1 nửa cung (đổi nốt đã gán, có lưu)" onClick={() => onTranspose(-1)} className={smallBtn}>
              ♭
            </button>
            <button type="button" title="Thăng thật 1 nửa cung (đổi nốt đã gán, có lưu)" onClick={() => onTranspose(1)} className={smallBtn}>
              ♯
            </button>
          </div>
        </Group>
        <Group label="Thăng/giáng tạm thời (chỉ xem)">
          <div className="flex items-center gap-2">
            <button type="button" title="Giáng tạm thời 1 nửa cung (chỉ hiển thị, không lưu)" onClick={() => onTempTranspose(-1)} className={smallBtn}>
              ♭
            </button>
            <span className="min-w-6 text-center text-sm font-bold tabular-nums text-ink">
              {tempTranspose > 0 ? `+${tempTranspose}` : tempTranspose}
            </span>
            <button type="button" title="Thăng tạm thời 1 nửa cung (chỉ hiển thị, không lưu)" onClick={() => onTempTranspose(1)} className={smallBtn}>
              ♯
            </button>
          </div>
        </Group>
        <Group label="Tên nốt">
          <select value={naming} onChange={(e) => onNaming(e.target.value as NoteNaming)} className={selectClass}>
            <option value="letter">Chữ (C, D, E...)</option>
            <option value="solfege">Do Re Mi (Đô Rê Mi...)</option>
          </select>
        </Group>
        <Group label="Âm lượng">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            className="w-32"
          />
        </Group>
      </div>

      <div className="my-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => onOctave(-12)} className={smallBtn}>
          Octave -
        </button>
        <span className="text-xs text-muted">
          Bàn phím máy tính: bát độ gốc {noteNameFromMidi(baseOctave, "letter")} (phím A)
        </span>
        <button type="button" onClick={() => onOctave(12)} className={smallBtn}>
          Octave +
        </button>
        <span className="ml-auto text-sm font-semibold text-brass-deep">{indicator}</span>
      </div>

      <PianoKeyboard
        naming={naming}
        scaleRoot={scaleRoot}
        scaleType={scaleType}
        pressed={pressed}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}
