
"use client";

import { type Dispatch, type SetStateAction } from 'react';
import { ViewToggle } from '@/components/ViewToggle';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ActionMenu } from '@/components/ActionMenu';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MenuProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  showFavorites: boolean;
  setShowFavorites: Dispatch<SetStateAction<boolean>>;
}

export function Menu({ searchQuery, setSearchQuery, showFavorites, setShowFavorites }: MenuProps) {
  return (
    <div className="flex items-center gap-1 w-full p-1 rounded-full border border-black/10 dark:border-white/20 bg-primary/10 dark:bg-primary/20 h-18 backdrop-blur">
      <ViewToggle showFavorites={showFavorites} setShowFavorites={setShowFavorites} />
      <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Search songs..."
              className="w-full pl-10 rounded-full bg-black/5 dark:bg-white/5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>
      <ActionMenu />
      <ThemeToggle />
    </div>
  );
}
