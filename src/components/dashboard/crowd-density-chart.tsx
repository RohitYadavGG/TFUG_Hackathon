'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { Location } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const chartConfig = {
  currentPeople: {
    label: 'Current Crowd',
    color: 'hsl(var(--foreground))',
  },
  threshold: {
    label: 'Threshold',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export default function CrowdDensityChart({
  locations,
}: {
  locations: Location[];
}) {
  const chartData = locations.map((loc) => ({
    name: loc.name.replace(/\s/g, ''), // Shorten names for chart
    currentPeople: loc.currentPeople,
    threshold: loc.threshold,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crowd vs. Threshold</CardTitle>
        <CardDescription>A comparison of current crowd levels against safety thresholds.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="currentPeople"
              fill="var(--color-currentPeople)"
              radius={4}
            />
            <Bar
              dataKey="threshold"
              fill="var(--color-threshold)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
