import { NormalComponent } from "../components/Component";
import {
  BORDER_RADIUS,
  DEFAULT_MODE,
  FONT_SIZE,
  Mode,
  ModeExcludedSystem,
  TRANSITION,
  TRANSITION_EASING,
} from "../constants/global/style.global";
import { TypeOrTypeArray } from "../constants/types/utilities.types";
import { ClassNames } from "../constants/types/classNames.types";
import { setColors, setModeColors } from "./color.utilities";
import { insertStringAtSpecificIndex } from "./common.utilities";
import {
  appendChild,
  classNamesToArray,
  getElementComponent,
  qs,
} from "./components.utilities";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "./localStorage.utilities";

export function styleInitializer() {
  createStyleSheet();
  setColors();
  setTransitions();
  setFontSize();
  setBorderRadius();
  handleMode();
}

function createStyleSheet(): void {
  const styleSheet = document.createElement("style");
  styleSheet.dataset.styleSheet = "";
  appendChild(document.head, styleSheet);
}

type TransitionEasingKeys = keyof typeof TRANSITION_EASING;
type TransitionKeys = keyof typeof TRANSITION;

function setTransitions(): void {
  Object.keys(TRANSITION_EASING).forEach((key) => {
    setPropertiesToStyleSheet({
      properties: {
        key: `--${key}`,
        value: TRANSITION_EASING[key as TransitionEasingKeys],
      },
    });
  });

  Object.keys(TRANSITION).forEach((key) => {
    const properties: Properties = [
      {
        key: `--${key}-transition-time`,
        value: `${TRANSITION[key as TransitionKeys].time}ms`,
      },
      {
        key: `--${key}-transition`,
        value: `var(--${key}-transition-time) var(--${
          TRANSITION[key as TransitionKeys].easing
        })`,
      },
    ];

    setPropertiesToStyleSheet({ properties });
  });
}

type FontSizeKeys = keyof typeof FONT_SIZE;

function setFontSize(): void {
  Object.keys(FONT_SIZE).forEach((key) => {
    setPropertiesToStyleSheet({
      properties: {
        key: `--fs-${key}`,
        value: `${FONT_SIZE[key as FontSizeKeys]}rem`,
      },
    });
  });
}

function setBorderRadius(): void {
  setPropertiesToStyleSheet({
    properties: [
      { key: "--rounded", value: `${BORDER_RADIUS.medium}rem` },
      { key: "--rounded-large", value: `${BORDER_RADIUS.large}rem` },
    ],
  });
}

function handleMode(): void {
  const mode = localStorageGetItem<Mode>("mode");
  mode ? null : localStorageSetItem("mode", DEFAULT_MODE);
  setModeToRoot();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const newMode: ModeExcludedSystem = e.matches ? "dark" : "light";
      localStorageSetItem("mode", newMode);
      setModeToRoot();
    });
}

function setModeToRoot(): void {
  document.documentElement.dataset.mode = getMode();
}

export function setMode(mode: ModeExcludedSystem): void {
  localStorageSetItem("mode", mode);
  (qs("[data-mode]") as HTMLHtmlElement).dataset.mode = mode;
  setModeColors();
}

export function getMode(): ModeExcludedSystem {
  const mode = localStorageGetItem<Mode>("mode") || DEFAULT_MODE;
  if (mode === "system") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark";

    return "light";
  }
  return mode;
}

export type Property = {
  key: `--${string}`;
  value: string;
};

export type Properties = TypeOrTypeArray<Property>;

type SetProperties = {
  element: NormalComponent;
  properties: Properties;
};

export function setProperties({ element, properties }: SetProperties): void {
  const elementComponent = getElementComponent(element);
  if (Array.isArray(properties)) {
    properties.forEach((property) => {
      elementComponent.style.setProperty(property.key, property.value);
    });
    return;
  }

  elementComponent.style.setProperty(properties.key, properties.value);
}

type GetProperties<Keys> = {
  element: NormalComponent;
  keys: Keys;
  options?: Partial<{
    searchValue: string;
    replaceValue: string;
    isNumberNeed: boolean;
    pseudoElement: string;
  }>;
};

export function getProperties({
  element,
  keys,
  options = {},
}: GetProperties<TypeOrTypeArray<string>>): TypeOrTypeArray<string | number> {
  if (Array.isArray(keys)) {
    return keys.map((key) => {
      return handleGetProperty({ element, keys: key, options });
    });
  }
  return handleGetProperty({ element, keys, options });
}

function handleGetProperty({
  element,
  keys,
  options: {
    searchValue = "",
    replaceValue = "",
    isNumberNeed = true,
    pseudoElement = "",
  } = {},
}: GetProperties<string>): string | number {
  const value = getComputedStyle(getElementComponent(element), pseudoElement)
    .getPropertyValue(keys)
    .replace(searchValue, replaceValue);
  return isNumberNeed ? parseFloat(value) : value;
}

type SetPropertiesToStyleSheet = {
  element?: NormalComponent;
  properties: Properties;
  classNames?: ClassNames;
  isDefaultSelectorNeed?: boolean;
};

export function setPropertiesToStyleSheet({
  element = document.documentElement,
  properties,
  classNames = "",
  isDefaultSelectorNeed = true,
}: SetPropertiesToStyleSheet) {
  const styleSheet = qs("[data-style-sheet]") as HTMLStyleElement;

  let formattedProperties = "";

  if (Array.isArray(properties)) {
    formattedProperties = properties.reduce(
      (previousFormattedPropertites, property) => {
        return `${previousFormattedPropertites} ${property.key}: ${property.value};`;
      },
      ""
    );
  } else {
    formattedProperties = `${properties.key}: ${properties.value};`;
  }

  const elementClassNamesSeletor = classNamesToArray(classNames).reduce(
    (previousClassNamesSeletor, className) => {
      if (className.length > 0) {
        return `${previousClassNamesSeletor}.${className}`;
      }
      return previousClassNamesSeletor;
    },
    ""
  );

  const elementComponent = getElementComponent(element);

  const elementDefaultSelector =
    elementComponent.classList.length > 0
      ? `.${elementComponent.classList[0]}`
      : elementComponent.nodeName;

  const elementSelector = isDefaultSelectorNeed
    ? `${elementDefaultSelector}${elementClassNamesSeletor}`
    : elementClassNamesSeletor;

  let oldPropertiesValue = "";
  const oldTextContent = styleSheet.textContent || "";

  if (oldTextContent.includes(elementSelector)) {
    oldPropertiesValue = oldTextContent
      .split(`${elementSelector} {`)[1]
      .split("}")[0];
  }

  let indexOfOldPropertiesValue;
  let textContent = "";

  if (oldPropertiesValue.length > 0) {
    indexOfOldPropertiesValue = oldTextContent.indexOf(oldPropertiesValue);

    const indexOfNewFormattedProperties =
      indexOfOldPropertiesValue + oldPropertiesValue.length;

    textContent = insertStringAtSpecificIndex({
      string: oldTextContent,
      substring: formattedProperties,
      index: indexOfNewFormattedProperties,
    });
  } else {
    textContent = `${oldTextContent} ${elementSelector} {${formattedProperties}}`;
  }
  styleSheet.textContent = textContent;
}
