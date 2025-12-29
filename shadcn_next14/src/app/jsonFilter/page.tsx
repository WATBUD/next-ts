"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

type FilterOption = {
  key: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  values?: Set<string | number | boolean>;
  min?: number;
  max?: number;
};

export default function JsonFilterPage() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [error, setError] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any>(null);
  const [selectedFields, setSelectedFields] = useState<string>("");

  // Function to filter object fields
  const filterObjectFields = useCallback((obj: any, fields: string[]) => {
    if (!fields.length) return obj;
    
    const result: any = {};
    fields.forEach(field => {
      const keys = field.split('.');
      let value = obj;
      for (const key of keys) {
        if (value === undefined || value === null) break;
        value = value[key];
      }
      if (value !== undefined) {
        const path = field.split('.');
        const lastKey = path.pop()!;
        const target = path.reduce((acc, key) => {
          if (!acc[key]) acc[key] = {};
          return acc[key];
        }, result);
        target[lastKey] = value;
      }
    });
    return result;
  }, []);

  // Process filtered data to only include selected fields
  const displayData = useMemo(() => {
    if (!filteredData || filteredData === "No matching results") return filteredData;
    
    const fields = selectedFields
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    if (!fields.length) return filteredData;

    if (Array.isArray(filteredData)) {
      return filteredData.map(item => filterObjectFields(item, fields));
    }
    return filterObjectFields(filteredData, fields);
  }, [filteredData, selectedFields, filterObjectFields]);

  // Extract filter options from JSON data
  const filterOptions = useMemo<FilterOption[]>(() => {
    if (!jsonInput) return [];

    try {
      const data = JSON.parse(jsonInput);
      const items = Array.isArray(data) ? data : [data];
      if (!items.length) return [];

      const optionsMap = new Map<string, FilterOption>();

      const processValue = (key: string, value: any) => {
        const type = Array.isArray(value) ? "array" : typeof value;
        const option = optionsMap.get(key) || { key, type, values: new Set() };

        if (type === "number") {
          option.min = Math.min(option.min ?? value, value);
          option.max = Math.max(option.max ?? value, value);
        } else if (type === "string" || type === "boolean") {
          if (option.values!.size < 20) {
            option.values!.add(value);
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
        values: option.type === "number" ? undefined : Array.from(option.values || [])
      }));
    } catch (e) {
      return [];
    }
  }, [jsonInput]);

  const handleFilter = useCallback(() => {
    try {
      if (!jsonInput.trim()) {
        setError("Please enter JSON data");
        return;
      }

      const parsedJson = JSON.parse(jsonInput);
      const items = Array.isArray(parsedJson) ? parsedJson : [parsedJson];

      const filtered = items.filter((item) => {
        return Object.entries(filters).every(([key, filterValue]) => {
          if (filterValue === "" || filterValue === undefined) return true;

          if (key.endsWith("_min") || key.endsWith("_max")) {
            const baseKey = key.slice(0, -4);
            const isMin = key.endsWith("_min");

            const itemValue = baseKey
              .split(".")
              .reduce((obj, k) => obj?.[k], item);
            if (itemValue === undefined || itemValue === null) return false;

            return isMin ? itemValue >= filterValue : itemValue <= filterValue;
          }

          const keys = key.split(".");
          let value = item;

          for (const k of keys) {
            if (value === undefined || value === null) return false;
            value = value[k];
          }

          if (Array.isArray(filterValue)) {
            return filterValue.includes(value);
          }
          // Use strict equality for numbers to prevent matching positive and negative numbers
          if (typeof value === 'number' && typeof filterValue === 'number') {
            return value === filterValue;
          }
          return value == filterValue;
        });
      });

      setFilteredData(filtered.length ? filtered : "No matching results");
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
      setFilteredData(null);
    }
  }, [jsonInput, filters]);

  useEffect(() => {
    if (jsonInput) {
      handleFilter();
    }
  }, [filters, jsonInput, handleFilter]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const updateFilter = (key: string, value: any, checked?: boolean) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (checked === false) {
        delete newFilters[key];
      } else if (Array.isArray(prev[key])) {
        newFilters[key] = checked
          ? [...prev[key], value]
          : prev[key].filter((v: any) => v !== value);
      } else {
        if (value === "") {
          delete newFilters[key];
        } else {
          newFilters[key] = value;
        }
      }
      return newFilters;
    });
  };

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.key] ?? "";

    if (option.type === "boolean") {
      return (
        <select
          className="p-2 border rounded w-full"
          value={value}
          onChange={(e) => updateFilter(option.key, e.target.value === "true")}
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
            value={filters[`${option.key}_min`] ?? ""}
            onChange={(e) =>
              updateFilter(
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
            value={filters[`${option.key}_max`] ?? ""}
            onChange={(e) =>
              updateFilter(
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

    if (option.values && option.values.length > 0) {
      return (
        <select
          className="p-2 border rounded w-full"
          value={value}
          onChange={(e) =>
            updateFilter(option.key, e.target.value || undefined)
          }
        >
          <option value="">Any</option>
          {option.values.map((val) => (
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
        value={value}
        onChange={(e) => updateFilter(option.key, e.target.value)}
        placeholder={`Filter by ${option.key}`}
      />
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">JSON Data Filter</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="json-input">
              Enter JSON:
            </label>
            <textarea
              id="json-input"
              className="w-full h-96 p-2 border rounded font-mono text-sm"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON array or object here..."
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleFormat}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Format JSON
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Fields to include (comma-separated):
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={selectedFields}
              onChange={(e) => setSelectedFields(e.target.value)}
              placeholder="e.g., uid,name,profile.email"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to show all fields. Use dot notation for nested fields.
            </p>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Filtered Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {displayData ? JSON.stringify(displayData, null, 2) : "No results to display"}
            </pre>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          {filterOptions.length > 0 ? (
            <div className="space-y-4">
              {filterOptions.map((option) => (
                <div key={option.key} className="space-y-1">
                  <label className="text-sm font-medium">
                    {option.key}{" "}
                    <span className="text-gray-500 text-xs">
                      ({option.type})
                    </span>
                  </label>
                  {renderFilterInput(option)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Enter valid JSON to see available filters
            </p>
          )}
        </div>
      </div>
    </div>
  );
}