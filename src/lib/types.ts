export type Location = {
  id: string;
  name: string;
  threshold: number;
  currentPeople: number;
  rateOfIncrease: 'slow' | 'moderate' | 'rapid';
  characteristics: string;
  cameraFeedImageId: string;
};

export type Alert = {
  id: string;
  locationName: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  timestamp: string;
};
