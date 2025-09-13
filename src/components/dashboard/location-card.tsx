import Image from 'next/image';
import type { Location } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, Cpu, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type LocationCardProps = {
  location: Location;
  onAnalyze: (locationId: string) => void;
  isAnalyzing: boolean;
};

export default function LocationCard({
  location,
  onAnalyze,
  isAnalyzing,
}: LocationCardProps) {
  const { id, name, currentPeople, threshold, cameraFeedImageId } = location;
  const percentage = Math.round((currentPeople / threshold) * 100);
  const isOverThreshold = currentPeople > threshold;

  const image = PlaceHolderImages.find((p) => p.id === cameraFeedImageId);

  const getProgressColor = () => {
    if (percentage > 90) return 'bg-destructive';
    if (percentage > 70) return 'bg-orange-500';
    return 'bg-primary';
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">{name}</CardTitle>
        <CardDescription>Live crowd monitoring</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {image && (
          <div className="aspect-video overflow-hidden rounded-md">
            <Image
              src={image.imageUrl}
              alt={`Camera feed for ${name}`}
              width={600}
              height={400}
              className="object-cover w-full h-full"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              <span>Crowd Level</span>
            </div>
            <span
              className={cn(
                'font-bold',
                isOverThreshold ? 'text-destructive' : 'text-foreground'
              )}
            >
              {currentPeople} / {threshold}
            </span>
          </div>
          <Progress
            value={percentage}
            className="h-2"
            indicatorClassName={getProgressColor()}
          />
          {isOverThreshold && (
            <div className="flex items-center gap-2 text-destructive text-xs mt-2">
              <AlertTriangle className="size-3.5" />
              <span>Threshold exceeded by {currentPeople - threshold}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <form action={() => onAnalyze(id)} className="w-full">
          <Button className="w-full" type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Cpu />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Density'}</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
