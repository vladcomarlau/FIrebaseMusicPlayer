
"use client";

import { useMusic } from '@/contexts/MusicContext';
import { DirectoryPicker } from '@/components/DirectoryPicker';
import { SongList } from '@/components/SongList';
import { Heart, ChevronUp, ChevronDown } from 'lucide-react';
import { useMemo, useState, useRef, useEffect } from 'react';
import { ListSpacer } from '@/components/ListSpacer';
import { BottomBar } from '@/components/BottomBar';
import { cn } from '@/lib/utils';
import SineWave from '@/components/SineWave';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { sortedSongs, favorites, currentSong } = useMusic();
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeView, setActiveView] = useState<'player' | 'menu'>('player');
  
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

  const toggleView = () => {
    setActiveView(prev => prev === 'player' ? 'menu' : 'player');
  };

  const isFavoritesToggled = showFavorites;

  return (
    <div className="flex flex-col h-full bg-background/80 backdrop-blur-3xl text-foreground overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary to-transparent z-10 pointer-events-none transition-colors duration-500" />
      <main 
        className={cn("flex-1 overflow-y-auto relative z-0", isScrolling && "is-scrolling")}
        onScroll={handleScroll}
      >
        {sortedSongs.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <DirectoryPicker />
          </div>
        ) : (
          <div className="p-6 pt-28">
              <div className="mt-5">
                {songsToShow.length > 0 || searchQuery || showFavorites ? (
                  <>
                    <div className="sticky top-0 z-10 mb-2 flex justify-center -mt-20 pt-4">
                        <button
                          onClick={() => setShowFavorites(!showFavorites)}
                          className={cn(
                            "flex items-center justify-start gap-2 rounded-full border border-black/5 dark:border-white/5 px-4 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-[2px] transition-colors",
                            isFavoritesToggled && "text-foreground"
                          )}
                          aria-label={isFavoritesToggled ? "Show all songs" : "Show favorite songs"}
                        >
                          <p className="text-xs font-medium tracking-wider uppercase">
                              {isFavoritesToggled ? 'Favorites' : 'Songs'} &middot; {songsToShow.length}
                          </p>
                        </button>
                    </div>

                    {songsToShow.length > 0 ? (
                      <>
                        <SongList songs={songsToShow} isScrolling={isScrolling} />
                        <ListSpacer isMenuOpen={activeView === 'menu'} />
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
                    <ListSpacer isMenuOpen={activeView === 'menu'} />
                  </>
                )}
              </div>
          </div>
        )}
      </main>
      
      <div className="absolute inset-0 z-5 pointer-events-none">
        <SineWave />
      </div>
      
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-background/80 to-transparent dark:from-background/80 z-10 pointer-events-none" />

      {currentSong && (
        <>
          <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none">
              <BottomBar 
                  playlist={songsToShow} 
                  isScrolling={isScrolling}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeView={activeView}
              />
          </div>
          <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center items-center pointer-events-auto">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-24 bg-background/10 backdrop-blur-[2px] border border-black/5 dark:border-white/5" onClick={toggleView}>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
