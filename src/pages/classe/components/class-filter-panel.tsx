import { ArrowRightIcon, CalendarIcon, ChevronDown, SearchIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect, useState } from "react"

interface ClassFilterPanelProps {
  filters: any
  activeFilters: any[]
  updateFilter: (filterType: string, value: any) => void
  removeFilter: (type: string) => void
  clearAllFilters: () => void
}

export function ClassFilterPanel({
  filters,
  activeFilters,
  updateFilter,
  removeFilter,
  clearAllFilters,
}: ClassFilterPanelProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300)
  useEffect(() => {
    setIsSearching(true);
    const timeout = setTimeout(() => {
      updateFilter("search", debouncedSearch)
      setIsSearching(false)
    }, 600)

    return () => clearTimeout(timeout)
  }, [debouncedSearch])
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  className="peer ps-9 pe-9"
                  placeholder="Search classes..."
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
                {
                  isSearching && (
                    <button
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Submit search"
                      type="submit"
                      disabled
                    >
                      <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-violet-500"></div>
                    </button>
                  )
                }
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date Range
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: filters.dateRange.from,
                      to: filters.dateRange.to,
                    }}
                    onSelect={(range) =>
                      updateFilter("dateRange", {
                        from: range?.from,
                        to: range?.to,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Gender Distribution Filter */}
              <Select value={filters.gender} onValueChange={(value: string) => {
                updateFilter("gender", value)
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Gender Distribution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Distributions</SelectItem>
                  <SelectItem value="homme">Male Dominant</SelectItem>
                  <SelectItem value="femme">Female Dominant</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>

              {/* Instructor Count Filter */}
              <Select value={filters.instructorCount} onValueChange={(value: any) => updateFilter("instructorCount", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Instructor Count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counts</SelectItem>
                  <SelectItem value="1">1 Instructor</SelectItem>
                  <SelectItem value="2-3">2-3 Instructors</SelectItem>
                  <SelectItem value="4+">4+ Instructors</SelectItem>
                </SelectContent>
              </Select>

              {/* Student Count Filter */}
              <Select value={filters.studentCount} onValueChange={(value: any) => updateFilter("studentCount", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Class Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small Class (&lt;15)</SelectItem>
                  <SelectItem value="medium">Medium Class (16-30)</SelectItem>
                  <SelectItem value="large">Large Class (31+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Active Filters:</span>
              {activeFilters.map((filter, index) => {
                console.log("filter", filter);
                return (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {filter.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeFilter(filter.type)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove filter</span>
                    </Button>
                  </Badge>
                )
              })}
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
