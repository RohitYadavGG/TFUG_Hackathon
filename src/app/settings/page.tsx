import SettingsForm from '@/components/settings/settings-form';
import { getLocations } from '@/lib/data';

export default async function SettingsPage() {
  const locations = await getLocations();

  return (
    <div className="space-y-8">
    <div>
        <h1 className="text-3xl font-bold font-headline">
        Threshold Configuration
        </h1>
        <p className="text-muted-foreground mt-2">
        Set custom safety thresholds for different locations within the city.
        </p>
    </div>
    <SettingsForm locations={locations} />
    </div>
  );
}
