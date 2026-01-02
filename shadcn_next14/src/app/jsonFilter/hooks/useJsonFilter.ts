import { useCallback } from 'react';
import { getNestedValue } from '../utils/jsonFilterUtils';

export function useJsonFilter() {
  const filterData = useCallback(<T>(items: T[], filters: Record<string, any>): T[] => {
    return items.filter((item) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (filterValue === "" || filterValue === undefined) return true;

        if (key.endsWith("_min") || key.endsWith("_max")) {
          const baseKey = key.slice(0, -4);
          const isMin = key.endsWith("_min");
          const itemValue = getNestedValue(item, baseKey);
          if (itemValue === undefined || itemValue === null) return false;
          return isMin ? itemValue >= filterValue : itemValue <= filterValue;
        }

        const itemValue = getNestedValue(item, key);
        if (itemValue === undefined || itemValue === null) return false;

        if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue);
        }
        if (typeof itemValue === 'number' && typeof filterValue === 'number') {
          return itemValue === filterValue;
        }
        return itemValue == filterValue;
      });
    });
  }, []);

  return { filterData };
}
