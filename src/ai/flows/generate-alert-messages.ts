'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating alert messages based on crowd density.
 *
 * The flow takes location, people count, and threshold as input and returns an alert message, severity, and recommendation.
 *
 * @file            src/ai/flows/generate-alert-messages.ts
 * @exports       generateAlertMessages - The function to generate alert messages.
 * @exports       GenerateAlertMessagesInput - The input type for the generateAlertMessages function.
 * @exports       GenerateAlertMessagesOutput - The return type for the generateAlertMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAlertMessagesInputSchema = z.object({
  location: z.string().describe('The location where the crowd density is being monitored.'),
  peopleCount: z.number().describe('The current number of people at the location.'),
  threshold: z.number().describe('The safety threshold for the number of people at the location.'),
});
export type GenerateAlertMessagesInput = z.infer<typeof GenerateAlertMessagesInputSchema>;

const GenerateAlertMessagesOutputSchema = z.object({
  alert: z.string().describe('A message for authorities describing the situation.'),
  severity: z
    .enum(['low', 'medium', 'high'])
    .describe('The severity of the overcrowding situation.'),
  recommendation: z.string().describe('A recommendation for what to do next.'),
});
export type GenerateAlertMessagesOutput = z.infer<typeof GenerateAlertMessagesOutputSchema>;

export async function generateAlertMessages(
  input: GenerateAlertMessagesInput
): Promise<GenerateAlertMessagesOutput> {
  return generateAlertMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAlertMessagesPrompt',
  input: {schema: GenerateAlertMessagesInputSchema},
  output: {schema: GenerateAlertMessagesOutputSchema},
  prompt: `You are an AI safety assistant for a Smart City system. You will receive live camera counts or descriptions of crowd density. If the number of people exceeds a safety threshold, you must generate a short, clear alert message for authorities. Also evaluate severity level and provide recommendation.

      Format response in JSON:
      {
        "alert": "message for authorities",
        "severity": "low | medium | high",
        "recommendation": "what to do next"
      }

      Here are the details:
      Location: {{{location}}}
      People Count: {{{peopleCount}}}
      Threshold: {{{threshold}}}

      Response: `,
});

const generateAlertMessagesFlow = ai.defineFlow(
  {
    name: 'generateAlertMessagesFlow',
    inputSchema: GenerateAlertMessagesInputSchema,
    outputSchema: GenerateAlertMessagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
