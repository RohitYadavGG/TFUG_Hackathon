'use client';

import { useState, useTransition } from 'react';
import type { Location, Alert } from '@/lib/types';
import { analyzeDensityAction } from '@/app/actions';

import LocationGrid from './location-grid';
import AlertsFeed from './alerts-feed';
import MapOverview from './map-overview';
import CrowdDensityChart from './crowd-density-chart';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function DashboardClient({
  initialLocations,
}: {
  initialLocations: Location[];
}) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isPending, startTransition] = useTransition();
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = (locationId: string) => {
    setAnalyzingId(locationId);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('locationId', locationId);

      try {
        const { alert: newAlert, newPeopleCount } =
          await analyzeDensityAction(formData);

        setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);

        setLocations((prevLocations) =>
          prevLocations.map((l) =>
            l.id === locationId ? { ...l, currentPeople: newPeopleCount } : l
          )
        );

        toast({
            title: `Alert: ${newAlert.severity.toUpperCase()}`,
            description: `New alert generated for ${newAlert.locationName}.`,
            variant: newAlert.severity === 'high' ? 'destructive' : 'default',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description:
            error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      } finally {
        setAnalyzingId(null);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <h2 className="text-2xl font-bold font-headline">Monitored Locations</h2>
          <LocationGrid
            locations={locations}
            onAnalyze={handleAnalyze}
            isAnalyzing={isPending}
            analyzingId={analyzingId}
          />
        </div>
        <div className="space-y-6 lg:col-span-1">
          <h2 className="text-2xl font-bold font-headline">Alerts Feed</h2>
          <AlertsFeed alerts={alerts} />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <h2 className="text-2xl font-bold font-headline">City Overview</h2>
          <MapOverview />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <h2 className="text-2xl font-bold font-headline">Crowd Analytics</h2>
          <CrowdDensityChart locations={locations} />
        </div>
      </div>
    </div>
  );
}
