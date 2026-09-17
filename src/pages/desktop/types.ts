export type AppId =
  | "finder"
  | "terminal"
  | "safari"
  | "mail"
  | "notes"
  | "photos"
  | "calendar"
  | "settings"
  | "activity"
  | "trash"
  | "textedit";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowState extends Rect {
  id: number;
  app: AppId;
  title: string;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Set while the close animation plays; the window is removed right after. */
  closing?: boolean;
  /** Geometry to restore after un-maximising. */
  restore?: Rect;
  /** App-specific launch argument (e.g. a Finder path or a note id). */
  payload?: string;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  /** Default window size. */
  width: number;
  height: number;
  /** Only one window of this app at a time. */
  single?: boolean;
  /** Show in the Dock. */
  dock?: boolean;
}
