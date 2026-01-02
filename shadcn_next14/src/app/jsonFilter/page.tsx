"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { JsonInput } from "./components/JsonInput";
import { FilterPanel } from "./components/FilterPanel";
import { ResultViewer } from "./components/ResultViewer";
import { useFilterOptions } from "./hooks/useFilterOptions";
import { useJsonFilter } from "./hooks/useJsonFilter";
import { useFieldProjection } from "./hooks/useFieldProjection";

export default function JsonFilterPage() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [error, setError] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any>(null);
  const [selectedFields, setSelectedFields] = useState<string>("");
  const filterOptions = useFilterOptions(jsonInput);
  const { filterData } = useJsonFilter();
  const displayData = useFieldProjection(filteredData, selectedFields);

  const handleFilter = useCallback(() => {
    try {
      if (!jsonInput.trim()) {
        setError("Please enter JSON data");
        return;
      }

      const parsedJson = JSON.parse(jsonInput);
      const items = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
      const filtered = filterData(items, filters);

      setFilteredData(filtered.length ? filtered : "No matching results");
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
      setFilteredData(null);
    }
  }, [jsonInput, filters, filterData]);

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

  useEffect(() => {
    if (jsonInput) {
      handleFilter();
    }
  }, [filters, jsonInput, handleFilter]);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">JSON Filter</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <JsonInput
            value={jsonInput}
            onChange={setJsonInput}
            onFormat={handleFormat}
            error={error}
          />
          
          {filteredData !== null && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <ResultViewer
                data={displayData}
                fields={selectedFields}
                onFieldsChange={setSelectedFields}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <FilterPanel
              options={filterOptions}
              filters={filters}
              onFilterChange={updateFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}