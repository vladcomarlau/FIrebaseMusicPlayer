
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shuffle } from "lucide-react";

interface ShuffleToggleProps {
  isShuffled: boolean;
  onToggle: () => void;
}

export function ShuffleToggle({ isShuffled, onToggle }: ShuffleToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        "rounded-full h-10 w-10 flex-shrink-0",
        isShuffled && "bg-foreground text-background"
      )}
      aria-label={`Shuffle is ${isShuffled ? "on" : "off"}`}
    >
      <Shuffle className="h-5 w-5" />
    </Button>
  );
}
