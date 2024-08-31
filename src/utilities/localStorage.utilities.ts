const prefixKey = import.meta.env.VITE_LOCAL_STORAGE_PREFIX_KEY;

function getPrefixedKey(key: string): string {
  return prefixKey + key;
}

export function localStorageGetItem<ValueType>(key: string): ValueType | null {
  const jsonValue = localStorage.getItem(getPrefixedKey(key));
  return jsonValue == null ? null : JSON.parse(jsonValue);
}

export function localStorageSetItem(key: string, value: unknown): void {
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(getPrefixedKey(key), jsonValue);
}
