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
