
"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode, useMemo } from 'react';
import type { Song, SortOption, RepeatOption, MusicContextType } from '@/types';
import { useToast } from "@/hooks/use-toast";

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [volume, setVolumeState] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [hue, setHueState] = useState(260);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeat, setRepeat] = useState<RepeatOption>('none');
  const [showSineWave, setShowSineWave] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { toast } = useToast();

  const sortedSongs = useMemo(() => {
    return [...songs].sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-desc":
          return b.dateAdded - a.dateAdded;
        case "date-asc":
          return a.dateAdded - b.dateAdded;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [songs, sort]);

  const toggleSort = useCallback(() => {
    setSort(prev => {
      let newSort: SortOption;
      if (prev === 'name-asc') newSort = 'name-desc';
      else if (prev === 'name-desc') newSort = 'date-desc';
      else if (prev === 'date-desc') newSort = 'date-asc';
      else newSort = 'name-asc';
      
      try {
        localStorage.setItem('musebox-sort', newSort);
      } catch (error) {
        console.error("Failed to save sort to localStorage", error);
      }
      return newSort;
    });
  }, []);
  
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('musebox-favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      const storedVolume = localStorage.getItem('musebox-volume');
      if (storedVolume) {
        const parsedVolume = parseFloat(storedVolume);
        setVolumeState(parsedVolume);
        if (audioRef.current) {
          audioRef.current.volume = parsedVolume;
        }
      }
      const storedHue = localStorage.getItem('musebox-hue');
      if (storedHue) {
        setHueState(parseInt(storedHue, 10));
      }
      const storedShuffle = localStorage.getItem('musebox-shuffle');
      if (storedShuffle) {
        setIsShuffled(JSON.parse(storedShuffle));
      }
      const storedRepeat = localStorage.getItem('musebox-repeat');
      if (storedRepeat) {
        setRepeat(storedRepeat as RepeatOption);
      }
      const storedSort = localStorage.getItem('musebox-sort');
      if (storedSort) {
        setSort(storedSort as SortOption);
      }
      const storedSineWave = localStorage.getItem('musebox-sinewave');
      if (storedSineWave) {
        setShowSineWave(JSON.parse(storedSineWave));
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    try {
      localStorage.setItem('musebox-volume', newVolume.toString());
    } catch (error) {
      console.error("Failed to save volume to localStorage", error);
    }
  }, []);

  const setHue = useCallback((newHue: number) => {
    setHueState(newHue);
    try {
      localStorage.setItem('musebox-hue', newHue.toString());
    } catch (error) {
      console.error("Failed to save hue to localStorage", error);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => {
      const newShuffleState = !prev;
      try {
        localStorage.setItem('musebox-shuffle', JSON.stringify(newShuffleState));
      } catch (error) {
        console.error("Failed to save shuffle state to localStorage", error);
      }
      return newShuffleState;
    });
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      let nextState: RepeatOption;
      if (prev === 'none') nextState = 'list';
      else if (prev === 'list') nextState = 'song';
      else nextState = 'none';
      try {
        localStorage.setItem('musebox-repeat', nextState);
      } catch (error) {
        console.error("Failed to save repeat state to localStorage", error);
      }
      return nextState;
    });
  }, []);
  
  const toggleSineWave = useCallback(() => {
    setShowSineWave(prev => {
      const newSineWaveState = !prev;
      try {
        localStorage.setItem('musebox-sinewave', JSON.stringify(newSineWaveState));
      } catch (error) {
        console.error("Failed to save sine wave state to localStorage", error);
      }
      return newSineWaveState;
    });
  }, []);

  const toggleFavorite = (songId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId];
      try {
        localStorage.setItem('musebox-favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
      }
      return newFavorites;
    });
  };

  const loadSongs = (files: FileList | null) => {
    if (!files) return;
    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length === 0) {
        toast({
            variant: "destructive",
            title: "No audio files found",
            description: "Please select a folder containing supported audio files (e.g., mp3, wav, ogg)."
        });
        return;
    }

    const newSongs: Song[] = audioFiles.map(file => {
      const songUrl = URL.createObjectURL(file);
      return {
        id: `${file.name}-${file.size}`,
        file,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: songUrl,
        dateAdded: file.lastModified,
      };
    });
    setSongs(newSongs);
  };

  const playSong = useCallback((songId: string) => {
    const songToPlay = songs.find(s => s.id === songId) || sortedSongs.find(s => s.id === songId);
    if (songToPlay) {
      setCurrentSong(songToPlay);
      setIsPlaying(true);
    }
  }, [songs, sortedSongs]);

  const togglePlayPause = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying(prev => !prev);
  }, [currentSong]);

  const playNext = useCallback((playlist: Song[] = sortedSongs) => {
    if (!currentSong || playlist.length === 0) return;

    if (isShuffled) {
      let nextSong;
      if (playlist.length === 1) {
        nextSong = playlist[0];
      } else {
        let potentialSongs = playlist.filter(s => s.id !== currentSong.id);
        if (potentialSongs.length === 0) {
            potentialSongs = playlist;
        }
        const randomIndex = Math.floor(Math.random() * potentialSongs.length);
        nextSong = potentialSongs[randomIndex];
      }
      playSong(nextSong.id);
    } else {
       const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
       if (currentIndex === -1) {
        playSong(playlist[0].id);
      } else {
        const nextIndex = (currentIndex + 1) % playlist.length;
        if (nextIndex === 0 && repeat !== 'list') {
            setIsPlaying(false);
            return;
        }
        playSong(playlist[nextIndex].id);
      }
    }
    
  }, [currentSong, sortedSongs, isShuffled, repeat, playSong]);

  const playPrev = useCallback((playlist: Song[] = sortedSongs) => {
    if (!currentSong || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) {
      playSong(playlist[0].id);
    } else {
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      playSong(playlist[prevIndex].id);
    }
  }, [currentSong, sortedSongs, playSong]);

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const handleSongEnd = useCallback(() => {
    if (repeat === 'song' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext(sortedSongs);
    }
  }, [repeat, playNext, sortedSongs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong && audio.src !== currentSong.url) {
      audio.src = currentSong.url;
    }

    if (isPlaying) {
      audio.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = () => handleSongEnd();
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [handleSongEnd]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      if (currentSong) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentSong.name,
          artist: "Music",
          album: 'Music Player',
        });
        navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
      } else {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = "none";
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isPlaying && currentSong) {
        document.title = currentSong.name;
      } else {
        document.title = 'Music';
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      const handlePlay = () => togglePlayPause();
      const handlePause = () => togglePlayPause();

      navigator.mediaSession.setActionHandler('play', handlePlay);
      navigator.mediaSession.setActionHandler('pause', handlePause);
      
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext(sortedSongs));
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrev(sortedSongs));
        
      return () => {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('seekto', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('previoustrack', null);
          navigator.mediaSession.setActionHandler('seekforward', null);
          navigator.mediaSession.setActionHandler('seekbackward', null);
      };
    }
  }, [togglePlayPause, playNext, playPrev, sortedSongs, duration, seek]);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      songs.forEach(song => URL.revokeObjectURL(song.url));
    };
  }, [songs]);

  const value = {
    songs,
    sortedSongs,
    currentSong,
    isPlaying,
    favorites,
    volume,
    currentTime,
    duration,
    sort,
    hue,
    isShuffled,
    repeat,
    showSineWave,
    audioRef,
    loadSongs,
    playSong,
    togglePlayPause,
    playNext,
    playPrev,
    toggleFavorite,
    setVolume,
    seek,
    setSort,
    toggleSort,
    setHue,
    toggleShuffle,
    toggleRepeat,
    toggleSineWave,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
