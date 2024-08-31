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

export function titleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function getRandomIndex(arrayLength: number): number {
  return Math.floor(Math.random() * arrayLength);
}
