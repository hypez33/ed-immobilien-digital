import { useState } from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { locations } from '@/data/listings';

export interface FilterState {
  location: string;
  priceType: 'alle' | 'kauf' | 'miete';
  minPrice: string;
  maxPrice: string;
  minRooms: string;
  minArea: string;
  sortBy: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function FilterBar({ filters, onFilterChange, onReset }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.location !== 'Alle Orte' ||
    filters.priceType !== 'alle' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.minRooms !== '0' ||
    filters.minArea !== '';

  return (
    <div className="card-premium p-5 md:p-6">
      {/* Main filters - always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ort wählen</Label>
          <Select
            value={filters.location}
            onValueChange={(value) => updateFilter('location', value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Alle Orte" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Kaufen oder Mieten?</Label>
          <ToggleGroup
            type="single"
            value={filters.priceType}
            onValueChange={(value) => {
              if (value) updateFilter('priceType', value as FilterState['priceType']);
            }}
            className="justify-start h-11 p-1 bg-muted rounded-lg"
          >
            <ToggleGroupItem 
              value="alle" 
              className="flex-1 h-9 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
            >
              Alle
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="kauf" 
              className="flex-1 h-9 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
            >
              Kauf
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="miete" 
              className="flex-1 h-9 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
            >
              Miete
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Preisrahmen (€)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="h-11"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              className="h-11"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mindest-Zimmer</Label>
          <Select
            value={filters.minRooms}
            onValueChange={(value) => updateFilter('minRooms', value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Beliebig" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              <SelectItem value="0">Beliebig</SelectItem>
              <SelectItem value="1">1+ Zimmer</SelectItem>
              <SelectItem value="2">2+ Zimmer</SelectItem>
              <SelectItem value="3">3+ Zimmer</SelectItem>
              <SelectItem value="4">4+ Zimmer</SelectItem>
              <SelectItem value="5">5+ Zimmer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expandable additional filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden sm:opacity-100 sm:h-auto sm:overflow-visible'}`}>
          {/* Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mindestfläche (m²)</Label>
            <Input
              type="number"
              placeholder="z.B. 80"
              className="h-11"
              value={filters.minArea}
              onChange={(e) => updateFilter('minArea', e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sortierung</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter('sortBy', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Neueste zuerst" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg">
                <SelectItem value="newest">Neueste zuerst</SelectItem>
                <SelectItem value="price-asc">Preis: niedrig → hoch</SelectItem>
                <SelectItem value="price-desc">Preis: hoch → niedrig</SelectItem>
                <SelectItem value="area-desc">Fläche: groß → klein</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="sm:hidden text-muted-foreground"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {expanded ? 'Weniger' : 'Mehr Filter'}
          </Button>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onReset} 
              className="text-muted-foreground hover:text-foreground ml-auto sm:ml-0"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Zurücksetzen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export const defaultFilters: FilterState = {
  location: 'Alle Orte',
  priceType: 'alle',
  minPrice: '',
  maxPrice: '',
  minRooms: '0',
  minArea: '',
  sortBy: 'newest',
};
