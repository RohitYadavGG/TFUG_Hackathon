'use server';
/**
 * @fileOverview Predicts crowd density and generates alerts with audio announcements.
 *
 * - predictCrowdDensity: Analyzes current crowd data, predicts future density, and generates alerts.
 * - PredictCrowdDensityInput: Input for the prediction flow.
 * - PredictCrowdDensityOutput: Output from the prediction flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateAnnouncement } from './generate-announcement';

const PredictCrowdDensityInputSchema = z.object({
  location: z.string().describe('The location of the camera feed.'),
  peopleCount: z.number().describe('The number of people detected.'),
  threshold: z.number().describe('The safety threshold for the location.'),
  peopleIn: z.number().describe('Rate of people entering per minute.'),
  peopleOut: z.number().describe('Rate of people exiting per minute.'),
});
export type PredictCrowdDensityInput = z.infer<typeof PredictCrowdDensityInputSchema>;

const PredictCrowdDensityOutputSchema = z.object({
  alert: z.string().describe('The alert message for authorities.'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity level.'),
  recommendation: z.string().describe('The recommendation for authorities.'),
  prediction: z.object({
    timeToThreshold: z.number().describe('Predicted time in minutes to reach the threshold. Negative if already over.'),
  }),
  audioAnnouncement: z.string().optional().describe('Data URI of the generated audio announcement.'),
});
export type PredictCrowdDensityOutput = z.infer<typeof PredictCrowdDensityOutputSchema>;

export async function predictCrowdDensity(input: PredictCrowdDensityInput): Promise<PredictCrowdDensityOutput> {
  return predictCrowdDensityFlow(input);
}

const predictCrowdDensityFlow = ai.defineFlow(
  {
    name: 'predictCrowdDensityFlow',
    inputSchema: PredictCrowdDensityInputSchema,
    outputSchema: PredictCrowdDensityOutputSchema,
  },
  async (input) => {
    const { location, peopleCount, threshold, peopleIn, peopleOut } = input;

    const netFlow = peopleIn - peopleOut;
    const remainingCapacity = threshold - peopleCount;
    let timeToThreshold = -1;

    if (netFlow > 0 && remainingCapacity > 0) {
      timeToThreshold = remainingCapacity / netFlow;
    }

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (peopleCount > threshold) {
      severity = 'high';
    } else if (peopleCount > threshold * 0.8 || (timeToThreshold > 0 && timeToThreshold < 10)) {
      severity = 'medium';
    }

    let alertMessage = `Crowd at ${location} is currently at ${peopleCount} people (Threshold: ${threshold}).`;
    if (severity === 'high') {
      alertMessage = `CRITICAL: Overcrowding at ${location}. ${peopleCount} people detected, exceeding threshold of ${threshold}.`;
    } else if (severity === 'medium') {
      alertMessage = `WARNING: High crowd density at ${location}. ${peopleCount} people detected (Threshold: ${threshold}).`;
    }

    let recommendation = `Continue monitoring ${location}.`;
    if (severity === 'high') {
      recommendation = `Immediate action required. Divert traffic from ${location} and dispatch personnel.`;
    } else if (severity === 'medium') {
      recommendation = `Prepare for crowd control measures at ${location}. Consider diverting new arrivals.`;
    }

    let audioAnnouncement: string | undefined;
    if (severity !== 'low') {
        const announcementTextFlow = ai.defineFlow({ name: 'announcementTextFlow', inputSchema: z.any(), outputSchema: z.string() }, async (promptInput) => {
            const llmResponse = await ai.generate({
                prompt: `Generate a brief, clear audio announcement for this situation: ${promptInput.alert}. The location is ${promptInput.location}. Recommend visitors to move to less crowded areas.`,
            });
            return llmResponse.text;
        });

        const announcementText = await announcementTextFlow({ alert: alertMessage, location });
        const audioResponse = await generateAnnouncement({ text: announcementText });
        audioAnnouncement = audioResponse.media;
    }
    
    return {
      alert: alertMessage,
      severity,
      recommendation,
      prediction: {
        timeToThreshold,
      },
      audioAnnouncement,
    };
  }
);
