import {
  DEFAULT_MODE,
  Mode,
  ModeExcludedSystem,
} from "../constants/global/style.global";
import { ClassName, ClassNames } from "../constants/types/classNames.types";
import { TypeOrTypeArray } from "../constants/types/utilities.types";
import { setColors } from "./color.utilities";
import { insertStringAtSpecificIndex, qs } from "./common.utilities";
import { localStorageGetItem } from "./localStorage.utilities";

export function styleInitializer() {
  createStyleSheet();
  setColors();
}

function createStyleSheet(): void {
  const styleSheet = document.createElement("style");
  styleSheet.dataset.styleSheet = "";
  document.head.appendChild(styleSheet);
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
  element: HTMLElement;
  properties: Properties;
};

export function setProperties({ element, properties }: SetProperties): void {
  if (Array.isArray(properties)) {
    properties.forEach((property) => {
      element.style.setProperty(property.key, property.value);
    });
    return;
  }

  element.style.setProperty(properties.key, properties.value);
}

type GetProperties<Keys> = {
  element: HTMLElement;
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
  const value = getComputedStyle(element, pseudoElement)
    .getPropertyValue(keys)
    .replace(searchValue, replaceValue);
  return isNumberNeed ? parseFloat(value) : value;
}

type SetPropertiesToStyleSheet = {
  element?: HTMLElement;
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

  const elementDefaultSelector =
    element.classList.length > 0
      ? `.${element.classList[0]}`
      : element.nodeName;

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

export function classNamesToArray(classNames: ClassNames): ClassName[] {
  if (Array.isArray(classNames)) {
    return classNames.filter((className) => className != null) as ClassName[];
  }
  return classNames == null ? [] : classNames.split(" ");
}
