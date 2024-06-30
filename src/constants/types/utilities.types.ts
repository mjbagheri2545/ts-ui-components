export type TypeOrTypeArray<T> = T | T[];

export const SIZES = ["small", "medium", "large"] as const;
export type Size = (typeof SIZES)[number];
