'use client';

import { Button } from '@/components/ui/button';

interface EmptyResultsProps {
  clearAllFilters?: () => void;
  label?: string;
}

export function EmptyResults({ clearAllFilters, label }: EmptyResultsProps) {
  return (
    <div className="col-span-3 flex justify-center items-center py-12">
      <div className="text-center">
        <h3 className="text-lg font-medium">No {label ?? 'classes'} found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or search criteria
        </p>
        <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
