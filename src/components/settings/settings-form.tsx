'use client';

import { useState } from 'react';
import type { Location } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SettingsForm({
  locations: initialLocations,
}: {
  locations: Location[];
}) {
  const [thresholds, setThresholds] = useState<Record<string, number>>(
    initialLocations.reduce((acc, loc) => ({ ...acc, [loc.id]: loc.threshold }), {})
  );
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would call a server action to save the data.
    console.log('Saving thresholds:', thresholds);
    toast({
      title: 'Settings Saved',
      description: 'Your new threshold configurations have been saved.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Location Thresholds</CardTitle>
        <CardDescription>
          Modify the crowd capacity threshold for each monitored location.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialLocations.map((location) => (
          <div key={location.id} className="space-y-2">
            <Label htmlFor={`threshold-${location.id}`}>{location.name}</Label>
            <Input
              id={`threshold-${location.id}`}
              type="number"
              value={thresholds[location.id]}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  [location.id]: parseInt(e.target.value, 10) || 0,
                })
              }
              className="max-w-xs"
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
