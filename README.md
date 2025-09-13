# SmartGuard City Safety Monitor

SmartGuard is an advanced, AI-powered dashboard designed for real-time crowd management and public safety. It provides a comprehensive overview of various locations across a city, monitoring crowd density and predicting potential overcrowding before it happens. By leveraging generative AI, SmartGuard offers predictive insights, automated alerts, and actionable recommendations to help authorities maintain safety and order.

## Key Features

- **Live Crowd Monitoring**: Displays real-time data on crowd levels for multiple locations, comparing them against configurable safety thresholds.
- **Predictive Analytics**: Utilizes AI to forecast when a location's crowd capacity will be reached, showing a live countdown timer for each area.
- **Automated Multi-Severity Alerts**: Generates alerts with 'low', 'medium', or 'high' severity when crowd density approaches or exceeds thresholds, complete with details in a centralized notification feed.
- **Actionable Recommendations**: Provides AI-generated recommendations for authorities to manage crowd flow and mitigate risks during overcrowded situations.
- **Audio Announcements**: Capable of generating text-to-speech announcements for public broadcast in critical situations.
- **Email Notifications**: Automatically sends email alerts to designated personnel during high-severity events to ensure immediate awareness.
- **Centralized Dashboard**: A user-friendly interface featuring a map overview, location-specific cards with live data, and a real-time alerts feed.
- **Configurable Thresholds**: An easy-to-use settings page that allows administrators to set and adjust safety thresholds for each monitored location.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI**: ShadCN UI, Tailwind CSS
- **Generative AI**: Google's Gemini models via Genkit
- **Database**: Firestore for real-time alert storage
- **Deployment**: Firebase App Hosting
