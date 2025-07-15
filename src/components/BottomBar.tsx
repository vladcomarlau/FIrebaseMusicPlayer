
"use client";

import { type Dispatch, type SetStateAction } from 'react';
import { Player } from './Player';
import { Menu } from './Menu';
import { cn, formatDuration } from '@/lib/utils';
import type { Song } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import { MarqueeText } from './MarqueeText';
import { Slider } from './ui/slider';

interface BottomBarProps {
  playlist: Song[];
  isScrolling?: boolean;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  isScrubbing: boolean;
  setIsScrubbing: Dispatch<SetStateAction<boolean>>;
}

export function BottomBar({
  playlist,
  isScrolling,
  searchQuery,
  setSearchQuery,
  isScrubbing,
  setIsScrubbing,
}: BottomBarProps) {
  const { currentSong, currentTime, duration, seek } = useMusic();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleSliderChange = (value: number[]) => {
    if (currentSong) {
      seek((value[0] / 100) * duration);
    }
  };
  
  const handlePointerDown = () => {
    if (currentSong) {
      setIsScrubbing(true);
    }
  };
  
  const handlePointerUp = () => {
    if (currentSong) {
      setIsScrubbing(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between transition-all duration-300 rounded-[36px] p-3 gap-2 shadow-xl shadow-black",
        "glassmorphism"
      )}
    >
      <div className="w-full flex flex-col items-center gap-2">
        <div className="w-full px-1 flex-1 min-w-0 text-center">
            <MarqueeText className="text-sm font-medium text-foreground dark:text-primary-foreground [text-shadow:0_0_1px_hsl(var(--foreground)/0.3)] dark:text-shadow-glow" isScrolling={isScrolling} forceScroll>
              {currentSong ? currentSong.name : "..."}
            </MarqueeText>
        </div>
        <div className="w-full flex items-center gap-2 px-1">
          <span className="font-mono text-xs text-muted-foreground w-10 text-center">{formatDuration(currentTime)}</span>
          <Slider 
            value={[progress]} 
            onValueChange={handleSliderChange}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            max={100} 
            step={0.1} 
            className="w-full" 
            disabled={!currentSong}
          />
          <span className="font-mono text-xs text-muted-foreground w-10 text-center">{formatDuration(duration)}</span>
        </div>
      </div>
      
      <div
        className="relative w-full pointer-events-auto transition-all duration-300 z-10"
      >
        <Player playlist={playlist} />
      </div>

      <div
        className="relative w-full pointer-events-auto transition-all duration-300"
      >
        <Menu
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </div>
  );
}
