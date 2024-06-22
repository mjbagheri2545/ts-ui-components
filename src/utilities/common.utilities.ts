type InsertStringAtSpecificIndex = {
  string: string;
  substring: string;
  index: number;
};

export function insertStringAtSpecificIndex({
  string = "",
  substring = "",
  index,
}: InsertStringAtSpecificIndex): string {
  return `${string.slice(0, index)}${substring}${string.slice(index)}`;
}

export function qs<Element extends HTMLElement = HTMLElement>(
  query: string,
  element: HTMLElement | Document = document
): Element | null {
  return element.querySelector<Element>(query);
}
