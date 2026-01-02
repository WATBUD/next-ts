interface ResultViewerProps {
  data: any;
  fields: string;
  onFieldsChange: (fields: string) => void;
}

export function ResultViewer({ data, fields, onFieldsChange }: ResultViewerProps) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Fields to show (comma-separated)</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={fields}
          onChange={(e) => onFieldsChange(e.target.value)}
          placeholder="e.g., id,name,address.city"
        />
      </div>
      <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
