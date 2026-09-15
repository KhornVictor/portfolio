// Tiny shared store so the music disc (in Home.vue) and the binary grid
// (deep inside Hero.vue) can agree on whether a track is playing without
// threading props through every layer.
import { ref } from "vue";

const playing = ref(false);

export function useMusicState() {
  return { playing };
}
