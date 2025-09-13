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
import { Progress } from '@/components/ui/progress';
import {
  Users,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Clock,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';
import RealTimeClock from './real-time-clock';


type LocationCardProps = {
  location: Location;
};

export default function LocationCard({
  location,
}: LocationCardProps) {
  const { id, name, currentPeople, threshold, cameraFeedImageId, peopleIn, peopleOut, predictiveAlert } = location;
  const percentage = Math.round((currentPeople / threshold) * 100);
  const isOverThreshold = currentPeople > threshold;

  const image = PlaceHolderImages.find((p) => p.id === cameraFeedImageId);

  const getProgressColor = () => {
    if (percentage > 90) return 'bg-destructive';
    if (percentage > 70) return 'bg-orange-500';
    return 'bg-primary';
  };

  return (
    <Card className="flex flex-col relative overflow-hidden">
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
        <div className="space-y-4">
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
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ArrowUp className="size-4 text-green-500" />
              <span>In: {peopleIn}/min</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowDown className="size-4 text-red-500" />
              <span>Out: {peopleOut}/min</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-muted-foreground text-sm p-2 rounded-md bg-muted/50">
             {predictiveAlert?.prediction?.timeToThreshold && predictiveAlert.prediction.timeToThreshold > 0 ? (
                <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold">
                    <Clock className="size-4" />
                    <span>Threshold in {formatDuration(predictiveAlert.prediction.timeToThreshold * 60)}</span>
                </div>
            ) : (
                <RealTimeClock />
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
