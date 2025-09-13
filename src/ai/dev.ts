import { config } from 'dotenv';
config();

import '@/ai/flows/generate-alert-messages.ts';
import '@/ai/flows/provide-automated-recommendations.ts';
import '@/ai/flows/assess-severity-level.ts';
import '@/ai/flows/analyze-crowd-density.ts';
import '@/ai/flows/predict-crowd-density.ts';
import '@/ai/flows/generate-announcement.ts';
import '@/ai/flows/send-email-alert.ts';
