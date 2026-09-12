import type { AppDefinition, AppId } from "./types";

// Registry of every application the desktop knows about. Order = Dock order.
export const apps: AppDefinition[] = [
  { id: "finder", name: "Finder", width: 860, height: 540, single: true, dock: true },
  { id: "safari", name: "Safari", width: 940, height: 620, single: true, dock: true },
  { id: "terminal", name: "Terminal", width: 820, height: 520, single: true, dock: true },
  { id: "mail", name: "Mail", width: 880, height: 560, single: true, dock: true },
  { id: "notes", name: "Notes", width: 820, height: 540, single: true, dock: true },
  { id: "photos", name: "Photos", width: 820, height: 560, single: true, dock: true },
  { id: "calendar", name: "Calendar", width: 820, height: 580, single: true, dock: true },
  { id: "settings", name: "System Settings", width: 780, height: 540, single: true, dock: true },
  { id: "activity", name: "Activity Monitor", width: 780, height: 520, single: true, dock: true },
  { id: "trash", name: "Trash", width: 620, height: 400, single: true, dock: true },
  { id: "textedit", name: "TextEdit", width: 640, height: 520, single: false, dock: false },
];

export const appById = Object.fromEntries(apps.map((a) => [a.id, a])) as Record<
  AppId,
  AppDefinition
>;

/** Loose name → id lookup so `open Finder`, `open settings` etc. all work. */
export function resolveAppId(name: string): AppId | null {
  const n = name.trim().toLowerCase().replace(/\s+/g, "");
  const aliases: Record<string, AppId> = {
    systemsettings: "settings",
    preferences: "settings",
    activitymonitor: "activity",
    monitor: "activity",
    browser: "safari",
    files: "finder",
    bin: "trash",
  };
  if (aliases[n]) return aliases[n];
  const hit = apps.find((a) => a.id === n || a.name.toLowerCase().replace(/\s+/g, "") === n);
  return hit ? hit.id : null;
}
