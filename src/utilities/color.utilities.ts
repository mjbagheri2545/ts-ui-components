import convertor from "color-convert";
import {
  PALETTE_COLORS,
  MODE_COLORS,
  PaletteColors,
  ModeColors,
  MAIN_COLORS,
  ExcludedMainColors,
  HEX,
  HSL,
  RGB,
  CSSColor,
  CSSRGB,
  CSSHSL,
  CssColorOrLightAndDark,
  PaletteColor,
} from "../constants/global/color.global";
import {
  Properties,
  getMode,
  setPropertiesToStyleSheet,
} from "./style.utilities";
import { HSL as ColorConvertHSL } from "color-convert/conversions";
import { ClassNames } from "../constants/types/classNames.types";

export function setColors(): void {
  setPaletteColors();
  setModeColors();
  setComponentColors();
}

type SetColor_Colors = {
  [key: string]: any;
};

type SetColor_ColorKey = string;

function isLightDark(key: string): boolean {
  return ["light", "dark", "black", "white"].includes(key);
}

function isPrimarySecondary(key: string): boolean {
  return ["primary", "secondary"].includes(key);
}

// in the below you will see as any, i don't know why typescript does not recognize type!
// in the test of this project in other folder in my laptop it work correctly. i don't know why this
// happened here.

function setPaletteColors(
  colors: SetColor_Colors = getPaletteColors(),
  colorKey: SetColor_ColorKey = ""
): void {
  Object.keys(colors).forEach((key) => {
    if (typeof colors[key] !== "string") {
      setPaletteColors(colors[key], key);
    } else if (key === "text") {
      setPropertiesToStyleSheet({
        properties: {
          key: `--${colorKey}-text`,
          value: getTextColorValue(colors[key] as any),
        },
      });
    } else if (isPrimarySecondary(key)) {
      const properties: Properties = [
        { key: `--${key}`, value: `var(--${colors[key]})` },
        { key: `--${key}-light`, value: `var(--${colors[key]}-light)` },
        { key: `--${key}-dark`, value: `var(--${colors[key]}-dark)` },
        { key: `--${key}-text`, value: `var(--${colors[key]}-text)` },
      ];
      setPropertiesToStyleSheet({
        properties,
      });
    } else if (isLightDark(key) && colorKey.length === 0) {
      setColorToElement({
        color: colors[key] as any,
        colorKey: key,
      });
    } else {
      setColorToElement({
        color: colors[key] as any,
        colorKey: key === "main" ? colorKey : `${colorKey}-${key}`,
      });
    }
  });
}

export function setModeColors(
  colors: SetColor_Colors = getModeColors(),
  colorKey: SetColor_ColorKey = ""
) {
  Object.keys(colors).forEach((key) => {
    if (typeof colors[key] !== "string" && typeof colors[key] !== "number") {
      setModeColors(colors[key], key);
    } else if (colorKey === "actions") {
      setPropertiesToStyleSheet({
        properties: {
          key: `--${key}`,
          value: `${colors[key]}`,
        },
      });
    } else {
      setPropertiesToStyleSheet({
        properties: {
          key: `--${colorKey}-${key}`,
          value: getTextColorValue(colors[key] as any),
        },
      });
    }
  });
}

function setComponentColors(): void {
  MAIN_COLORS.forEach((colorKey) => {
    const properties: Properties = [
      { key: "--color", value: `var(--${colorKey})` },
      { key: "--color-dark", value: `var(--${colorKey}-dark)` },
      { key: "--color-light", value: `var(--${colorKey}-light)` },
      { key: "--text-color", value: `var(--${colorKey}-text)` },
      ...((isPrimarySecondary(colorKey)
        ? [
            {
              key: "--color-channel",
              value: `var(--${PALETTE_COLORS[colorKey]}-channel)`,
            },
            {
              key: "--color-alpha",
              value: `var(--${PALETTE_COLORS[colorKey]}-alpha)`,
            },
          ]
        : [
            { key: "--color-channel", value: `var(--${colorKey}-channel)` },
            { key: "--color-alpha", value: `var(--${colorKey}-alpha)` },
          ]) satisfies Properties),
    ];
    setPropertiesToStyleSheet({
      properties,
      classNames: `Component ${colorKey}`,
      isDefaultSelectorNeed: false,
    });
  });
}

function getTextColorValue(color: CssColorOrLightAndDark) {
  return isLightDark(color) ? `var(--${color})` : color;
}

function getPaletteColors(): PaletteColors {
  const { primary, secondary, lightAndDark } = PALETTE_COLORS;

  const palette: Partial<PaletteColors> = {};
  Object.keys(PALETTE_COLORS).forEach((key) => {
    if (
      MAIN_COLORS.includes(key as ExcludedMainColors) &&
      !isPrimarySecondary(key)
    ) {
      const tokenColor = PALETTE_COLORS[key as ExcludedMainColors];
      palette[key as ExcludedMainColors] = {
        ...tokenColor,
        ...(tokenColor.dark != null
          ? {}
          : {
              dark: darken(
                tokenColor.main,
                ...getBrightenAmount(tokenColor, true)
              ),
            }),
        ...(tokenColor.light != null
          ? {}
          : {
              light: lighten(
                tokenColor.main,
                ...getBrightenAmount(tokenColor, false)
              ),
            }),
      };
    }
  });

  return { ...palette, primary, secondary, ...lightAndDark } as PaletteColors;
}

function getBrightenAmount(
  tokenColor: PaletteColor,
  isDarken: boolean
): number[] {
  const { brightenAmount, lightenAmount, darkenAmount } = tokenColor;

  const amount = (isDarken ? darkenAmount : lightenAmount) || brightenAmount;

  return amount ? ([amount] as number[]) : [];
}

function getModeColors(): ModeColors {
  const mode = getMode();
  return MODE_COLORS[mode];
}

type SetColorToElement = {
  element?: HTMLElement;
  classNames?: ClassNames;
  color: CSSColor;
  colorKey?: string;
};

export function setColorToElement({
  element = document.documentElement,
  classNames = "",
  color,
  colorKey = "",
}: SetColorToElement) {
  const { hue, saturation, lightness, alpha = 1 } = colorConvertor(color);

  const properties = [
    {
      key: `--${colorKey}-channel`,
      value: `${hue},${saturation}%,${lightness}%`,
    },
    { key: `--${colorKey}-alpha`, value: `${alpha}` },
    {
      key: `--${colorKey}`,
      value: `hsla(var(--${colorKey}-channel),var(--${colorKey}-alpha))`,
    },
  ] satisfies Properties;

  setPropertiesToStyleSheet({ element, classNames, properties });
}

function isHex(color: any): color is HEX {
  return color.includes("#");
}

const cssColor = {
  isRgb(color: any): color is CSSRGB {
    return color.includes("rgb");
  },
};

function colorConvertor(color: CSSColor): HSL {
  if (isHex(color)) {
    const [hue, saturation, lightness] = convertor.hex.hsl(color);
    const alpha = color.length > 7 ? parseInt(color.substring(7, 9), 16) : 1;
    return { hue, saturation, lightness, alpha };
  }
  if (cssColor.isRgb(color)) {
    const { red, green, blue, alpha } = cssRgbToJsRgb(color);
    const [hue, saturation, lightness] = convertor.rgb.hsl([red, green, blue]);
    return { hue, saturation, lightness, alpha };
  }
  return cssHslToJsHsl(color);
}

function cssRgbToJsRgb(color: CSSRGB): RGB {
  const rgb: Partial<RGB> = {};
  color
    .substring(4, color.length - 1)
    .split(",")
    .forEach((item, index) => {
      if (index === 0) {
        rgb.red = parseInt(item);
      } else if (index === 1) {
        rgb.green = parseInt(item);
      } else if (index === 2) {
        rgb.blue = parseInt(item);
      } else {
        rgb.alpha = parseFloat(item);
      }
    });

  return { ...rgb, alpha: rgb.alpha } as RGB;
}

function cssHslToJsHsl(color: CSSHSL): HSL {
  const hsl: Partial<HSL> = {};
  color
    .substring(4, color.length - 1)
    .split(",")
    .forEach((item, index) => {
      if (index === 0) {
        hsl.hue = parseInt(item);
      } else if (index === 1) {
        hsl.saturation = parseInt(item);
      } else if (index === 2) {
        hsl.lightness = parseInt(item);
      } else {
        hsl.alpha = parseFloat(item);
      }
    });

  return { ...hsl, alpha: hsl.alpha } as HSL;
}

const DEFAULT_BRIGHTEN_AMOUNT = 0.08;

export function darken(
  color: CSSColor,
  darkenAmount: number = DEFAULT_BRIGHTEN_AMOUNT
) {
  const hsla = colorConvertor(color);
  const newLightness = hsla.lightness - darkenAmount * 100;
  hsla.lightness = newLightness < 0 ? 0 : newLightness;

  return brightenHandler(hsla, color);
}

export function lighten(
  color: CSSColor,
  lightenAmount: number = DEFAULT_BRIGHTEN_AMOUNT
) {
  const hsla = colorConvertor(color);
  const newLightness = hsla.lightness + lightenAmount * 100;
  hsla.lightness = newLightness > 100 ? 100 : newLightness;

  return brightenHandler(hsla, color);
}

function convertAlphaToString(alpha: number): string {
  const stringAlpha = Math.round(alpha * 255).toString(16);
  return stringAlpha.length === 1 ? "0" + stringAlpha : stringAlpha;
}

function brightenHandler(hsla: HSL, color: CSSColor): CSSColor {
  const { hue, saturation, lightness, alpha } = hsla;
  const hsl = [hue, saturation, lightness] satisfies ColorConvertHSL;

  if (isHex(color)) {
    const hex = `#${convertor.hsl.hex(hsl)}`;
    const finalHex =
      hex.length > 7 ? hex + convertAlphaToString(alpha as number) : hex;
    return finalHex as CSSColor;
  }
  if (cssColor.isRgb(color)) {
    const [red, green, blue] = convertor.hsl.rgb(hsl);
    const isRgba = alpha != null;
    return `${isRgba ? "rgba" : "rgb"}(${red},${green},${blue}${
      isRgba ? `,${alpha}` : ""
    })` as CSSColor;
  }

  const isHsla = alpha != null;
  return `${isHsla ? "hsla" : "hsl"}(${hue},${saturation},${lightness}${
    isHsla ? `,${alpha}` : ""
  })` as CSSColor;
}
