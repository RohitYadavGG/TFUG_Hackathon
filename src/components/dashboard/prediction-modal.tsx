import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend, ReferenceLine } from 'recharts';
import type { Alert, Location } from '@/lib/types';
import { AlertTriangle, Users } from 'lucide-react';

type PredictionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: {
    location: Location;
    alert: Alert;
  } | null;
};

const chartConfig = {
  predicted: {
    label: 'Predicted Crowd',
    color: 'hsl(var(--chart-1))',
  },
  threshold: {
    label: 'Threshold',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export default function PredictionModal({
  isOpen,
  onClose,
  data,
}: PredictionModalProps) {
  if (!data) return null;

  const { location, alert } = data;
  const chartData = alert.prediction?.series || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Crowd Prediction for {location.name}
          </DialogTitle>
          <DialogDescription>
            Predicted crowd count for the next 30 minutes based on current trends.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              accessibilityLayer
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="minute"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}m`}
              />
              <YAxis
                domain={['dataMin - 20', `dataMax + ${location.threshold * 0.1}`]}
                allowDataOverflow
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend />
              <ReferenceLine
                y={location.threshold}
                label={{ value: 'Threshold', position: 'insideTopLeft' }}
                stroke="hsl(var(--destructive))"
                strokeDasharray="3 3"
              />
              <Line
                dataKey="count"
                type="monotone"
                stroke="var(--color-predicted)"
                strokeWidth={2}
                dot={true}
                name="Predicted"
              />
            </LineChart>
          </ChartContainer>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="size-4" />
                <h4 className="font-semibold">Current State</h4>
              </div>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium">Current Crowd:</span> {location.currentPeople}
                </p>
                <p>
                  <span className="font-medium">Flow:</span> {location.peopleIn - location.peopleOut} people/min
                </p>
              </div>
            </div>
            {alert.prediction && (alert.prediction.timeToThreshold > 0) && (
              <div className="rounded-lg bg-yellow-500/10 p-3 text-yellow-600 dark:text-yellow-400">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4" />
                  <h4 className="font-semibold">Prediction</h4>
                </div>
                <p className="mt-2">
                  Threshold may be reached in approximately{' '}
                  <span className="font-bold">{Math.ceil(alert.prediction.timeToThreshold)} minutes</span> if current trends continue.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
