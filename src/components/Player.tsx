
"use client";

import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipForward,
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import type { Song } from '@/types';
import { MarqueeText } from './MarqueeText';

interface PlayerProps {
  playlist: Song[];
  isScrolling?: boolean;
  isDragging?: boolean;
}

export function Player({ playlist, isScrolling, isDragging }: PlayerProps) {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    currentTime,
    duration,
    seek,
  } = useMusic();

  const [isClient, setIsClient] = useState(false);
  const internalIsDraggingRef = useRef(false);
  const pointerDownRef = useRef(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!currentSong || !isClient) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlayPause();
  }

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNext(playlist);
  }

  return (
        <div 
          className="flex items-center gap-1 w-full p-1 rounded-full border border-black/10 dark:border-white/20 bg-primary/10 dark:bg-primary/20 h-18 backdrop-blur"
          onPointerDown={() => {
            pointerDownRef.current = true;
          }}
          onPointerMove={() => {
            if (pointerDownRef.current) {
              internalIsDraggingRef.current = true;
            }
          }}
          onPointerUp={() => {
            pointerDownRef.current = false;
            setTimeout(() => internalIsDraggingRef.current = false, 100);
          }}
        >
          <Button variant="ghost" size="icon" className="relative rounded-full h-full w-auto aspect-square bg-black/5 dark:bg-white/10 text-foreground dark:text-primary-foreground active:scale-95 backdrop-blur-sm border border-black/5 dark:border-white/20" onClick={handleTogglePlay}>
            <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out", internalIsDraggingRef.current ? "opacity-0 pointer-events-none" : "opacity-100")}>
              {isPlaying ? <Pause className="h-7 w-7"/> : <Play className="h-7 w-7"/>}
            </div>
            <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out select-none", internalIsDraggingRef.current ? "opacity-100" : "opacity-0 pointer-events-none")}>
              {formatDuration(currentTime)}
            </div>
          </Button>
          <Button variant="ghost" size="icon" className="relative rounded-full h-full w-auto aspect-square bg-black/5 dark:bg-white/10 text-foreground dark:text-primary-foreground active:scale-95 backdrop-blur-sm border border-black/5 dark:border-white/20" onClick={handlePlayNext}>
              <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out", internalIsDraggingRef.current ? "opacity-0 pointer-events-none" : "opacity-100")}>
              <SkipForward className="h-6 w-6"/>
            </div>
            <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out select-none", internalIsDraggingRef.current ? "opacity-100" : "opacity-0 pointer-events-none")}>
              {formatDuration(duration)}
            </div>
          </Button>

          <div className="flex-1 cursor-pointer transition-colors relative min-w-0 h-full rounded-full">
            <div className="relative rounded-full overflow-hidden h-full flex items-center justify-center text-center px-4 bg-primary/10" >
                <div 
                    className="absolute top-0 left-0 h-full bg-primary opacity-80"
                    style={{ width: `${progress}%` }}
                />
                <MarqueeText className="font-semibold text-sm text-black dark:text-primary-foreground relative z-10 select-none" isScrolling={isScrolling}>
                    {currentSong.name}
                </MarqueeText>

                <div 
                  className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent dark:from-white/10"
                />

                <div className={cn("absolute inset-0 z-30 opacity-0", isDragging && "pointer-events-none")}>
                    <Slider value={[progress]} onValueChange={([val]) => seek((val / 100) * duration)} max={100} step={1} className="w-full h-full" />
                </div>
            </div>
          </div>
        </div>
  );
}
