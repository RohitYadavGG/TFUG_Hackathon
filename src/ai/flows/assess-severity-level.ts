'use server';

/**
 * @fileOverview Determines the severity level of overcrowding based on several factors.
 *
 * - assessSeverityLevel - A function that assesses the severity level of overcrowding.
 * - AssessSeverityLevelInput - The input type for the assessSeverityLevel function.
 * - AssessSeverityLevelOutput - The return type for the assessSeverityLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessSeverityLevelInputSchema = z.object({
  location: z.string().describe('The location where overcrowding is being assessed.'),
  peopleCount: z.number().describe('The current number of people at the location.'),
  threshold: z.number().describe('The safety threshold for the location.'),
  rateOfIncrease: z.string().describe('The rate at which the crowd size is increasing (e.g., slow, moderate, rapid).'),
  locationCharacteristics: z.string().describe('Description of the location (e.g., small enclosed space, large open area).'),
});
export type AssessSeverityLevelInput = z.infer<typeof AssessSeverityLevelInputSchema>;

const AssessSeverityLevelOutputSchema = z.object({
  severity: z.enum(['low', 'medium', 'high']).describe('The assessed severity level of the overcrowding.'),
  justification: z.string().describe('The reasoning behind the assigned severity level.'),
});
export type AssessSeverityLevelOutput = z.infer<typeof AssessSeverityLevelOutputSchema>;

export async function assessSeverityLevel(input: AssessSeverityLevelInput): Promise<AssessSeverityLevelOutput> {
  return assessSeverityLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessSeverityLevelPrompt',
  input: {schema: AssessSeverityLevelInputSchema},
  output: {schema: AssessSeverityLevelOutputSchema},
  prompt: `You are an AI safety assistant for a Smart City system.  Assess the severity of overcrowding at a given location based on the number of people, the safety threshold, the rate of increase in crowd size, and the characteristics of the location.

  Location: {{{location}}}
  People Count: {{{peopleCount}}}
  Threshold: {{{threshold}}}
  Rate of Increase: {{{rateOfIncrease}}}
  Location Characteristics: {{{locationCharacteristics}}}

  Consider these factors to determine the severity level (low, medium, or high) and provide a justification for your assessment. Focus on a clear and concise severity assessment along with reasoning. Return a JSON object with 'severity' and 'justification' fields.`,
});

const assessSeverityLevelFlow = ai.defineFlow(
  {
    name: 'assessSeverityLevelFlow',
    inputSchema: AssessSeverityLevelInputSchema,
    outputSchema: AssessSeverityLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
