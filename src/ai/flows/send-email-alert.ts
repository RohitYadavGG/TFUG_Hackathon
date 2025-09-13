'use server';
/**
 * @fileOverview Sends an email alert. This is a placeholder and does not actually send an email.
 *
 * - sendEmailAlert: A function that takes email details and logs them.
 * - SendEmailAlertInput - The input type for the function.
 * - SendEmailAlertOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendEmailAlertInputSchema = z.object({
  subject: z.string().describe('The subject of the email.'),
  body: z.string().describe('The HTML body of the email.'),
});
export type SendEmailAlertInput = z.infer<typeof SendEmailAlertInputSchema>;

const SendEmailAlertOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendEmailAlertOutput = z.infer<typeof SendEmailAlertOutputSchema>;

export async function sendEmailAlert(input: SendEmailAlertInput): Promise<SendEmailAlertOutput> {
  return sendEmailAlertFlow(input);
}

const sendEmailAlertFlow = ai.defineFlow(
  {
    name: 'sendEmailAlertFlow',
    inputSchema: SendEmailAlertInputSchema,
    outputSchema: SendEmailAlertOutputSchema,
  },
  async ({ subject, body }) => {
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!recipientEmail) {
      const message = "Email not sent: RECIPIENT_EMAIL environment variable is not set.";
      console.error(message);
      return { success: false, message };
    }

    // In a real application, you would integrate with an email sending service
    // like SendGrid, Mailgun, or AWS SES here.
    // For this example, we will just log the action to the console.
    
    console.log('--- SENDING EMAIL ---');
    console.log(`To: ${recipientEmail}`);
    console.log(`Subject: ${subject}`);
    console.log('Body:');
    console.log(body);
    console.log('---------------------');

    const message = `Successfully logged email alert intended for ${recipientEmail}.`;
    return {
      success: true,
      message,
    };
  }
);
