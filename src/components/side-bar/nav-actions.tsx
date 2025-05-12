import { Coins, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import NotificationHeader from '../notification-header';
import { ModeToggle } from '../ui/mode-toggle';

export function NavActions() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
        <Coins className="h-4 w-4" />
        <span className="font-medium">1,250</span>
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <MessageCircle className="h-5 w-5" />
      </Button>

      <NotificationHeader />
      <ModeToggle />
    </div>
  );
}
