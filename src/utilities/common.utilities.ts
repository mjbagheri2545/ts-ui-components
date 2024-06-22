import { Component } from "../components/Component";

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

export function qs<Element extends Component = Component>(
  query: string,
  component: Component | Document = document
): Element | null {
  return component.querySelector<Element>(query);
}
