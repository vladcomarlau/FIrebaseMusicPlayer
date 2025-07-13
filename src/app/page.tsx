
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

  return (
    <div className="flex flex-col h-full bg-background/80 backdrop-blur-3xl text-foreground overflow-hidden">
      <main 
        className={cn("flex-1 overflow-y-auto relative z-0", isScrolling && "is-scrolling")}
        onScroll={handleScroll}
      >
        {sortedSongs.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4 md:p-6">
            <DirectoryPicker />
          </div>
        ) : (
          <div className="p-4 md:p-6">
              <div>
                {songsToShow.length > 0 ? (
                  <>
                    <div className="px-4 mb-2">
                        <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                            {songsToShow.length} {songsToShow.length === 1 ? 'Song' : 'Songs'}
                        </p>
                    </div>
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
              </div>
          </div>
        )}
      </main>
      
      <div className="absolute inset-0 z-5 pointer-events-none">
        <SineWave />
      </div>

      {currentSong && (
        <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none">
            <BottomBar 
                playlist={songsToShow} 
                isScrolling={isScrolling}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showFavorites={showFavorites}
                setShowFavorites={setShowFavorites}
                activeView={activeView}
                toggleView={toggleView}
            />
        </div>
      )}
    </div>
  );
}
