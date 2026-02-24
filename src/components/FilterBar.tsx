import { useState } from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
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
import { locations as defaultLocations } from '@/data/listings';
import { cn } from '@/lib/utils';

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
  locations?: string[];
}

export function FilterBar({ filters, onFilterChange, onReset, locations = defaultLocations }: FilterBarProps) {
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

  const priceTypes = [
    { value: 'alle', label: 'Alle' },
    { value: 'kauf', label: 'Kauf' },
    { value: 'miete', label: 'Miete' },
  ] as const;

  return (
    <div>
      {/* Main filters row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Location */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ort</Label>
          <Select
            value={filters.location}
            onValueChange={(value) => updateFilter('location', value)}
          >
            <SelectTrigger className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30">
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

        {/* Price Type - custom buttons */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Art</Label>
          <div className="flex h-11 border border-border/60">
            {priceTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => updateFilter('priceType', type.value)}
                className={cn(
                  'flex-1 text-sm font-medium transition-all duration-200',
                  filters.priceType === type.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground hover:bg-surface'
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preis (€)</Label>
          <div className="flex gap-1.5">
            <Input
              type="number"
              placeholder="Min"
              className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Zimmer</Label>
          <Select
            value={filters.minRooms}
            onValueChange={(value) => updateFilter('minRooms', value)}
          >
            <SelectTrigger className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30">
              <SelectValue placeholder="Beliebig" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              <SelectItem value="0">Beliebig</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expandable row */}
      <div className={cn(
        'grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden transition-all duration-300',
        expanded ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0 sm:max-h-24 sm:opacity-100 sm:mb-4'
      )}>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fläche (m²)</Label>
          <Input
            type="number"
            placeholder="Mindestfläche"
            className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
            value={filters.minArea}
            onChange={(e) => updateFilter('minArea', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sortierung</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter('sortBy', value)}
          >
            <SelectTrigger className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30">
              <SelectValue placeholder="Neueste zuerst" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              <SelectItem value="newest">Neueste zuerst</SelectItem>
              <SelectItem value="price-asc">Preis ↑</SelectItem>
              <SelectItem value="price-desc">Preis ↓</SelectItem>
              <SelectItem value="area-desc">Fläche ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="sm:hidden text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {expanded ? 'Weniger' : 'Mehr Filter'}
        </Button>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onReset} 
            className="text-muted-foreground hover:text-gold ml-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Zurücksetzen
          </Button>
        )}
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
