// Web Audio analyser that turns a live audio stream into CAVA-style band
// levels (0..1 per bar). Browsers cannot tap system audio silently, so
// `start()` must be called from a user gesture and will show a prompt:
//   - "system": the screen/tab share picker with "Share audio" ticked
//               (Chrome/Edge; on Windows this can capture all system sound).
//   - "mic":    the microphone permission prompt.
import { ref } from "vue";

export type AudioSource = "system" | "mic";

const MIN_HZ = 40;
const MAX_HZ = 12_000;

export function useAudioLevels() {
  const active = ref(false);
  const source = ref<AudioSource | null>(null);
  const error = ref("");

  let ctx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let stream: MediaStream | null = null;
  let freq = new Uint8Array(0);
  // Per-bar smoothing state (recreated when the bar count changes).
  let bars = new Float32Array(0);
  let peaks = new Float32Array(0);
  let velocity = new Float32Array(0);

  async function getStream(kind: AudioSource): Promise<MediaStream> {
    if (kind === "mic") {
      return navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    }
    // Screen share is the only way to reach system/tab audio from a page.
    const display = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
      // Non-standard hints understood by Chromium: ask for system audio and
      // don't demand the video track we're about to drop.
      ...({ systemAudio: "include", selfBrowserSurface: "exclude" } as object),
    });
    if (display.getAudioTracks().length === 0) {
      display.getTracks().forEach((t) => t.stop());
      throw new Error("No audio was shared — tick “Share audio” in the picker.");
    }
    // We only asked for video because the picker requires it; drop it.
    display.getVideoTracks().forEach((t) => {
      t.stop();
      display.removeTrack(t);
    });
    return display;
  }

  async function start(kind: AudioSource) {
    stop();
    error.value = "";
    try {
      stream = await getStream(kind);
      ctx = new AudioContext();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;
      ctx.createMediaStreamSource(stream).connect(analyser);
      freq = new Uint8Array(analyser.frequencyBinCount);
      // If the user hits "Stop sharing" in the browser UI, tear down.
      stream.getAudioTracks()[0]?.addEventListener("ended", stop);
      source.value = kind;
      active.value = true;
    } catch (e) {
      stop();
      error.value = e instanceof Error ? e.message : String(e);
      throw e;
    }
  }

  function stop() {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    void ctx?.close();
    ctx = null;
    analyser = null;
    bars.fill(0);
    peaks.fill(0);
    velocity.fill(0);
    active.value = false;
    source.value = null;
  }

  /**
   * Fill `out` with one level per bar (0..1), bars spread logarithmically
   * from MIN_HZ to MAX_HZ like CAVA. Returns false when no audio is active.
   *
   * `gravity` controls how fast bars fall (CAVA's "gravity" setting), and
   * `peakHold` how fast the peak marker sinks.
   */
  function sample(out: Float32Array, gravity = 0.06, peakHold = 0.015): boolean {
    if (!analyser || !ctx || ctx.state !== "running") return false;
    analyser.getByteFrequencyData(freq);

    const n = out.length;
    if (bars.length !== n) {
      bars = new Float32Array(n);
      peaks = new Float32Array(n);
      velocity = new Float32Array(n);
    }

    const nyquist = ctx.sampleRate / 2;
    const binHz = nyquist / freq.length;
    const logMin = Math.log(MIN_HZ);
    const logRange = Math.log(MAX_HZ) - logMin;

    for (let i = 0; i < n; i++) {
      // Frequency range covered by this bar (log-spaced).
      const lo = Math.exp(logMin + (logRange * i) / n);
      const hi = Math.exp(logMin + (logRange * (i + 1)) / n);
      let a = Math.max(0, Math.floor(lo / binHz));
      let b = Math.min(freq.length - 1, Math.ceil(hi / binHz));
      if (b <= a) b = a + 1;

      let peak = 0;
      for (let k = a; k <= b; k++) if (freq[k] > peak) peak = freq[k];
      // Gentle tilt so highs (naturally quieter) still reach up.
      const tilt = 1 + (i / n) * 0.8;
      let level = Math.min(1, (peak / 255) * tilt);
      level = level * level; // ease-in so quiet passages stay calm

      // Fast attack, gravity fall.
      if (level >= bars[i]) {
        bars[i] = level;
        velocity[i] = 0;
      } else {
        velocity[i] += gravity;
        bars[i] = Math.max(level, bars[i] - velocity[i] * 0.1);
      }
      // Peak marker that sinks slowly.
      peaks[i] = bars[i] >= peaks[i] ? bars[i] : Math.max(bars[i], peaks[i] - peakHold);

      out[i] = bars[i];
    }
    return true;
  }

  function peakOf(i: number): number {
    return peaks[i] ?? 0;
  }

  return { active, source, error, start, stop, sample, peakOf };
}
