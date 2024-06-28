import { TypeOrTypeArray } from "./utilities.types";

const CLASS_NAMES = [
  "cursor-pointer",
  "flex",
  "flex-center",
  "flex-align-center",
  "align-center",
  "flex-justify-center",
  "justify-center",
  "flex-justify-space-between",
  "justify-space-between",
  "flex-wrap",
  "flex-column",
  "fade-in",
  "fade-out",
  "height-100",
  "margin-auto",
  "overflow-hidden",
  "position-absolute",
  "position-relative",
  "position-absolute-center",
  "position-absolute-center-inset",
  "rounded",
  "rounded-pill",
  "rounded-circle",
  "text-center",
  "primary-text",
  "secondary-text",
  "tertiary-text",
  "standard-transition",
  "entering-transition",
  "leaving-transition",
  "width-100",
] as const;

export type ClassName = (typeof CLASS_NAMES)[number] | (string & {});
export type ClassNames = TypeOrTypeArray<ClassName | undefined>;
