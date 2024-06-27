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

export const COLORS_KEYS = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "purple",
  "blue",
  "orange",
] as const;

export type ColorKeys = (typeof COLORS_KEYS)[number];
export type ExcludedColorKeys = Exclude<ColorKeys, "primary" | "secondary">;

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
  [Key in ExcludedColorKeys]: PaletteColor;
} & {
  readonly lightAndDark: LightAndDark;
} & {
  readonly primary: ExcludedColorKeys;
  readonly secondary: ExcludedColorKeys;
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
    main: "#b00000",
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

type GreyColorKeys = "pure" | "primary" | "one" | "two" | "three" | "four";

export type ModeColors = Readonly<{
  grey: {
    [Key in GreyColorKeys]: CssColorOrLightAndDark;
  };
  text: {
    primary: CssColorOrLightAndDark;
    secondary: CssColorOrLightAndDark;
    tertiary: CssColorOrLightAndDark;
  };
  actions: {
    disabled: CSSColor;
    "hover-opacity": number;
    "focus-opacity": number;
  };
}>;

export type ModeColorsKey = {
  [key in ModeExcludedSystem]: ModeColors;
};

export const MODE_COLORS: ModeColorsKey = {
  light: {
    grey: {
      pure: "white",
      primary: "light",
      one: "#f0f0f0",
      two: "#ededed",
      three: "#eaeaea",
      four: "#e7e7e7",
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
      pure: "black",
      primary: "dark",
      one: "#151515",
      two: "#181818",
      three: "#212121",
      four: "#242424",
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
