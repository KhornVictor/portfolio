// Tiny shared store so the music disc (in Home.vue) and the binary grid
// (deep inside Hero.vue) can agree on whether a track is playing without
// threading props through every layer.
import { ref } from "vue";

const playing = ref(false);
const title = ref(""); // current track name (shown in the status bar)

export function useMusicState() {
  return { playing, title };
}
