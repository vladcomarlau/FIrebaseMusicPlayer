
"use client";

import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Song } from '@/types';
import { cn } from '@/lib/utils';

interface PlayerProps {
  playlist: Song[];
}

export function Player({ playlist }: PlayerProps) {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    currentTime,
    seek,
  } = useMusic();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePlayPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentSong) return;
    if (currentTime > 3) {
      seek(0);
    } else {
      playPrev(playlist);
    }
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentSong) return;
    playNext(playlist);
  }

  const handleTogglePlayPause = () => {
    if (currentSong) {
      togglePlayPause();
    }
  };
  
  if (!isClient) return <div className="h-20" />; // Placeholder for server render

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="relative rounded-full h-14 w-14 text-primary-foreground active:scale-95 flex items-center justify-center overflow-hidden bg-primary/80 border border-primary/30" onClick={handlePlayPrev} disabled={!currentSong}>
              <SkipBack className="h-8 w-8 [filter:drop-shadow(0_0_1px_hsl(var(--primary-foreground)/0.8))]" strokeWidth={1.5}/>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative rounded-full h-20 w-20 text-primary-foreground active:scale-95 flex items-center justify-center overflow-hidden bg-primary/80 border border-primary/30" onClick={handleTogglePlayPause} disabled={!currentSong}>
              {isPlaying && currentSong ? <Pause className="h-10 w-10 [filter:drop-shadow(0_0_1px_hsl(var(--primary-foreground)/0.8))]" strokeWidth={1.5} /> : <Play className="h-10 w-10 [filter:drop-shadow(0_0_1px_hsl(var(--primary-foreground)/0.8))]" strokeWidth={1.5} />}
          </Button>

          <Button variant="ghost" size="icon" className="relative rounded-full h-14 w-14 text-primary-foreground active:scale-95 flex items-center justify-center overflow-hidden bg-primary/80 border border-primary/30" onClick={handlePlayNext} disabled={!currentSong}>
              <SkipForward className="h-8 w-8 [filter:drop-shadow(0_0_1px_hsl(var(--primary-foreground)/0.8))]" strokeWidth={1.5}/>
          </Button>
      </div>
    </div>
  );
}
