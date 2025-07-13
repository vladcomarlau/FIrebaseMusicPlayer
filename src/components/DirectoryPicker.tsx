
"use client";

import { useRef, forwardRef, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderUp, Music2, Music3, Music4 } from 'lucide-react';

interface DirectoryPickerProps {
  isLoaded?: boolean;
  as?: 'button' | 'menu-item';
}

export const DirectoryPicker = forwardRef<HTMLInputElement, DirectoryPickerProps>(
  ({ isLoaded = false, as = 'button' }, ref) => {
    const { loadSongs } = useMusic();
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref || internalRef) as React.RefObject<HTMLInputElement>;


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      loadSongs(event.target.files);
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    useEffect(() => {
      if (as === 'button' && !isLoaded) {
        handleClick();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [as, isLoaded]);

    if (as === 'menu-item') {
      return (
        <input
          id="directory-picker-input-menu"
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          // @ts-ignore
          webkitdirectory="true"
          directory="true"
          multiple
        />
      );
    }

    if (isLoaded) {
      return (
        <>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            multiple
          />
          <Button 
            onClick={handleClick} 
            size="icon" 
            variant="ghost" 
            className="rounded-full h-10 w-10 backdrop-blur-sm text-primary-foreground"
          >
            <FolderUp className="h-4 w-4" />
          </Button>
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center relative overflow-hidden" onClick={handleClick}>
        <div className="absolute inset-0 pointer-events-none">
          <Music2 className="absolute top-[10%] left-[15%] h-16 w-16 text-muted/50 animate-float" style={{ animationDelay: '0s' }}/>
          <Music3 className="absolute top-[20%] right-[10%] h-24 w-24 text-muted/50 animate-float" style={{ animationDelay: '1s' }} />
          <Music4 className="absolute bottom-[15%] left-[25%] h-12 w-12 text-muted/50 animate-float" style={{ animationDelay: '2s' }}/>
          <Music2 className="absolute bottom-[25%] right-[20%] h-20 w-20 text-muted/50 animate-float" style={{ animationDelay: '1.5s' }}/>
          <Music3 className="absolute top-[40%] left-[40%] h-28 w-28 text-muted/50 animate-float" style={{ animationDelay: '0.5s' }}/>
          <Music4 className="absolute top-[5%] right-[35%] h-10 w-10 text-muted/50 animate-float" style={{ animationDelay: '2.5s' }}/>
          <Music2 className="absolute bottom-[5%] left-[5%] h-14 w-14 text-muted/50 animate-float" style={{ animationDelay: '3s' }}/>
          <Music3 className="absolute bottom-[45%] right-[45%] h-28 w-28 text-muted/50 animate-float" style={{ animationDelay: '3.5s' }}/>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            multiple
          />

          <Card className="w-full max-w-md bg-transparent border-none shadow-none">
              <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">Music</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                  <p className="text-muted-foreground">Select a folder to start playing music.</p>
              </CardContent>
          </Card>
        </div>
      </div>
    );
  }
);
DirectoryPicker.displayName = "DirectoryPicker";
