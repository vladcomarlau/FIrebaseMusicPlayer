
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
  showFavorites: boolean;
  setShowFavorites: Dispatch<SetStateAction<boolean>>;
  activeView: 'player' | 'menu';
  toggleView: () => void;
}

export function BottomBar({
  playlist,
  isScrolling,
  searchQuery,
  setSearchQuery,
  showFavorites,
  setShowFavorites,
  activeView,
  toggleView,
}: BottomBarProps) {
  const isMenuVisible = activeView === 'menu';

  return (
    <div
      className={cn(
        "absolute bottom-[66px] inset-x-0 flex flex-col items-center px-4 transition-all duration-300 pointer-events-none",
        isMenuVisible ? "h-36" : "h-18"
      )}
    >
      <div
        className={cn(
          "absolute w-full max-w-sm pointer-events-auto transition-all duration-300 z-10",
          isMenuVisible ? "bottom-[calc(4.5rem+0.5rem)]" : "bottom-0"
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
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />
      </div>

       <div className={cn("absolute w-full max-w-sm flex justify-center items-center transition-all duration-300 pointer-events-auto",
         isMenuVisible ? "bottom-[calc(9rem+1rem)]" : "bottom-[4.5rem]"
        )}>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={toggleView}>
          {activeView === 'player' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
