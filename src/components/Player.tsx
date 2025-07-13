
"use client";

import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import type { Song } from '@/types';
import { MarqueeText } from './MarqueeText';

interface PlayerProps {
  playlist: Song[];
  isScrolling?: boolean;
}

export function Player({ playlist, isScrolling }: PlayerProps) {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    currentTime,
    duration,
    seek,
  } = useMusic();

  const [isClient, setIsClient] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showTime, setShowTime] = useState(false);
  
  const wasDraggedRef = useRef(false);
  const timeTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    setIsClient(true);
    return () => {
      if (timeTimeoutRef.current) {
        clearTimeout(timeTimeoutRef.current);
      }
    };
  }, []);

  if (!currentSong || !isClient) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handlePlayPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTime > 3) {
      seek(0);
    } else {
      playPrev(playlist);
    }
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNext(playlist);
  }
  
  const handleSliderChange = (value: number[]) => {
    if (isScrubbing) {
      seek((value[0] / 100) * duration);
    }
  }

  const handlePointerDown = () => {
    if (timeTimeoutRef.current) {
      clearTimeout(timeTimeoutRef.current);
    }
    wasDraggedRef.current = false;
    setIsScrubbing(true);
    setShowTime(true);
  };
  
  const handlePointerUp = () => {
    if (!wasDraggedRef.current) {
      togglePlayPause();
    }
    setIsScrubbing(false);
    
    timeTimeoutRef.current = setTimeout(() => {
      setShowTime(false);
    }, 4000);
  };

  return (
        <div 
          className="flex items-center gap-2 w-full p-2 rounded-full border border-black/10 dark:border-white/20 bg-primary/10 dark:bg-primary/20 h-18 backdrop-blur"
        >
          <Button variant="ghost" size="icon" className="relative rounded-full h-14 w-14 bg-black/5 dark:bg-white/10 text-foreground dark:text-primary-foreground active:scale-95 backdrop-blur-sm border border-black/5 dark:border-white/20 flex items-center justify-center overflow-hidden" onClick={handlePlayPrev}>
            <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300", showTime ? 'opacity-100' : 'opacity-0')}>
              <div className="relative text-xs font-mono select-none dark:[text-shadow:0_0_2px_hsl(var(--primary)/0.8)]">
                {formatDuration(currentTime)}
              </div>
            </div>
            <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300", showTime ? 'opacity-0' : 'opacity-100')}>
                <SkipBack className="h-7 w-7" strokeWidth={2.5}/>
            </div>
          </Button>
          <Button variant="ghost" size="icon" className="relative rounded-full h-14 w-14 bg-black/5 dark:bg-white/10 text-foreground dark:text-primary-foreground active:scale-95 backdrop-blur-sm border border-black/5 dark:border-white/20 flex items-center justify-center overflow-hidden" onClick={handlePlayNext}>
            <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300", showTime ? 'opacity-100' : 'opacity-0')}>
              <div className="relative text-xs font-mono select-none dark:[text-shadow:0_0_2px_hsl(var(--primary)/0.8)]">
                {formatDuration(duration)}
              </div>
            </div>
            <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300", showTime ? 'opacity-0' : 'opacity-100')}>
              <SkipForward className="h-7 w-7" strokeWidth={2.5}/>
            </div>
          </Button>
          
          <div 
            className={cn(
              "flex-1 cursor-pointer relative min-w-0 rounded-full group/progress flex items-center transition-all duration-300 ease-in-out",
              isPlaying ? "h-full" : "h-10"
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={() => {
              if (isScrubbing) {
                wasDraggedRef.current = true;
              }
            }}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => {
                if(isScrubbing) {
                    setIsScrubbing(false);
                    timeTimeoutRef.current = setTimeout(() => {
                        setShowTime(false);
                    }, 4000);
                }
            }}
            >
            <div className="relative rounded-full overflow-hidden w-full h-full flex items-center justify-center text-center px-4" >
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-primary/10"
                />
                <div 
                    className="absolute top-0 left-0 h-full bg-primary"
                    style={{ width: `${progress}%`, pointerEvents: 'none' }}
                />
                <MarqueeText className="font-mono text-sm text-black dark:text-primary-foreground relative z-10 select-none dark:[text-shadow:0_0_2px_hsl(var(--primary)/0.8)]" isScrolling={isScrolling} forceScroll>
                    {currentSong.name}
                </MarqueeText>

                <div 
                  className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent dark:from-white/10"
                />

                <div 
                  className="absolute inset-0 z-30"
                >
                    <Slider 
                      value={[progress]} 
                      onValueChange={handleSliderChange}
                      max={100} 
                      step={1} 
                      className="w-full h-full" 
                      thumbHidden 
                    />
                </div>
            </div>
          </div>
        </div>
  );
}
