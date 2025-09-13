'use server';

import { analyzeCrowdDensity } from '@/ai/flows/analyze-crowd-density';
import { getLocationById } from '@/lib/data';
import type { Alert } from '@/lib/types';
import { z } from 'zod';

const analyzeDensitySchema = z.object({
  locationId: z.string(),
});

export async function analyzeDensityAction(
  formData: FormData
): Promise<{ alert: Alert; newPeopleCount: number }> {
  const validatedFields = analyzeDensitySchema.safeParse({
    locationId: formData.get('locationId'),
  });

  if (!validatedFields.success) {
    throw new Error('Invalid input');
  }

  const { locationId } = validatedFields.data;

  const location = await getLocationById(locationId);

  if (!location) {
    throw new Error('Location not found');
  }

  // In a real app, you would fetch the live people count.
  // Here we'll simulate a slight increase for demonstration.
  const currentPeople = Math.min(
    Math.floor(location.threshold * 1.5),
    location.currentPeople + Math.floor(Math.random() * 50) + 10
  );

  const result = await analyzeCrowdDensity({
    location: location.name,
    peopleCount: currentPeople,
    threshold: location.threshold,
  });

  const newAlert: Alert = {
    id: crypto.randomUUID(),
    locationName: location.name,
    message: result.alert,
    severity: result.severity,
    recommendation: result.recommendation,
    timestamp: new Date().toISOString(),
  };

  return { alert: newAlert, newPeopleCount: currentPeople };
}
