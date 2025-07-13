
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RepeatOption } from "@/types";
import { Repeat, Repeat1 } from "lucide-react";

interface RepeatToggleProps {
  repeat: RepeatOption;
  onToggle: () => void;
}

export function RepeatToggle({ repeat, onToggle }: RepeatToggleProps) {
  const getIcon = () => {
    switch (repeat) {
      case "list":
        return <Repeat className="h-5 w-5" />;
      case "song":
        return <Repeat1 className="h-5 w-5" />;
      default:
        return <Repeat className="h-5 w-5" />;
    }
  };

  const getAriaLabel = () => {
    switch (repeat) {
        case "list":
            return "Repeat list is on";
        case "song":
            return "Repeat song is on";
        default:
            return "Repeat is off";
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        "rounded-full h-10 w-10 flex-shrink-0",
        repeat !== "none" && "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
      )}
      aria-label={getAriaLabel()}
    >
      {getIcon()}
    </Button>
  );
}
