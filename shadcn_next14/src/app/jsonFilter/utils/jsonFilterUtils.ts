export function filterObjectFields(obj: any, fields: string[]) {
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
}

export function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[key];
  }, obj);
}
