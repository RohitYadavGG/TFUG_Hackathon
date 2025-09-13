'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={() => reset()} className="mt-6">
          Try again
        </Button>
      </div>
    </div>
  );
}
