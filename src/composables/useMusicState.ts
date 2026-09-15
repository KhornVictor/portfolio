// Tiny shared store so the music disc (in Home.vue) and the binary grid
// (deep inside Hero.vue) can agree on whether a track is playing without
// threading props through every layer.
import { ref } from "vue";

const playing = ref(false);
const title = ref(""); // current track name (shown in the status bar)

// Whether the binary grid should draw the CAVA-style bars while music plays.
// Toggled from the status bar; remembered across visits.
const VIS_KEY = "cava";
function storedVisualizer(): boolean {
  try {
    return localStorage.getItem(VIS_KEY) !== "off";
  } catch {
    return true;
  }
}
const visualizer = ref(storedVisualizer());

function setVisualizer(on: boolean) {
  visualizer.value = on;
  try {
    localStorage.setItem(VIS_KEY, on ? "on" : "off");
  } catch {
    // private mode etc.
  }
}
const toggleVisualizer = () => setVisualizer(!visualizer.value);

// Synthetic beat clock shared by everything that "dances" (the binary grid
// bars, the hero portrait). YouTube audio is cross-origin so we can't analyse
// it; instead every consumer reads the same 112 BPM envelope so they stay in
// step with each other.
// Per-track tempo and intensity, set by the disc from the track's metadata.
const bpm = ref(112);
const energy = ref(1);

export function beatAt(nowMs: number) {
  const t = nowMs / 1000;
  const beatLen = 60 / bpm.value;
  const beatPos = (t % beatLen) / beatLen; // 0 at the kick, 1 just before the next
  const kick = Math.pow(1 - beatPos, 4); // sharp hit, fast decay
  const bar = (t % (beatLen * 4)) / (beatLen * 4); // 0..1 across a 4-beat bar
  const snare = bar > 0.5 ? Math.pow(1 - (bar - 0.5) * 2, 6) : 0; // on beat 3
  const beatIndex = Math.floor(t / beatLen);
  return { kick, snare, beatPos, bar, beatIndex, energy: energy.value };
}

export function useMusicState() {
  return { playing, title, bpm, energy, visualizer, setVisualizer, toggleVisualizer };
}
