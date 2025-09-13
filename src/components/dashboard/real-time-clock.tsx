'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function RealTimeClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client mount to avoid hydration mismatch
    setTime(new Date());

    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      <Clock className="size-4" />
      {time ? <span>{time.toLocaleTimeString()}</span> : <span>Loading...</span>}
    </div>
  );
}
