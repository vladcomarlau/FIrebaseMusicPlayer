
"use client";

import { useRef, type Dispatch, type SetStateAction } from 'react';
import { Player } from './Player';
import { Menu } from './Menu';
import { cn } from '@/lib/utils';
import type { Song } from '@/types';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface BottomBarProps {
  playlist: Song[];
  isScrolling?: boolean;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  activeView: 'player' | 'menu';
}

export function BottomBar({
  playlist,
  isScrolling,
  searchQuery,
  setSearchQuery,
  activeView,
}: BottomBarProps) {
  const isMenuVisible = activeView === 'menu';

  return (
    <div
      className={cn(
        "absolute bottom-20 inset-x-0 flex flex-col items-center px-4 transition-all duration-300 pointer-events-none",
        isMenuVisible ? "h-32" : "h-18"
      )}
    >
      <div
        className={cn(
          "absolute w-full max-w-sm pointer-events-auto transition-all duration-300 z-10",
          isMenuVisible ? "bottom-[calc(3rem+0.5rem)]" : "bottom-0"
        )}
      >
        <Player playlist={playlist} isScrolling={isScrolling} />
      </div>

      <div
        className={cn(
          "absolute w-full max-w-sm pointer-events-auto transition-all duration-300 bottom-0",
          !isMenuVisible && "scale-0 opacity-0"
        )}
      >
        <Menu
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </div>
  );
}
