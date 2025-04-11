import { SubjectsInstructor } from '@/types/classe.interface';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';

export interface ClassFilters {
  search: string;
  dateRange: DateRange;
  gender: 'homme' | 'femme' | 'balanced' | '';
  instructorCount: '1' | '2-3' | '4+' | '';
  studentCount: 'small' | 'medium' | 'large' | '';
}

export interface ActiveFilter {
  type: string;
  label: string;
}

interface ClassData {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  students: Array<{ gender: string }>;
  subjects_instructors: SubjectsInstructor[];
  countLessons: number;
}

export function useClassFilters(classes: ClassData[] = []) {
  const [filters, setFilters] = useState<ClassFilters>({
    search: '',
    dateRange: {
      from: undefined,
      to: undefined,
    },
    gender: '',
    instructorCount: '',
    studentCount: '',
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  // Apply filters to the data
  const filteredClasses = useMemo(() => {
    return (
      classes?.filter((classe) => {
        // Search filter
        if (
          filters.search &&
          !classe.name.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false;
        }

        // Date range filter
        if (filters.dateRange.from && filters.dateRange.to) {
          const startDate = new Date(classe.startDate);
          const endDate = new Date(classe.endDate);
          const fromDate = new Date(filters.dateRange.from);
          const toDate = new Date(filters.dateRange.to);

          if (startDate < fromDate || endDate > toDate) {
            return false;
          }
        }

        // Gender distribution filter
        if (filters.gender) {
          const maleCount = classe.students?.filter(
            (std) => std?.gender === 'homme',
          ).length;
          const femaleCount = classe.students?.filter(
            (std) => std?.gender === 'femme',
          ).length;

          if (filters.gender === 'homme' && maleCount <= femaleCount) {
            return false;
          }
          if (filters.gender === 'femme' && femaleCount <= maleCount) {
            return false;
          }
          if (
            filters.gender === 'balanced' &&
            Math.abs(maleCount - femaleCount) > 3
          ) {
            return false;
          }
        }

        // Instructor count filter
        if (filters.instructorCount) {
          const count = classe.subjects_instructors.length;

          if (filters.instructorCount === '1' && count !== 1) {
            return false;
          }
          if (filters.instructorCount === '2-3' && (count < 2 || count > 3)) {
            return false;
          }
          if (filters.instructorCount === '4+' && count < 4) {
            return false;
          }
        }

        // Student count filter
        if (filters.studentCount) {
          const count = classe.students?.length || 0;

          if (filters.studentCount === 'small' && count > 15) {
            return false;
          }
          if (filters.studentCount === 'medium' && (count < 16 || count > 30)) {
            return false;
          }
          if (filters.studentCount === 'large' && count < 31) {
            return false;
          }
        }

        return true;
      }) || []
    );
  }, [classes, filters]);

  // Update active filters
  useEffect(() => {
    const newActiveFilters = [];

    if (filters.search) {
      newActiveFilters.push({
        type: 'search',
        label: `Search: ${filters.search}`,
      });
    }

    if (filters.dateRange.from && filters.dateRange.to) {
      newActiveFilters.push({
        type: 'dateRange',
        label: `Date: ${new Date(filters.dateRange.from).toLocaleDateString()} - ${new Date(
          filters.dateRange.to,
        ).toLocaleDateString()}`,
      });
    }

    if (filters.gender) {
      const genderLabels = {
        homme: 'Male Dominant',
        femme: 'Female Dominant',
        balanced: 'Balanced',
      };
      newActiveFilters.push({
        type: 'gender',
        label: `Gender: ${genderLabels[filters.gender]}`,
      });
    }

    if (filters.instructorCount) {
      const instructorLabels = {
        '1': '1 Instructor',
        '2-3': '2-3 Instructors',
        '4+': '4+ Instructors',
      };
      newActiveFilters.push({
        type: 'instructorCount',
        label: `Instructors: ${instructorLabels[filters.instructorCount]}`,
      });
    }

    if (filters.studentCount) {
      const studentLabels = {
        small: 'Small Class (<15)',
        medium: 'Medium Class (16-30)',
        large: 'Large Class (31+)',
      };
      newActiveFilters.push({
        type: 'studentCount',
        label: `Class Size: ${studentLabels[filters.studentCount]}`,
      });
    }

    setActiveFilters(newActiveFilters);
  }, [filters]);

  // Update a specific filter
  const updateFilter = useCallback(
    (filterType: keyof ClassFilters, value: string | DateRange) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    },
    [], // The empty dependency array ensures that the function remains the same across renders
  );

  // Remove a filter
  const removeFilter = (type: string) => {
    if (type === 'search') {
      setFilters({ ...filters, search: '' });
    } else if (type === 'dateRange') {
      setFilters({ ...filters, dateRange: { from: undefined, to: undefined } });
    } else if (type === 'gender') {
      setFilters({ ...filters, gender: '' });
    } else if (type === 'instructorCount') {
      setFilters({ ...filters, instructorCount: '' });
    } else if (type === 'studentCount') {
      setFilters({ ...filters, studentCount: '' });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: '',
      dateRange: {
        from: undefined,
        to: undefined,
      },
      gender: '',
      instructorCount: '',
      studentCount: '',
    });
  };

  return {
    filters,
    activeFilters,
    filteredClasses,
    updateFilter,
    removeFilter,
    clearAllFilters,
  };
}
