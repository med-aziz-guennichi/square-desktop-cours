import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface filterProps {
  name: string;
  subjectId: string;
  instructorId: string;
}
export function ClassFilterPanel({
  activeFilters,
  updateFilter,
  removeFilter,
  clearAllFilters,
  subjects = [], // Pass available subjects as prop
  instructors = [], // Pass available instructors as prop
}: {
  filters: filterProps;
  activeFilters: filterProps;
  updateFilter: (type: 'name' | 'subject' | 'instructor', value: string) => void;
  removeFilter: (type: 'name' | 'subject' | 'instructor') => void;
  clearAllFilters: () => void;
  subjects?: { _id: string; name: string }[];
  instructors?: { _id: string; firstName: string; lastName: string }[];
}) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Name Search */}
        <div className="flex-1">
          <Input
            placeholder="Search by class name"
            value={activeFilters.name || ''}
            onChange={(e) => updateFilter('name', e.target.value)}
          />
        </div>

        {/* Subject Filter */}
        <Select
          value={activeFilters.subjectId}
          onValueChange={(value) => updateFilter('subject', value)}
          disabled
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aziz">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject._id} value={subject._id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Instructor Filter */}
        <Select
          value={activeFilters.instructorId || ''}
          onValueChange={(value) => updateFilter('instructor', value)}
          disabled
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by instructor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aziz">All Instructors</SelectItem>
            {instructors.map((instructor) => (
              <SelectItem key={instructor._id} value={instructor._id}>
                {instructor.firstName} {instructor.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filters display */}
      {activeFilters.name ||
      activeFilters.subjectId ||
      activeFilters.instructorId ? (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {activeFilters.name && (
            <Badge variant={'default'} className="flex items-center gap-1">
              Name: {activeFilters.name}
              <Button
                onClick={() => removeFilter('name')}
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
              >
                x
              </Button>
            </Badge>
          )}
          {activeFilters.subjectId && (
            <Badge variant={'outline'} className="flex items-center gap-1">
              Subject:{' '}
              {subjects.find((s) => s._id === activeFilters.subjectId)?.name}
              <Button
                onClick={() => removeFilter('subject')}
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
              >
                x
              </Button>
            </Badge>
          )}
          {activeFilters.instructorId && (
            <Badge variant={'outline'} className="flex items-center gap-1">
              Instructor:{' '}
              {
                instructors.find((i) => i._id === activeFilters.instructorId)
                  ?.firstName
              }
              <Button
                onClick={() => removeFilter('instructor')}
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
              >
                x
              </Button>
            </Badge>
          )}
          <Button
            variant={'outline'}
            size={'sm'}
            onClick={clearAllFilters}
            className="text-sm"
          >
            Clear all
          </Button>
        </div>
      ) : null}
    </div>
  );
}
