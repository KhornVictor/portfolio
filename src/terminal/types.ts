// Shared types for the terminal. The parser produces `TerminalLine`s and the
// UI only knows how to paint them — keeps command logic free of Vue.

export type Tone =
  | "default"
  | "muted"
  | "cmd"
  | "label"
  | "value"
  | "link"
  | "error"
  | "heading"
  | "accent"
  | "success"
  | "warn"
  | "purple";

export interface Segment {
  text: string;
  tone?: Tone;
  /** When set the segment renders as an anchor. */
  href?: string;
}

export type TerminalLine =
  | { kind: "text"; segments: Segment[] }
  | { kind: "blank" }
  | { kind: "fastfetch" };

export interface TerminalEntry {
  id: number;
  /** The command that was typed; `null` for system output (e.g. banner). */
  command: string | null;
  lines: TerminalLine[];
}

export type CommandAction =
  | { type: "clear" }
  | { type: "navigate"; to: string };

export interface CommandResult {
  lines: TerminalLine[];
  action?: CommandAction;
}
