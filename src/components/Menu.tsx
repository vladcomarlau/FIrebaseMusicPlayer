
"use client";

import React, { type Dispatch, type SetStateAction, useState, useRef } from 'react';
import { Search, Shuffle, Repeat, Repeat1, ArrowDownAZ, ArrowUpAZ, Waves, FolderUp, X, CalendarPlus, CalendarMinus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useMusic } from '@/contexts/MusicContext';
import { DirectoryPicker } from './DirectoryPicker';

interface MenuProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export function Menu({ searchQuery, setSearchQuery }: MenuProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    isShuffled, 
    toggleShuffle, 
    repeat, 
    toggleRepeat,
    sort,
    toggleSort,
    showSineWave,
    toggleSineWave,
  } = useMusic();

  const handleLoadMusicClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleClearSearch = () => {
    if (searchQuery) {
      setSearchQuery('');
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  };

  const handleOpenSearch = () => {
    inputRef.current?.focus();
  };

  const handleIconMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const repeatIcon = () => {
    switch (repeat) {
      case 'list': return <Repeat1 className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />;
      case 'song': return <Repeat className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />;
      default: return <Repeat className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />;
    }
  }

  const repeatTooltip = () => {
    switch (repeat) {
      case 'list': return "Repeat List";
      case 'song': return "Repeat Song";
      default: return "Repeat Off";
    }
  }

  const sortIcon = () => {
    switch(sort) {
      case 'name-asc':
        return <ArrowDownAZ className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />;
      case 'name-desc':
        return <ArrowUpAZ className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />;
      case 'date-desc':
        return <CalendarPlus className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />;
      case 'date-asc':
        return <CalendarMinus className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />;
      default:
        return <ArrowDownAZ className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />;
    }
  }

  const sortTooltip = () => {
    switch(sort) {
      case 'name-asc':
        return "Sort: A-Z";
      case 'name-desc':
        return "Sort: Z-A";
      case 'date-desc':
        return "Sort: Newest";
      case 'date-asc':
        return "Sort: Oldest";
      default:
        return "Sort List";
    }
  }

  const isSearchActive = isSearchFocused || !!searchQuery;

  return (
    <>
      <DirectoryPicker as="menu-item" ref={fileInputRef} />
      <div className="relative flex items-center w-full p-2 rounded-full h-12">
        <div 
          className={cn(
            "absolute inset-0 flex items-center transition-all duration-300 ease-in-out z-10",
            isSearchActive ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
          )}
        >
          <div className="relative w-full flex items-center">
            <Search className="h-5 w-5 text-foreground absolute left-3 pointer-events-none [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search songs..."
              className={cn(
                "w-full h-12 bg-black/5 dark:bg-white/5 border-none rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 ease-in-out pl-10 pr-12 text-foreground placeholder:text-muted-foreground",
                "[text-shadow:0_0_1px_hsl(var(--foreground)/0.3)] dark:text-shadow-glow",
                isSearchActive ? "opacity-100" : "opacity-0"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {isSearchActive && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 shrink-0 absolute right-1" 
                onClick={handleClearSearch}
                onMouseDown={handleIconMouseDown}
                aria-label="Clear Search"
              >
                <X className="h-5 w-5 text-foreground [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />
              </Button>
            )}
          </div>
        </div>
        
        <div className={cn("flex items-center w-full transition-opacity duration-300 px-2", isSearchActive && "opacity-0 pointer-events-none")}>
            <div className="flex items-center flex-1 justify-between">
              <div className="flex items-center gap-1">
                 <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10 shrink-0" 
                  onClick={handleOpenSearch}
                  onMouseDown={handleIconMouseDown}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-foreground [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={toggleShuffle} aria-label={isShuffled ? 'Shuffle Off' : 'Shuffle On'}>
                  <Shuffle className={cn("h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]", isShuffled && "text-primary")} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={toggleRepeat} aria-label={repeatTooltip()}>
                  {React.cloneElement(repeatIcon(), { className: cn("h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]", repeat !== 'none' && "text-primary") })}
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={toggleSort} aria-label={sortTooltip()}>
                  {sortIcon()}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={handleLoadMusicClick} aria-label="Change Folder">
                  <FolderUp className="h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={toggleSineWave} aria-label={showSineWave ? 'Hide Wave' : 'Show Wave'}>
                  <Waves className={cn("h-4 w-4 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]", showSineWave && "text-primary")} />
                </Button>
                <ThemeToggle />
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
