
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import { useMusic } from '@/contexts/MusicContext';
import { cn } from '@/lib/utils';
import { useSpring, animated } from '@react-spring/web';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

// Animation Clock (External Store)
let frame = -1;
let phase = 0;
let lastTime = 0;
const subscribers = new Set<() => void>();

function clock(time: number) {
  if (lastTime) {
    const delta = (time - lastTime) * 0.0015; // Speed factor
    phase += delta;
  }
  lastTime = time;
  subscribers.forEach((callback) => callback());
  frame = requestAnimationFrame(clock);
}

const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  if (subscribers.size === 1) {
    frame = requestAnimationFrame(clock);
  }
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) {
      cancelAnimationFrame(frame);
      frame = -1;
      lastTime = 0;
      phase = 0;
    }
  };
};

const getSnapshot = () => phase;

// Server snapshot can be a static value, as animation only happens on the client.
const getServerSnapshot = () => 0;

export default function SineWave() {
  const { width = 0 } = useWindowSize();
  const { isPlaying, currentSong, showSineWave } = useMusic();
  const [isClient, setIsClient] = useState(false);
  const currentPhase = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { amp1, amp2, amp3, amp4 } = useSpring({
    amp1: isPlaying && currentSong ? 15.36 : 0,
    amp2: isPlaying && currentSong ? 12.8 : 0,
    amp3: isPlaying && currentSong ? 20.48 : 0,
    amp4: isPlaying && currentSong ? 17.92 : 0,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const pathD = useMemo(() => {
    if (width <= 0) return { path1: '', path2: '' };
    
    const centerX = width / 2;
    const containerHeight = 128; 
    const yOffset = containerHeight / 2;

    return (a1: number, a2: number, a3: number, a4: number) => {
        const freq1 = 0.015;
        const freq2 = 0.008;
        const freq3 = 0.012;
        const freq4 = 0.006;
        
        let path1 = `M 0 ${containerHeight}`;
        let path2 = `M 0 ${containerHeight}`;

        for (let x = 0; x <= width; x++) {
            const distFromCenter = Math.abs(x - centerX);
            
            // Foreground wave
            const y1 = a1 * Math.sin(distFromCenter * freq1 - currentPhase * 2);
            const y2 = a2 * Math.sin(distFromCenter * freq2 - currentPhase);
            const combinedY1 = yOffset + y1 + y2;
            path1 += ` L ${x} ${combinedY1}`;
            
            // Background wave
            const y3 = a3 * Math.sin(distFromCenter * freq3 - currentPhase * 1.5);
            const y4 = a4 * Math.sin(distFromCenter * freq4 - currentPhase * 0.8);
            const combinedY2 = yOffset + y3 + y4;
            path2 += ` L ${x} ${combinedY2}`;
        }
        
        path1 += ` L ${width} ${containerHeight} Z`;
        path2 += ` L ${width} ${containerHeight} Z`;
        
        return { path1, path2 };
    }
  }, [width, currentPhase]);


  if (!isClient || !width || !showSineWave) return null;

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 w-full h-32 overflow-hidden transition-opacity duration-500 z-5",
        currentSong ? 'opacity-100' : 'opacity-0'
      )}
    >
      <animated.svg
        width={width}
        height="100%"
        viewBox={`0 0 ${width} 128`}
        preserveAspectRatio="none"
      >
        <animated.path
          d={amp3.to((a3, a4) => pathD(0, 0, a3, amp4.get()).path2)}
          fill={'hsl(var(--sine-wave-fill))'}
          className="opacity-50"
        />
        <animated.path
          d={amp1.to((a1, a2) => pathD(a1, amp2.get(), 0, 0).path1)}
          fill={'hsl(var(--sine-wave-fill))'}
        />
      </animated.svg>
    </div>
  );
}
