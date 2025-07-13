
"use client";

import type { Song } from "@/types";
import { useMusic } from "@/contexts/MusicContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { MarqueeText } from "./MarqueeText";
import { HueSlider } from "./HueSlider";
import { useState } from "react";

const NowPlayingIcon = () => (
    <div className="flex items-end w-5 h-5 gap-0.5">
        <span className="w-1 h-2 bg-primary/80 animate-[wave_1s_ease-in-out_-0.4s_infinite_alternate]"/>
        <span className="w-1 h-4 bg-primary animate-[wave_1s_ease_in_out_-0.2s_infinite_alternate]"/>
        <span className="w-1 h-3 bg-primary/80 animate-[wave_1s_ease_in_out_0s_infinite_alternate]"/>
    </div>
);

interface SongListProps {
    songs: Song[];
    isScrolling?: boolean;
}

export function SongList({ songs, isScrolling }: SongListProps) {
  const { currentSong, isPlaying, playSong, favorites, toggleFavorite } = useMusic();
  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null);

  const handleSongClick = (song: Song) => {
    if (currentSong?.id !== song.id) {
      playSong(song.id);
    }
  };

  return (
    <div className="space-y-2 rounded-lg">
      {songs.map((song, index) => {
        const isCurrent = currentSong?.id === song.id;
        const isHovered = hoveredSongId === song.id;
        const isFavorited = favorites.includes(song.id);
        const shouldScroll = isCurrent || isHovered;

        return (
          <div
            key={song.id}
            onMouseEnter={() => setHoveredSongId(song.id)}
            onMouseLeave={() => setHoveredSongId(null)}
            className={cn(
              "flex items-center rounded-full group transition-all relative select-none overflow-hidden",
              isCurrent 
                ? "bg-accent" 
                : "bg-card even:bg-secondary"
            )}
          >
            <div className="opacity-0">
                {isCurrent && <HueSlider />}
            </div>
            <button
                className="flex items-center p-3 flex-1 text-left min-w-0 gap-4"
                onClick={() => handleSongClick(song)}
            >
              <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                {isCurrent && isPlaying ? (
                  <NowPlayingIcon />
                ) : (
                  <span className={cn("font-bold text-lg text-muted-foreground", isCurrent && "text-primary/70")}>
                    {song.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden whitespace-nowrap">
                <MarqueeText isScrolling={isScrolling} forceScroll={shouldScroll} className={cn(isCurrent && "font-semibold text-accent-foreground dark:text-primary")}>
                  {song.name}
                </MarqueeText>
              </div>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full mr-2 flex-shrink-0 relative opacity-80",
                isFavorited
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(song.id);
              }}
            >
              <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
