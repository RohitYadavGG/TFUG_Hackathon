import type { Alert } from '@/lib/types';
import AlertCard from './alert-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellRing } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AlertsFeed({ alerts }: { alerts: Alert[] }) {
  const sortedAlerts = [...alerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className="h-full">
      <ScrollArea className="h-[70vh] rounded-lg">
        <div className="p-6">
          {sortedAlerts.length > 0 ? (
            <div className="space-y-4">
              {sortedAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground">
              <BellRing className="size-12 mb-4" />
              <h3 className="text-lg font-semibold">No Alerts</h3>
              <p className="text-sm">System is stable. All clear.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
