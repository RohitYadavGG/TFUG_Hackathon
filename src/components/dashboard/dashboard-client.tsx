'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import type { Location, Alert } from '@/lib/types';
import { analyzeDensityAction } from '@/app/actions';
import { simulatePeopleFlow } from '@/lib/data';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

import LocationGrid from './location-grid';
import MapOverview from './map-overview';
import CrowdDensityChart from './crowd-density-chart';
import PredictionModal from './prediction-modal';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const initialMockAlerts: Alert[] = [
    {
      id: 'mock-1',
      locationName: 'Market Street',
      message: 'CRITICAL: Overcrowding at Market Street. 210 people detected, exceeding threshold of 200.',
      severity: 'high',
      recommendation: 'Immediate action required. Divert traffic from Market Street and dispatch personnel.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      locationName: 'Central Subway',
      message: 'WARNING: High crowd density at Central Subway. 280 people detected (Threshold: 300).',
      severity: 'medium',
      recommendation: 'Prepare for crowd control measures at Central Subway. Consider diverting new arrivals.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'mock-3',
      locationName: 'Temple Gate 1',
      message: 'Crowd at Temple Gate 1 is currently at 75 people (Threshold: 80).',
      severity: 'low',
      recommendation: 'Continue monitoring Temple Gate 1.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      prediction: {
        timeToThreshold: 15,
        series: [],
      },
    },
];

export default function DashboardClient({
  initialLocations,
}: {
  initialLocations: Location[];
}) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isProactiveMonitoring, setIsProactiveMonitoring] = useState(false);
  const [predictionData, setPredictionData] = useState<{
    location: Location;
    alert: Alert;
  } | null>(null);
  const [predictiveAlert, setPredictiveAlert] = useState<Alert | null>(null);

  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Firestore listener for real-time alerts
  useEffect(() => {
    const q = query(
      collection(db, 'crowd_alerts'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const alertsData: Alert[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        alertsData.push({
          id: doc.id,
          locationName: data.locationName,
          message: data.message,
          severity: data.severity,
          recommendation: data.recommendation,
          timestamp:
            (data.timestamp as Timestamp)?.toDate().toISOString() ||
            new Date().toISOString(),
          prediction: data.prediction,
          audioAnnouncement: data.audioAnnouncement,
        });
      });
    });

    return () => unsubscribe();
  }, []);

  const handleAnalyze = (locationId: string, isProactive = false) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('locationId', locationId);
      if (isProactive) {
        formData.append('isProactive', 'true');
      }

      try {
        const { alert: newAlert, newPeopleCount } =
          await analyzeDensityAction(formData);

        setLocations((prev) =>
            prev.map((l) =>
              l.id === locationId ? { ...l, currentPeople: newPeopleCount, predictiveAlert: newAlert } : l
            )
        );

        const location = locations.find((l) => l.id === locationId);

        if (newAlert && location) {
          const timeToThreshold = newAlert.prediction?.timeToThreshold ?? -1;
          const isPredictive = timeToThreshold > 0;

          if (isPredictive && timeToThreshold <= 50) {
             setPredictiveAlert(newAlert);
          }

          if (!isProactive) {
            if (newAlert.prediction?.series) {
              setPredictionData({ location: {...location, currentPeople: newPeopleCount}, alert: newAlert });
            }
            if (newAlert.severity !== 'low') {
              toast({
                title: `Alert: ${newAlert.severity.toUpperCase()}`,
                description: `New alert generated for ${newAlert.locationName}.`,
                variant: newAlert.severity === 'high' ? 'destructive' : 'default',
              });
            }
          }
        }
      } catch (error) {
        if (!isProactive) { // Only show toast for manual analysis
            toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description:
                error instanceof Error
                ? error.message
                : 'An unknown error occurred.',
            });
        }
      }
    });
  };
  

  // Effect for proactive monitoring
  useEffect(() => {
    if (isProactiveMonitoring) {
      monitoringIntervalRef.current = setInterval(() => {
        setLocations(currentLocations => {
            const updatedLocations = simulatePeopleFlow(currentLocations);
            updatedLocations.forEach((location) => {
                handleAnalyze(location.id, true);
            });
            return updatedLocations;
        });
      }, 5 * 60 * 1000); // Check every 5 minutes
    } else {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
      // Reset predictive alerts on locations when monitoring is turned off
      setLocations(prev => prev.map(l => ({...l, predictiveAlert: null})));
    }

    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, [isProactiveMonitoring]);
  
  // Effect for handling predictive alert audio
  useEffect(() => {
    if (predictiveAlert && predictiveAlert?.prediction?.timeToThreshold <= 30 && predictiveAlert.audioAnnouncement) {
      if (audioRef.current) {
        audioRef.current.src = predictiveAlert.audioAnnouncement;
        audioRef.current.loop = true;
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.loop = false;
      }
    }
  }, [predictiveAlert]);


  return (
    <>
      <audio ref={audioRef} />
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">
            Monitored Locations
          </h2>
          <div className="flex items-center space-x-2">
            <Switch
              id="proactive-monitoring"
              checked={isProactiveMonitoring}
              onCheckedChange={setIsProactiveMonitoring}
            />
            <Label htmlFor="proactive-monitoring">Proactive Monitoring</Label>
          </div>
        </div>
        <LocationGrid
          locations={locations}
        />

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
      <PredictionModal
        isOpen={!!predictionData}
        onClose={() => setPredictionData(null)}
        data={predictionData}
      />
      <AlertDialog
        open={!!predictiveAlert}
        onOpenChange={() => {
            setPredictiveAlert(null);
             if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.loop = false;
            }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ⚠️ Predictive Alert: {predictiveAlert?.locationName}
            </AlertDialogTitle>
            <AlertDialogDescription>
                {`Overcrowding predicted in approximately ${Math.ceil(predictiveAlert?.prediction?.timeToThreshold || 0)} minutes.`}
                <br/>
                {predictiveAlert?.recommendation}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setPredictiveAlert(null)}>
              Acknowledge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
