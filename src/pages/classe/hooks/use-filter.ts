import { useState } from 'react';

export function useClassFilters() {
  const [nameSearch, setNameSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');

  const activeFilters = {
    name: nameSearch,
    subjectId: subjectFilter,
    instructorId: instructorFilter,
  };

  const hasActiveFilters = nameSearch || subjectFilter || instructorFilter;

  const updateFilter = (type: 'name' | 'subject' | 'instructor', value: string) => {
    switch (type) {
      case 'name':
        setNameSearch(value);
        break;
      case 'subject':
        setSubjectFilter(value);
        break;
      case 'instructor':
        setInstructorFilter(value);
        break;
    }
  };

  const removeFilter = (type: 'name' | 'subject' | 'instructor') => {
    updateFilter(type, '');
  };

  const clearAllFilters = () => {
    setNameSearch('');
    setSubjectFilter('');
    setInstructorFilter('');
  };

  return {
    filters: activeFilters,
    activeFilters,
    hasActiveFilters,
    updateFilter,
    removeFilter,
    clearAllFilters,
  };
}
