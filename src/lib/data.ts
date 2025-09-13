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
    peopleIn: 10,
    peopleOut: 5,
  },
  {
    id: 'plaza-main',
    name: 'Main Plaza',
    threshold: 500,
    currentPeople: 350,
    rateOfIncrease: 'moderate',
    characteristics: 'Large open area, central gathering point.',
    cameraFeedImageId: '2',
    peopleIn: 50,
    peopleOut: 30,
  },
  {
    id: 'market-street',
    name: 'Market Street',
    threshold: 200,
    currentPeople: 210,
    rateOfIncrease: 'rapid',
    characteristics: 'Crowded marketplace with many stalls.',
    cameraFeedImageId: '3',
    peopleIn: 40,
    peopleOut: 15,
  },
  {
    id: 'central-gateway',
    name: 'Central Gateway',
    threshold: 180,
    currentPeople: 150,
    rateOfIncrease: 'moderate',
    characteristics: 'A new gateway',
    cameraFeedImageId: '7',
    peopleIn: 30,
    peopleOut: 20,
  },
  {
    id: 'park-entrance',
    name: 'City Park Entrance',
    threshold: 150,
    currentPeople: 100,
    rateOfIncrease: 'slow',
    characteristics: 'Wide entrance to a large public park.',
    cameraFeedImageId: '5',
    peopleIn: 20,
    peopleOut: 25,
  },
  {
    id: 'concert-hall',
    name: 'Symphony Hall',
    threshold: 1200,
    currentPeople: 950,
    rateOfIncrease: 'slow',
    characteristics: 'Indoor concert venue.',
    cameraFeedImageId: '6',
    peopleIn: 100,
    peopleOut: 110,
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

export function simulatePeopleFlow(locations: Location[]): Location[] {
  return locations.map(loc => {
    const peopleChange = Math.floor(Math.random() * (loc.peopleIn / 4)) - Math.floor(Math.random() * (loc.peopleOut / 4));
    const newPeopleCount = Math.max(0, loc.currentPeople + peopleChange);
    return {
      ...loc,
      currentPeople: newPeopleCount,
    };
  });
}
