import { useMemo } from 'react';

type FilterOption = {
  key: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  values?: Set<string | number | boolean>;
  min?: number;
  max?: number;
};

export type { FilterOption };

export function useFilterOptions(jsonInput: string) {
  return useMemo<FilterOption[]>(() => {
    if (!jsonInput) return [];

    try {
      const data = JSON.parse(jsonInput);
      const items = Array.isArray(data) ? data : [data];
      if (!items.length) return [];

      const optionsMap = new Map<string, FilterOption>();

      const processValue = (key: string, value: any) => {
        const type = Array.isArray(value) ? "array" : typeof value;
        const option = optionsMap.get(key) || { key, type: "string" as "string", values: new Set<string | number | boolean>(), min: undefined, max: undefined };

        if (type === "number") {
          option.min = Math.min(option.min ?? value, value);
          option.max = Math.max(option.max ?? value, value);
        } else if (type === "string" || type === "boolean") {
          if (option.values && option.values.size < 20) {
            option.values.add(value);
          }
        } else if (type === "object" && value) {
          Object.entries(value).forEach(([k, v]) => {
            processValue(`${key}.${k}`, v);
          });
          return;
        }

        optionsMap.set(key, option);
      };

      items.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          processValue(key, value);
        });
      });

      return Array.from(optionsMap.values()).map((option) => ({
        ...option,
        values: option.type === "number" ? undefined : option.values
      }));
    } catch (e) {
      return [];
    }
  }, [jsonInput]);
}
