import type { Location } from '@/lib/types';
import LocationCard from './location-card';

type LocationGridProps = {
  locations: Location[];
  onAnalyze: (locationId: string) => void;
  isAnalyzing: boolean;
  analyzingId: string | null;
};

export default function LocationGrid({
  locations,
  onAnalyze,
  isAnalyzing,
  analyzingId,
}: LocationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing && analyzingId === location.id}
        />
      ))}
    </div>
  );
}
