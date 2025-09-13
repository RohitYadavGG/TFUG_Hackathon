
'use client';

import { useState, useEffect } from 'react';
import { Bell, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Alert } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const severityConfig = {
  high: {
    icon: ShieldAlert,
    color: 'text-destructive',
    badgeVariant: 'destructive',
  },
  medium: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    badgeVariant: 'secondary',
  },
  low: {
    icon: null,
    color: 'text-blue-500',
    badgeVariant: 'default',
  },
};

const initialMockAlerts: Alert[] = [
    {
      id: 'mock-1',
      locationName: 'Market Street',
      message: 'Overcrowding detected at Market Street, exceeded by 10 people.',
      severity: 'high',
      recommendation: 'Divert visitors to Gate 2 and send security team immediately.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      locationName: 'Central Subway',
      message: 'WARNING: High crowd density at Central Subway. 280 people detected (Threshold: 300).',
      severity: 'medium',
      recommendation: 'Prepare for crowd control measures at Central Subway. Consider diverting new arrivals.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'mock-3',
      locationName: 'Temple Gate 1',
      message: 'Crowd at Temple Gate 1 is currently at 75 people (Threshold: 80).',
      severity: 'low',
      recommendation: 'Continue monitoring Temple Gate 1.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      prediction: {
        timeToThreshold: 15,
        series: [],
      },
    },
];

export default function NotificationBell() {
  const [alerts, setAlerts] = useState<Alert[]>(initialMockAlerts);
  const [unreadCount, setUnreadCount] = useState(initialMockAlerts.filter(a => a.severity !== 'low').length);

  useEffect(() => {
    // Query for medium and high severity alerts, ordered by timestamp
    const q = query(
      collection(db, 'crowd_alerts'),
      where('severity', 'in', ['high', 'medium']),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const alertsData: Alert[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        alertsData.push({
          id: doc.id,
          locationName: data.locationName,
          message: data.message,
          severity: data.severity,
          recommendation: data.recommendation,
          timestamp:
            (data.timestamp as Timestamp)?.toDate().toISOString() ||
            new Date().toISOString(),
          prediction: data.prediction,
        });
      });
      
      const newAlerts = [...initialMockAlerts, ...alertsData].reduce((acc, current) => {
          if (!acc.find(item => item.id === current.id)) {
              acc.push(current);
          }
          return acc;
      }, [] as Alert[]).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


      setAlerts(newAlerts);
      
      const newUnreadCount = newAlerts.filter(a => new Date(a.timestamp).getTime() > Date.now() - 5 * 60 * 1000 && a.severity !== 'low').length;
      setUnreadCount(newUnreadCount);

    });

    return () => unsubscribe();
  }, []);

  return (
    <DropdownMenu onOpenChange={(open) => !open && setUnreadCount(0)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[40vh]">
          {alerts.length > 0 ? (
            alerts.map((alert) => {
              const config = severityConfig[alert.severity] || severityConfig.low;
              const Icon = config.icon;
              return (
                <DropdownMenuItem
                  key={alert.id}
                  className={cn('flex flex-col items-start gap-2 p-3', config.color)}
                >
                  <div className="flex w-full justify-between items-start">
                    <div className="flex items-start gap-3">
                      {Icon && <Icon className="size-4 mt-0.5 shrink-0" />}
                      <p className="font-bold text-sm text-foreground">
                        {alert.message}
                      </p>
                    </div>
                    <Badge variant={config.badgeVariant} className="capitalize">
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="pl-7 w-full space-y-2">
                     <p className="text-xs text-muted-foreground">
                        {alert.recommendation}
                     </p>
                     <p className="text-xs text-muted-foreground/80 text-right">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                     </p>
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications.
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
