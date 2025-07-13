
"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface MarqueeTextProps {
  children: React.ReactNode;
  className?: string;
  isScrolling?: boolean;
  forceScroll?: boolean;
}

export function MarqueeText({ children, className, isScrolling, forceScroll = false }: MarqueeTextProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      const current = textRef.current;
      if (current) {
        const hasOverflow = current.scrollWidth > current.clientWidth;
        setIsOverflowing(hasOverflow);
      }
    };

    checkOverflow();
    // Using a timeout to re-check after styles might have settled
    const timeoutId = setTimeout(checkOverflow, 100);

    window.addEventListener('resize', checkOverflow);
    
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
      if (textRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(textRef.current);
      }
    };
  }, [children]);

  useEffect(() => {
    if (isScrolling) {
      setAnimationKey(prevKey => prevKey + 1);
    }
  }, [isScrolling]);

  const shouldAnimate = isOverflowing && forceScroll;
  const marqueeContent = shouldAnimate 
    ? <>{children}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{children}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
    : <>{children}</>;
  
  const animationClass = shouldAnimate ? "animate-marquee-long" : "";

  return (
    <div
      className={cn(
        "group/marquee w-full overflow-hidden",
         shouldAnimate && !isScrolling && "animate-marquee-mask"
      )}
    >
      <p
        key={animationKey}
        ref={textRef}
        className={cn(
          "font-medium whitespace-nowrap",
          animationClass,
          isScrolling && 'pause',
          "group-hover/marquee:pause",
          className
        )}
      >
        {marqueeContent}
      </p>
    </div>
  );
}
