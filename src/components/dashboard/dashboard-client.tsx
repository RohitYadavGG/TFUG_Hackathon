'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import type { Location, Alert } from '@/lib/types';
import { analyzeDensityAction } from '@/app/actions';
import { simulatePeopleFlow } from '@/lib/data';

import LocationGrid from './location-grid';
import AlertsFeed from './alerts-feed';
import MapOverview from './map-overview';
import CrowdDensityChart from './crowd-density-chart';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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
  const [isProactiveMonitoring, setIsProactiveMonitoring] = useState(false);

  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleAnalyze = (locationId: string, isProactive = false) => {
    if (!isProactive) {
      setAnalyzingId(locationId);
    }
    startTransition(async () => {
      const formData = new FormData();
      formData.append('locationId', locationId);
      if (isProactive) {
        formData.append('isProactive', 'true');
      }

      try {
        const { alert: newAlert, newPeopleCount } =
          await analyzeDensityAction(formData);

        if (newAlert.id) { // Only add if it's a real alert
          setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);

          if (!isProactive) {
            toast({
              title: `Alert: ${newAlert.severity.toUpperCase()}`,
              description: `New alert generated for ${newAlert.locationName}.`,
              variant: newAlert.severity === 'high' ? 'destructive' : 'default',
            });
          }
        }
        
        setLocations((prevLocations) =>
          prevLocations.map((l) =>
            l.id === locationId ? { ...l, currentPeople: newPeopleCount } : l
          )
        );

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred.',
        });
      } finally {
        if (!isProactive) {
          setAnalyzingId(null);
        }
      }
    });
  };

  useEffect(() => {
    if (isProactiveMonitoring) {
      monitoringIntervalRef.current = setInterval(() => {
        // Simulate real-time data updates
        const updatedLocations = simulatePeopleFlow(locations);
        setLocations(updatedLocations);
        
        // Trigger analysis for all locations
        updatedLocations.forEach(location => {
          handleAnalyze(location.id, true);
        });

      }, 5000); // Check every 5 seconds
    } else {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    }

    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, [isProactiveMonitoring, locations]);


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-headline">Monitored Locations</h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="proactive-monitoring"
            checked={isProactiveMonitoring}
            onCheckedChange={setIsProactiveMonitoring}
          />
          <Label htmlFor="proactive-monitoring">Proactive Monitoring</Label>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <LocationGrid
            locations={locations}
            onAnalyze={handleAnalyze}
            isAnalyzing={isPending && !!analyzingId}
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
