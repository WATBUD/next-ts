import { useMemo } from 'react';
import { filterObjectFields } from '../utils/jsonFilterUtils';

export function useFieldProjection<T>(data: T, selectedFields: string) {
  return useMemo(() => {
    if (!data) return data;
    
    const fields = selectedFields
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    if (!fields.length) return data;

    if (Array.isArray(data)) {
      return data.map(item => filterObjectFields(item, fields));
    }
    return filterObjectFields(data, fields);
  }, [data, selectedFields]);
}
