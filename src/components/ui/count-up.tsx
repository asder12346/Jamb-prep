import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
}

export default function CountUp({ to, duration = 2, suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: "some" });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing function: easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeProgress * to));
        
        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
        }
      };
      
      animationFrame = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(animationFrame);
    }
  }, [inView, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}
