
"use client";

import { useMusic } from '@/contexts/MusicContext';
import { DirectoryPicker } from '@/components/DirectoryPicker';
import { SongList } from '@/components/SongList';
import { Heart } from 'lucide-react';
import { useMemo, useState, useRef, useEffect } from 'react';
import { ListSpacer } from '@/components/ListSpacer';
import { BottomBar } from '@/components/BottomBar';
import { cn } from '@/lib/utils';
import SineWave from '@/components/SineWave';

export default function Home() {
  const { sortedSongs, favorites, currentSong } = useMusic();
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  
  const favoriteSongs = useMemo(() => {
    return sortedSongs.filter(song => favorites.includes(song.id));
  }, [sortedSongs, favorites]);

  const baseSongsToShow = showFavorites ? favoriteSongs : sortedSongs;

  const songsToShow = useMemo(() => {
    if (!searchQuery) {
      return baseSongsToShow;
    }
    return baseSongsToShow.filter(song =>
      song.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [baseSongsToShow, searchQuery]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 2000);
  };
  
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const isFavoritesToggled = showFavorites;

  return (
    <div className="flex flex-col h-full bg-background/80 backdrop-blur-3xl text-foreground overflow-hidden relative">
      <div className="fixed top-0 inset-x-0 h-16 bg-gradient-to-b from-primary to-transparent z-10 pointer-events-none transition-colors duration-500" />
      
      {sortedSongs.length > 0 && (
        <div className="fixed top-0 inset-x-0 pt-4 z-10 flex justify-center pointer-events-none">
          <div className="p-2 pointer-events-auto">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={cn(
                "flex items-center justify-start gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 bg-black/5 dark:bg-white/10 backdrop-blur-[2px] transition-colors",
                isFavoritesToggled && "text-foreground"
              )}
              aria-label={isFavoritesToggled ? "Show all songs" : "Show favorite songs"}
            >
              <p className="text-xs font-medium tracking-wider uppercase">
                  {isFavoritesToggled ? 'Favorites' : 'Songs'} &middot; {songsToShow.length}
              </p>
            </button>
          </div>
        </div>
      )}

      <main 
        className={cn("flex-1 overflow-y-auto relative z-0", isScrolling && "is-scrolling")}
        onScroll={handleScroll}
      >
        {sortedSongs.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <DirectoryPicker />
          </div>
        ) : (
          <div className="p-6 pt-20">
              <div className="mt-5">
                {songsToShow.length > 0 || searchQuery || showFavorites ? (
                  <>
                    {songsToShow.length > 0 ? (
                      <>
                        <SongList songs={songsToShow} isScrolling={isScrolling} />
                        <ListSpacer isMenuOpen={true} />
                      </>
                    ) : (
                       <div className="text-center text-muted-foreground mt-16 flex flex-col items-center">
                          {searchQuery ? (
                              <>
                                  <h3 className="text-lg font-semibold">No Results Found</h3>
                                  <p className="text-sm">Try a different search term.</p>
                              </>
                          ) : (
                              <>
                                  <Heart size={48} className="text-muted-foreground/50 mb-4" />
                                  <h3 className="text-lg font-semibold">No Favorites Yet</h3>
                                  <p className="text-sm">Click the heart icon on a song to add it here.</p>
                              </>
                          )}
                        </div>
                    )}
                  </>
                ) : (
                  <>
                    <SongList songs={songsToShow} isScrolling={isScrolling} />
                    <ListSpacer isMenuOpen={true} />
                  </>
                )}
              </div>
          </div>
        )}
      </main>
      
      {sortedSongs.length > 0 && (
        <>
          <div className="fixed bottom-0 inset-x-0 h-[170px] z-5 pointer-events-none">
            <SineWave />
          </div>
          
          <div className="fixed bottom-5 inset-x-0 z-40 px-2">
              <BottomBar 
                  playlist={songsToShow} 
                  isScrolling={isScrolling}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isScrubbing={isScrubbing}
                  setIsScrubbing={setIsScrubbing}
              />
          </div>
        </>
      )}
    </div>
  );
}
