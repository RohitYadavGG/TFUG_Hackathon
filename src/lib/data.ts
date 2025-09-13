import type { Location } from '@/lib/types';

const locationsData: Location[] = [
  {
    id: 'gate-1',
    name: 'Temple Gate 1',
    threshold: 80,
    currentPeople: 75,
    rateOfIncrease: 'slow',
    characteristics: 'Main entrance, narrow passage.',
    cameraFeedImageId: '1',
  },
  {
    id: 'plaza-main',
    name: 'Main Plaza',
    threshold: 500,
    currentPeople: 350,
    rateOfIncrease: 'moderate',
    characteristics: 'Large open area, central gathering point.',
    cameraFeedImageId: '2',
  },
  {
    id: 'market-street',
    name: 'Market Street',
    threshold: 200,
    currentPeople: 210,
    rateOfIncrease: 'rapid',
    characteristics: 'Crowded marketplace with many stalls.',
    cameraFeedImageId: '3',
  },
  {
    id: 'subway-station',
    name: 'Central Subway',
    threshold: 300,
    currentPeople: 280,
    rateOfIncrease: 'moderate',
    characteristics: 'Underground station, multiple platforms.',
    cameraFeedImageId: '4',
  },
  {
    id: 'park-entrance',
    name: 'City Park Entrance',
    threshold: 150,
    currentPeople: 100,
    rateOfIncrease: 'slow',
    characteristics: 'Wide entrance to a large public park.',
    cameraFeedImageId: '5',
  },
  {
    id: 'concert-hall',
    name: 'Symphony Hall',
    threshold: 1200,
    currentPeople: 950,
    rateOfIncrease: 'slow',
    characteristics: 'Indoor concert venue.',
    cameraFeedImageId: '6',
  },
];

// Simulate fetching data from a database
export async function getLocations(): Promise<Location[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(locationsData);
    }, 500);
  });
}

export async function getLocationById(id: string): Promise<Location | undefined> {
    const locations = await getLocations();
    return locations.find((l) => l.id === id);
}
