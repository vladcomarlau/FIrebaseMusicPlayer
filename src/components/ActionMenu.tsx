
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, FolderUp, Shuffle, Repeat, Repeat1, ArrowDownAZ, ArrowUpAZ, Waves } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";
import { DirectoryPicker } from "./DirectoryPicker";
import { useRef } from "react";

export function ActionMenu() {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadMusicClick = () => {
    fileInputRef.current?.click();
  };

  const repeatIcon = () => {
    switch (repeat) {
      case 'list': return <Repeat className="mr-2 h-4 w-4" />;
      case 'song': return <Repeat1 className="mr-2 h-4 w-4" />;
      default: return <Repeat className="mr-2 h-4 w-4" />;
    }
  }

  const repeatText = () => {
    switch (repeat) {
      case 'list': return "Repeat List";
      case 'song': return "Repeat Song";
      default: return "Repeat Off";
    }
  }
  
  return (
    <>
      <DirectoryPicker as="menu-item" ref={fileInputRef} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggleShuffle(); }}>
            <Shuffle className="mr-2 h-4 w-4" />
            <span>{isShuffled ? 'Shuffle Off' : 'Shuffle On'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggleRepeat(); }}>
            {repeatIcon()}
            <span>{repeatText()}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggleSort(); }}>
            {sort === 'name-asc' ? <ArrowDownAZ className="mr-2 h-4 w-4" /> : <ArrowUpAZ className="mr-2 h-4 w-4" />}
            <span>Sort List</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggleSineWave(); }}>
            <Waves className="mr-2 h-4 w-4" />
            <span>{showSineWave ? 'Hide Wave' : 'Show Wave'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLoadMusicClick}>
            <FolderUp className="mr-2 h-4 w-4" />
            <span>Change Folder</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
