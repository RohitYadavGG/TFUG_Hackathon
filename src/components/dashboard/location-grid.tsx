import type { Location } from '@/lib/types';
import LocationCard from './location-card';

type LocationGridProps = {
  locations: Location[];
};

export default function LocationGrid({
  locations,
}: LocationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
        />
      ))}
    </div>
  );
}
