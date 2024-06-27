import { ColorKeys } from "../constants/global/color.global";
import { TypeOrTypeArray } from "../constants/types/utilities.types";
import HtmlTags from "../constants/types/htmlTags.types";
import { ClassNames } from "../constants/types/classNames.types";
import {
  addClassNames,
  classNamesToArray,
} from "../utilities/components.utilities";
import { CSSInterpolation, css } from "@emotion/css";

type DataAttribute =
  | string
  | {
      key: string;
      value: string;
    };

type DataAttributes = DataAttribute | DataAttribute[];

export type ElementComponent = HTMLElement | SVGElement;
export type NormalComponent =
  | ElementComponent
  | CreateComponent<ElementComponent>;
export type Component = NormalComponent | string;
export type Components = TypeOrTypeArray<Component>;

export type ComponentProps<Props = {}> = Partial<{
  classNames: ClassNames;
  dataAttributes: DataAttributes;
  styles: CSSInterpolation;
}> &
  Props;

type Constructor = Partial<{
  elementName: HtmlTags;
  props: ComponentProps;
  component: CreateComponent<ElementComponent>;
}>;

abstract class CreateComponent<
  ElementType extends ElementComponent = HTMLDivElement
> {
  private _component: ElementType;
  private props: ComponentProps;

  constructor({
    elementName = "div",
    props = {},
    component,
  }: Constructor = {}) {
    this._component = (
      component != null
        ? component.component
        : document.createElement(elementName)
    ) as ElementType;
    this.props = props;
    this._addProps();
  }

  get component() {
    return this._component;
  }

  protected abstract _create(): void;

  protected _setColor<Colors = ColorKeys>(
    colorToSet?: Colors,
    colorToRemove?: Colors
  ) {
    if (colorToSet === colorToRemove) return;
    colorToRemove != null
      ? this.component.classList.remove(colorToRemove as string)
      : null;
    colorToSet != null
      ? addClassNames(this.component, colorToSet as string)
      : null;
  }

  protected addSpecificClassNames(classNames: ClassNames) {
    addClassNames(this.component, classNames);
  }

  private _addProps(): void {
    this._addClassNames();
    this._addDataAttributes();
  }

  private _addClassNames(): void {
    const { classNames, styles } = this.props;

    const classNamesToAdd = [
      "Component",
      ...(styles != null ? [css(styles)] : []),
      ...(classNames == null ? [] : classNamesToArray(classNames)),
    ];

    addClassNames(this.component, classNamesToAdd);
  }

  private _addDataAttributes(): void {
    const { dataAttributes } = this.props;
    if (dataAttributes == null) return;

    if (typeof dataAttributes === "string") {
      this.component.dataset[dataAttributes] = "";
      return;
    }

    if (Array.isArray(dataAttributes)) {
      dataAttributes.forEach((dataAttribute) => {
        if (typeof dataAttribute === "string") {
          this.component.dataset[dataAttribute] = "";
        } else {
          this.component.dataset[dataAttribute.key] = dataAttribute.value;
        }
      });
      return;
    }

    this.component.dataset[dataAttributes.key] = dataAttributes.value;
  }
}

export default CreateComponent;
