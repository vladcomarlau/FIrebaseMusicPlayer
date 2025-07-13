
"use client";

import { useMusic } from '@/contexts/MusicContext';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export function HueSlider() {
  const { hue, setHue } = useMusic();

  return (
    <div className="w-full flex items-center justify-center absolute inset-0 opacity-50 z-10">
      <Slider
        min={0}
        max={360}
        step={1}
        value={[hue]}
        onValueChange={(value) => setHue(value[0])}
        className="w-full h-full"
        thumbHidden
      />
    </div>
  );
}
