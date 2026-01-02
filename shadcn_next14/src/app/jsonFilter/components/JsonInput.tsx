import { ChangeEvent } from 'react';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  onFormat: () => void;
  error?: string;
}

export function JsonInput({ value, onChange, onFormat, error }: JsonInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">JSON Input</label>
        <button
          onClick={onFormat}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Format JSON
        </button>
      </div>
      <textarea
        className={`w-full h-64 p-2 border rounded font-mono text-sm ${
          error ? 'border-red-500' : ''
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
