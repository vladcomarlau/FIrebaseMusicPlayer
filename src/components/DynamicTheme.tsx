
'use client';

import { useMusic } from '@/contexts/MusicContext';
import { useEffect, type ReactNode } from 'react';
import { useTheme } from 'next-themes';

export function DynamicTheme({ children }: { children: ReactNode }) {
  const { hue } = useMusic();
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--hue', hue.toString());
    
    // Calculate HSL color for the theme-color meta tag
    // Using the primary color values from globals.css to ensure they match
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const saturation = '100%';
    const lightness = isDark ? '65%' : '55%';
    const primaryColor = `hsl(${hue}, ${saturation}, ${lightness})`;

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
    }
    
    metaThemeColor.setAttribute('content', primaryColor);

  }, [hue, theme]);

  return <>{children}</>;
}
