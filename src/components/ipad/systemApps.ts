import type { Skill } from "../../service/portfolio.service";

/**
 * Built-in iPadOS system applications.
 * Displayed on the iPad Home Screen alongside skill apps, as well as pinned in the Dock.
 */
export const defaultSystemApps: Skill[] = [
  {
    name: "Camera",
    icon: "camera",
    tag: ["System"],
    description: "Built-in iPad camera with live WebRTC feed, photo filters, and camera roll.",
  },
  {
    name: "Safari",
    icon: "safari",
    tag: ["System", "Web"],
    url: "https://www.google.com",
    iframe: "https://www.google.com",
    description: "Web browser for navigating live websites, online demos, and documentation.",
  },
  {
    name: "Terminal",
    icon: "terminal",
    tag: ["System"],
    description: "Interactive iPadOS Unix terminal emulator and command shell.",
  },
  {
    name: "Notes",
    icon: "notes",
    tag: ["System"],
    description: "Engineering notes, architecture principles, and technical philosophy.",
  },
  {
    name: "Settings",
    icon: "settings",
    tag: ["System"],
    description: "System settings, dynamic wallpaper preferences, and hardware specs.",
  },
  {
    name: "Arcade",
    icon: "game",
    tag: ["Game", "System"],
    description: "iPadOS Arcade: Play 2048, Retro Snake, and Tech Memory Match.",
  },
];

