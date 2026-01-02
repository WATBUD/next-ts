import { FilterOption } from '../hooks/useFilterOptions';
import { FilterInput } from './FilterInput';

interface FilterPanelProps {
  options: FilterOption[];
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any, checked?: boolean) => void;
}

export function FilterPanel({ options, filters, onFilterChange }: FilterPanelProps) {
  if (!options.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Filters</h3>
      <div className="grid gap-4">
        {options.map((option) => (
          <div key={option.key} className="space-y-1">
            <label className="block text-sm font-medium">{option.key}</label>
            <FilterInput
              option={option}
              value={filters[option.key]}
              onChange={onFilterChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
