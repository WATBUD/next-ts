import { ChangeEvent } from 'react';
import { FilterOption } from '../hooks/useFilterOptions';

interface FilterInputProps {
  option: FilterOption;
  value: any;
  onChange: (key: string, value: any, checked?: boolean) => void;
}

export function FilterInput({ option, value, onChange }: FilterInputProps) {
  if (option.type === "boolean") {
    return (
      <select
        className="p-2 border rounded w-full"
        value={value}
        onChange={(e) => onChange(option.key, e.target.value === "true")}
      >
        <option value="">Any</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  if (option.type === "number") {
    return (
      <div className="flex gap-2">
        <input
          type="number"
          className="flex-1 p-2 border rounded"
          placeholder={`Min (${option.min})`}
          value={value?.[`${option.key}_min`] ?? ""}
          onChange={(e) =>
            onChange(
              `${option.key}_min`,
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          step="any"
          min={option.min}
          max={option.max}
        />
        <input
          type="number"
          className="flex-1 p-2 border rounded"
          placeholder={`Max (${option.max})`}
          value={value?.[`${option.key}_max`] ?? ""}
          onChange={(e) =>
            onChange(
              `${option.key}_max`,
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          step="any"
          min={option.min}
          max={option.max}
        />
      </div>
    );
  }

  if (option.values && Array.from(option.values).length > 0) {
    return (
      <select
        className="p-2 border rounded w-full"
        value={value}
        onChange={(e) => onChange(option.key, e.target.value || undefined)}
      >
        <option value="">Any</option>
        {Array.from(option.values).map((val: string | number | boolean) => (
          <option key={String(val)} value={val as string}>
            {String(val)}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      className="p-2 border rounded w-full"
      value={value ?? ""}
      onChange={(e) => onChange(option.key, e.target.value || undefined)}
      placeholder={`Filter by ${option.key}`}
    />
  );
}
