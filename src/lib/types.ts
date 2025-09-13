export type Location = {
  id: string;
  name: string;
  threshold: number;
  currentPeople: number;
  rateOfIncrease: 'slow' | 'moderate' | 'rapid';
  characteristics: string;
  cameraFeedImageId: string;
  // Representing people flow per minute
  peopleIn: number; 
  peopleOut: number;
};

export type Alert = {
  id: string;
  locationName: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  timestamp: string;
  // Optional fields for predictive alerts
  prediction?: {
    timeToThreshold: number; // in minutes
  };
  audioAnnouncement?: string; // Data URI for the audio
};
