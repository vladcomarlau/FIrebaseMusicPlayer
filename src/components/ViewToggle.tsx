
"use client";

import { cn } from "@/lib/utils";
import { Heart } from 'lucide-react';
import { Button } from "./ui/button";

interface ViewToggleProps {
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
}

export function ViewToggle({ showFavorites, setShowFavorites }: ViewToggleProps) {
  const isToggled = showFavorites;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowFavorites(!showFavorites)}
      className={cn(
        "rounded-full h-10 w-10 z-10 transition-colors",
        isToggled && "bg-primary/20 hover:bg-primary/30"
      )}
      aria-label="Show favorite songs"
    >
      <Heart className={cn("h-4 w-4", isToggled && "fill-primary text-primary")} />
    </Button>
  );
}
