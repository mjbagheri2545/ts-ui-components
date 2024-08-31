import { ModeExcludedSystem } from "./style.global";

export type HEX = `#${string}`;

export type RGB = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};
export type HSL = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha?: number;
};

export type CSSRGB =
  | `rgb(${number},${number},${number})`
  | `rgba(${number},${number},${number},${number})`;

export type CSSHSL =
  | `hsl(${number},${number},${number})`
  | `hsla(${number},${number},${number},${number})`;

export type CSSColor = HEX | CSSRGB | CSSHSL;

export const MAIN_COLORS = [
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "orange",
  "error",
  "purple",
  "blue",
] as const;

export type MainColors = (typeof MAIN_COLORS)[number];
export type ExcludedMainColors = Exclude<MainColors, "primary" | "secondary">;

export const COLORS = [...MAIN_COLORS, "light", "dark"] as const;
export type Colors = MainColors | "light" | "dark";

type LightAndDark = {
  white: CSSColor;
  light: CSSColor;
  black: CSSColor;
  dark: CSSColor;
};

type LightAndDarkKeys = keyof LightAndDark;

export type CssColorOrLightAndDark = CSSColor | LightAndDarkKeys;

export type PaletteColor = Readonly<{
  light?: CSSColor;
  main: CSSColor;
  dark?: CSSColor;
  text: CssColorOrLightAndDark;
  brightenAmount?: number;
  darkenAmount?: number;
  lightenAmount?: number;
}>;

export type PaletteColors = {
  [Key in ExcludedMainColors]: PaletteColor;
} & {
  lightAndDark: LightAndDark;
} & {
  readonly primary: ExcludedMainColors;
  readonly secondary: ExcludedMainColors;
};

export const PALETTE_COLORS: PaletteColors = {
  success: {
    main: "#008b00",
    text: "light",
    lightenAmount: 0.07,
  },
  info: {
    main: "#0ea5e9",
    text: "light",
  },
  warning: {
    main: "#fcf100",
    text: "dark",
    darkenAmount: 0.03,
    lightenAmount: 0.11,
  },
  error: {
    main: "#b00020",
    text: "light",
  },
  purple: {
    main: "#7a00f4",
    text: "light",
    brightenAmount: 0.11,
  },
  orange: {
    main: "#fb7903",
    text: "dark",
    lightenAmount: 0.1,
  },
  blue: {
    main: "#0191ff",
    text: "light",
    brightenAmount: 0.11,
  },
  primary: "info",
  secondary: "purple",
  lightAndDark: {
    white: "#fff",
    light: "#f3f3f3",
    black: "#000",
    dark: "#121212",
  },
};

Object.freeze(PALETTE_COLORS);

type GreyMainColors = "primary" | "one" | "two" | "three" | "four";

type ModeColorsText = Readonly<{
  primary: CssColorOrLightAndDark;
  secondary: CssColorOrLightAndDark;
  tertiary: CssColorOrLightAndDark;
}>;

type ModeColorsActions = Readonly<{
  disabled: CSSColor;
  "hover-opacity": number;
  "focus-opacity": number;
}>;

export type ModeColors = {
  grey: {
    readonly [Key in GreyMainColors]: CssColorOrLightAndDark;
  };
  text: ModeColorsText;
  actions: ModeColorsActions;
};

export type ModeColorsKey = {
  [key in ModeExcludedSystem]: ModeColors;
};

export const MODE_COLORS: ModeColorsKey = {
  light: {
    grey: {
      primary: "light",
      one: "#eceff1",
      two: "#cfd8dc",
      three: "#b0bec5",
      four: "#90a4ae",
    },
    text: {
      primary: "dark",
      secondary: "#707070",
      tertiary: "light",
    },
    actions: {
      disabled: "rgba(0,0,0,0.26)",
      "hover-opacity": 0.2,
      "focus-opacity": 0.24,
    },
  },
  dark: {
    grey: {
      primary: "dark",
      one: "#263238",
      two: "#37474f",
      three: "#455a64",
      four: "#546e7a",
    },
    text: {
      primary: "light",
      secondary: "#8f8f8f",
      tertiary: "dark",
    },
    actions: {
      disabled: "rgba(255,255,255,0.3)",
      "hover-opacity": 0.2,
      "focus-opacity": 0.24,
    },
  },
};
