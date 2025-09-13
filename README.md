# SmartGuard: AI-Powered City Safety Monitor

<h2>Problem Statement</h2>
<p>Large gatherings in public places (temples, stadiums, concerts, metro stations) can become <strong>dangerous due to overcrowding</strong>. When too many people gather in a small area, the risk of <strong>stampedes increases</strong>, leading to injuries and fatalities. Real-time monitoring and preventive action are often missing in such scenarios.</p>

<h2>Our Idea</h2>
<ul>
    <li>Uses <strong>camera feeds</strong> to detect crowd density in real-time.</li>
    <li>Monitors if the <strong>number of people exceeds a safe threshold</strong>.</li>
    <li>Automatically generates <strong>alerts for authorities</strong> and provides <strong>recommendations to control crowd flow</strong>.</li>
</ul>

<h2>Solutions & Features</h2>
<ul>
    <li><strong>Realtime Crowd Detection:</strong> Detects how many people are present using AI-based computer vision (YOLO / Firebase + Gemini).</li>
    <li><strong>Alerts & Recommendations:</strong> Generates actionable messages like “Divert visitors to Gate 2” when overcrowding occurs.</li>
    <li><strong>Dashboard:</strong> Displays live crowd alerts with severity and location.</li>
    <li><strong>Firebase Integration:</strong> Stores reports and alerts for easy access and historical tracking.</li>
    <li><strong>Scalable & Fast:</strong> Works in large venues, enabling authorities to act quickly and prevent stampedes.</li>
</ul>

<h2>Stampede Scenario: India vs Other Countries</h2>
<p>India, despite having robust infrastructure in many areas, <strong>experiences a higher number of stampede incidents</strong> compared to many other countries.</p>

<h3>Notable Stampede Cases in India</h3>
<ul>
    <li><strong>Sabarimala, Kerala (2011):</strong> 106 people died during the Makara Jyothi pilgrimage.</li>
    <li><strong>Maharashtra, Mumbai (1993):</strong> Over 300 people died at the Laxmi Pooja procession.</li>
    <li><strong>Prayagraj, Uttar Pradesh (2013):</strong> 36 people died during the Kumbh Mela.</li>
    <li><strong>Ranchi, Jharkhand (2010):</strong> 21 people died in a local fair stampede.</li>
    <li><strong>Delhi (2010), Patna (2013):</strong> Several smaller stampedes at festivals and metro stations.</li>
</ul>

<h3>Comparison with Other Countries</h3>
<p>Many countries with <strong>large public events</strong> (USA, Germany, Japan) experience <strong>far fewer fatal stampedes</strong>, even with large crowds.</p>
<p><strong>Reasons India still faces challenges:</strong></p>
<ul>
    <li>Larger crowds in limited spaces, sometimes exceeding safety thresholds.</li>
    <li>Limited real-time alerts and preventive measures in many traditional or religious venues.</li>
</ul>

<blockquote>
Our <strong>Smart Crowd Safety System</strong> aims to bridge this gap by providing <strong>real-time monitoring and actionable alerts</strong>, helping authorities prevent stampedes and save lives, even in the most crowded Indian events.
</blockquote>

<h2>Impact</h2>
<p>This system can help <strong>prevent accidents, reduce risk, and save lives</strong> by giving <strong>authorities timely data and actionable recommendations</strong> to manage crowds effectively.</p>

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
