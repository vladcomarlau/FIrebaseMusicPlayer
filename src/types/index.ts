
export interface Song {
  id: string;
  file: File;
  name: string;
  url: string;
}

export type SortOption = "name-asc" | "name-desc";

export type RepeatOption = "none" | "list" | "song";

export interface MusicContextType {
  songs: Song[];
  sortedSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  volume: number;
  currentTime: number;
  duration: number;
  sort: SortOption;
  hue: number;
  isShuffled: boolean;
  repeat: RepeatOption;
  showSineWave: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  loadSongs: (files: FileList | null) => void;
  playSong: (songId: string) => void;
  togglePlayPause: () => void;
  playNext: (playlist?: Song[]) => void;
  playPrev: (playlist?: Song[]) => void;
  toggleFavorite: (songId: string) => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  setSort: (sort: SortOption) => void;
  toggleSort: () => void;
  setHue: (hue: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleSineWave: () => void;
}
