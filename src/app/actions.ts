'use server';

import { predictCrowdDensity } from '@/ai/flows/predict-crowd-density';
import { getLocationById } from '@/lib/data';
import type { Alert } from '@/lib/types';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const analyzeDensitySchema = z.object({
  locationId: z.string(),
  isProactive: z.boolean().optional(),
});

export async function analyzeDensityAction(
  formData: FormData
): Promise<{ alert: Alert | null; newPeopleCount: number }> {
  const validatedFields = analyzeDensitySchema.safeParse({
    locationId: formData.get('locationId'),
    isProactive: formData.get('isProactive') === 'true',
  });

  if (!validatedFields.success) {
    throw new Error('Invalid input');
  }

  const { locationId, isProactive } = validatedFields.data;

  const location = await getLocationById(locationId);

  if (!location) {
    throw new Error('Location not found');
  }

  // In a real app, you would fetch the live people count.
  // Here we'll simulate a slight increase for demonstration.
  const currentPeople = isProactive
    ? location.currentPeople // Use the updated count for proactive checks
    : Math.min(
        Math.floor(location.threshold * 1.5),
        location.currentPeople + Math.floor(Math.random() * 50) + 10
      );
  
  if (isProactive && currentPeople < location.threshold * 0.8) {
     // For proactive checks, only trigger if it's getting close to the threshold
     // to avoid too many unnecessary alerts.
     return { 
       alert: null, 
       newPeopleCount: currentPeople 
    };
  }

  const result = await predictCrowdDensity({
    location: location.name,
    peopleCount: currentPeople,
    threshold: location.threshold,
    peopleIn: location.peopleIn,
    peopleOut: location.peopleOut,
  });

  const newAlert: Omit<Alert, 'id' | 'timestamp'> = {
    locationName: location.name,
    message: result.alert,
    severity: result.severity,
    recommendation: result.recommendation,
    prediction: result.prediction,
    audioAnnouncement: result.audioAnnouncement,
  };

  // Save to Firestore
  const docRef = await addDoc(collection(db, 'crowd_alerts'), {
    ...newAlert,
    timestamp: serverTimestamp(),
  });

  return {
    alert: {
      ...newAlert,
      id: docRef.id,
      timestamp: new Date().toISOString(),
    },
    newPeopleCount: currentPeople,
  };
}
