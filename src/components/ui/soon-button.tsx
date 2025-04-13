import { Badge } from './badge';

export function SoonBadge() {
  return (
    <Badge
      variant="destructive"
      className="ml-auto rounded-full px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground"
    >
      Soon
    </Badge>
  );
}
