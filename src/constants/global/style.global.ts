export type Mode = "dark" | "light" | "system";
export type ModeExcludedSystem = Exclude<Mode, "system">;

export const DEFAULT_MODE: Mode = "system";

export const TRANSITION_EASING = {
  "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  "ease-out": "cubic-bezier(0.0, 0, 0.2, 1)",
  "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
};

export const TRANSITION = {
  standard: {
    time: 300,
    easing: "ease-in-out",
  },
  entering: {
    time: 225,
    easing: "ease-out",
  },
  leaving: {
    time: 195,
    easing: "ease-in",
  },
};

export const FONT_SIZE = {
  smallest: 0.8,
  smaller: 0.85,
  small: 0.9,
  medium: 1,
  large: 1.125,
  "larger-1": 1.25,
  "larger-2": 1.375,
  largest: 1.5,
};

export const BORDER_RADIUS = {
  medium: 1,
  large: 1.25,
};
