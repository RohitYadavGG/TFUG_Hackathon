import type { Alert as AlertType } from '@/lib/types';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  Lightbulb,
  MapPin,
  Clock,
  Forward,
  Volume2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type SeverityConfig = {
  [key in AlertType['severity']]: {
    icon: React.ElementType;
    color: string;
    title: string;
  };
};

const severityConfig: SeverityConfig = {
  high: {
    icon: ShieldAlert,
    color: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
    title: 'High Severity Alert',
  },
  medium: {
    icon: AlertTriangle,
    color: 'border-orange-500/50 text-orange-500 dark:border-orange-500 [&>svg]:text-orange-500',
    title: 'Medium Severity Alert',
  },
  low: {
    icon: Info,
    color: 'border-blue-500/50 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500',
    title: 'Low Severity Alert',
  },
};

export default function AlertCard({ alert }: { alert: AlertType }) {
  const config = severityConfig[alert.severity];

  const playAudio = () => {
    if (alert.audioAnnouncement) {
      const audio = new Audio(alert.audioAnnouncement);
      audio.play();
    }
  };

  return (
    <Alert className={cn('relative', config.color)}>
      <div className='flex justify-between items-start'>
        <config.icon className="h-5 w-5" />
        {alert.audioAnnouncement && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={playAudio}>
                <Volume2 className="h-4 w-4" />
            </Button>
        )}
      </div>

      <AlertTitle className="font-headline mb-2">{config.title}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{alert.message}</p>
        
        {alert.prediction && alert.prediction.timeToThreshold > 0 && (
          <div className="flex items-start gap-2 text-yellow-500 bg-yellow-500/10 p-2 rounded-md">
            <Forward className="size-4 mt-0.5 shrink-0" />
            <p className="text-xs">
              <span className="font-bold">Prediction: </span>
              Threshold may be reached in approximately {Math.ceil(alert.prediction.timeToThreshold)} minutes.
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 text-muted-foreground bg-accent/30 p-2 rounded-md">
          <Lightbulb className="size-4 mt-0.5 shrink-0" />
          <p className="text-xs">
            <span className="font-bold">Recommendation: </span>
            {alert.recommendation}
          </p>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3" />
            <span>{alert.locationName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3" />
            <time dateTime={alert.timestamp}>
              {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
            </time>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
