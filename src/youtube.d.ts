// Minimal typings for the parts of the YouTube IFrame Player API we use
// (https://developers.google.com/youtube/iframe_api_reference).
declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface PlayerEvent {
    target: Player;
    data: number;
  }

  interface PlayerOptions {
    videoId?: string;
    width?: number | string;
    height?: number | string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (e: PlayerEvent) => void;
      onStateChange?: (e: PlayerEvent) => void;
      onError?: (e: PlayerEvent) => void;
    };
  }

  class Player {
    constructor(el: HTMLElement | string, options: PlayerOptions);
    playVideo(): void;
    loadVideoById(videoId: string): void;
    pauseVideo(): void;
    stopVideo(): void;
    destroy(): void;
    getPlayerState(): number;
  }
}

interface Window {
  YT?: typeof YT;
  onYouTubeIframeAPIReady?: () => void;
}
