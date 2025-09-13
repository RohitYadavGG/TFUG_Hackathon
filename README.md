# SmartGuard: AI-Powered City Safety Monitor

![SmartGuard Dashboard](https://github.com/user-attachments/assets/15a8a69e-4e4c-473d-8e4a-9e19a4b3d7b4)

## Overview

SmartGuard is an advanced, AI-powered dashboard designed for proactive crowd management and public safety. It provides city authorities with a centralized, real-time overview of various locations, leveraging Google's **Gemini 2.5 Flash** model to monitor crowd density, predict potential overcrowding, and offer actionable insights to maintain safety and order.

The system features a dynamic and intuitive interface where each monitored location is represented by a card displaying live data, including a predictive countdown timer that estimates when a location's capacity will be reached. This allows authorities to anticipate and mitigate risks before they escalate.

## Key Features

- **Live Crowd Monitoring**: Interactive cards display real-time data on crowd levels for multiple city locations, comparing them against configurable safety thresholds.
- **Predictive Analytics**: Utilizes Gemini 2.5 Flash to forecast when a location's crowd capacity will be reached, showing a live countdown timer for each area.
- **Automated Multi-Severity Alerts**: Generates 'low', 'medium', or 'high' severity alerts when crowd density approaches or exceeds thresholds, complete with details in a centralized notification feed.
- **Actionable Recommendations**: Provides AI-generated recommendations for authorities to manage crowd flow and mitigate risks during overcrowded situations.
- **Audio Announcements**: Capable of generating text-to-speech announcements for public broadcast in critical situations.
- **Email Notifications**: Automatically sends email alerts to designated personnel during high-severity events to ensure immediate awareness.
- **Centralized Dashboard**: A user-friendly interface featuring a map overview, location-specific cards, and a real-time alerts feed.
- **Configurable Thresholds**: An easy-to-use settings page that allows administrators to set and adjust safety thresholds for each monitored location.
- **Secure Access**: A complete login/logout flow ensures that only authorized personnel can access the dashboard.
- **User Profile**: A dedicated profile page displays user information and role.

## Tech Stack

-   **Frontend**: Next.js, React, TypeScript
-   **UI**: ShadCN UI, Tailwind CSS
-   **Generative AI**: Google's Gemini 2.5 Flash model via Genkit
-   **Database**: Firestore for real-time alert storage
-   **Deployment**: Firebase App Hosting