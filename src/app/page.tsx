import DashboardClient from '@/components/dashboard/dashboard-client';
import { getLocations } from '@/lib/data';

export default async function DashboardPage() {
  const locations = await getLocations();

  return <DashboardClient initialLocations={locations} />;
}
