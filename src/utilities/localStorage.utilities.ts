const prefixKey = import.meta.env.VITE_APP_TITLE;

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

export function localStorageRemoveItem(key: string): void {
  localStorage.removeItem(getPrefixedKey(key));
}
