
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types";
import { ArrowDownAZ, ArrowUpAZ, SlidersHorizontal } from "lucide-react";

interface SortToggleProps {
  sort: SortOption;
  setSort: (sort: SortOption) => void;
}

export function SortToggle({ sort, setSort }: SortToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 flex-shrink-0"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="name-asc">
            Name (A-Z)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name-desc">
            Name (Z-A)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
