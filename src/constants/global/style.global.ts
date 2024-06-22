export type Mode = "dark" | "light" | "system";
export type ModeExcludedSystem = Exclude<Mode, "system">;

export const DEFAULT_MODE: Mode = "system";
