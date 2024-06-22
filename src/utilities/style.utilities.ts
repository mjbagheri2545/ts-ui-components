import { Component } from "../components/Component";
import {
  DEFAULT_MODE,
  Mode,
  ModeExcludedSystem,
} from "../constants/global/style.global";
import { ClassName, ClassNames } from "../constants/types/classNames.types";
import { TypeOrTypeArray } from "../constants/types/utilities.types";
import { setColors } from "./color.utilities";
import { insertStringAtSpecificIndex, qs } from "./common.utilities";
import { appendChildren } from "./components.utilities";
import { localStorageGetItem } from "./localStorage.utilities";

export function styleInitializer() {
  createStyleSheet();
  setColors();
}

function createStyleSheet(): void {
  const styleSheet = document.createElement("style");
  styleSheet.dataset.styleSheet = "";
  appendChildren(document.head, styleSheet);
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
  component: Component;
  properties: Properties;
};

export function setProperties({ component, properties }: SetProperties): void {
  if (Array.isArray(properties)) {
    return properties.forEach((property) => {
      component.style.setProperty(property.key, property.value);
    });
  }

  component.style.setProperty(properties.key, properties.value);
}

type GetProperties<Keys> = {
  component: Component;
  keys: Keys;
  options?: Partial<{
    searchValue: string;
    replaceValue: string;
    isNumberNeed: boolean;
    pseudoElement: string;
  }>;
};

export function getProperties({
  component,
  keys,
  options = {},
}: GetProperties<TypeOrTypeArray<string>>): TypeOrTypeArray<string | number> {
  if (Array.isArray(keys)) {
    return keys.map((key) => {
      return handleGetProperty({ component, keys: key, options });
    });
  }
  return handleGetProperty({ component, keys, options });
}

function handleGetProperty({
  component,
  keys,
  options: {
    searchValue = "",
    replaceValue = "",
    isNumberNeed = true,
    pseudoElement = "",
  } = {},
}: GetProperties<string>): string | number {
  const value = getComputedStyle(component, pseudoElement)
    .getPropertyValue(keys)
    .replace(searchValue, replaceValue);
  return isNumberNeed ? parseFloat(value) : value;
}

type SetPropertiesToStyleSheet = {
  component?: Component;
  properties: Properties;
  classNames?: ClassNames;
  isDefaultSelectorNeed?: boolean;
};

export function setPropertiesToStyleSheet({
  component = document.documentElement,
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

  const componentClassNamesSeletor = classNamesToArray(classNames).reduce(
    (previousClassNamesSeletor, className) => {
      if (className.length > 0) {
        return `${previousClassNamesSeletor}.${className}`;
      }
      return previousClassNamesSeletor;
    },
    ""
  );

  const componentDefaultSelector =
    component.classList.length > 0
      ? `.${component.classList[0]}`
      : component.nodeName;

  const componentSelector = isDefaultSelectorNeed
    ? `${componentDefaultSelector}${componentClassNamesSeletor}`
    : componentClassNamesSeletor;

  let oldPropertiesValue = "";
  const oldTextContent = styleSheet.textContent || "";

  if (oldTextContent.includes(componentSelector)) {
    oldPropertiesValue = oldTextContent
      .split(`${componentSelector} {`)[1]
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
    textContent = `${oldTextContent} ${componentSelector} {${formattedProperties}}`;
  }
  styleSheet.textContent = textContent;
}

export function classNamesToArray(classNames: ClassNames): ClassName[] {
  if (Array.isArray(classNames)) {
    return classNames.filter((className) => className != null) as ClassName[];
  }
  return classNames == null ? [] : classNames.split(" ");
}

export function addClassNames(
  component: Component,
  classNames: ClassNames
): void {
  classNamesToArray(classNames).forEach((className) =>
    className.length > 0 ? component.classList.add(className) : null
  );
}
