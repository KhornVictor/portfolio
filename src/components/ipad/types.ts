export interface OpenApp {
  name: string;
  icon?: string;
  tag?: string[];
  url?: string;
  website?: string;
  iframe?: string;
  description?: string;
  skillLevel?: number;
}

export interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  zIndex: number;
}

export type WallpaperPhase = "auto" | "dawn" | "day" | "sunset" | "night";

export type WindowSlot = "primary" | "secondary";

export type SnapPosition = "left" | "right" | "center" | "maximize";
