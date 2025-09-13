import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MapOverview() {
  const mapImage = PlaceHolderImages.find((p) => p.id === 'map');

  return (
    <Card>
      <CardContent className="p-2">
        <div className="aspect-video overflow-hidden rounded-md">
          {mapImage ? (
            <Image
              src={mapImage.imageUrl}
              alt="City Map Overview"
              width={1200}
              height={800}
              className="object-cover w-full h-full"
              data-ai-hint={mapImage.imageHint}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p>Map not available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
