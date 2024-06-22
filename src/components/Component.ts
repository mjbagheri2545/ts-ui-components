import { ColorKeys } from "../constants/global/color.global";
import { TypeOrTypeArray } from "../constants/types/utilities.types";
import HtmlTags from "../constants/types/htmlTags.types";
import { ClassNames } from "../constants/types/classNames.types";
import { appendChildren } from "../utilities/components.utilities";
import { addClassNames, classNamesToArray } from "../utilities/style.utilities";
import { CSSInterpolation, css } from "@emotion/css";

type DataAttribute =
  | string
  | {
      key: string;
      value: string;
    };

type DataAttributes = DataAttribute | DataAttribute[];

export type Component = HTMLElement | SVGElement;
export type Child = Component | string | CreateComponent<Component>;
export type Children = TypeOrTypeArray<Child>;

export type ComponentProps<ChildrenType extends Children = Children> = Partial<{
  classNames: ClassNames;
  dataAttributes: DataAttributes;
  styles: CSSInterpolation;
  children: ChildrenType;
}>;

type Constructor<ChildrenType extends Children> = Partial<{
  elementName: HtmlTags;
  props: ComponentProps<ChildrenType>;
}>;

export type ComponentConstructor<
  Options extends Object = {},
  ChildrenType extends Children = Children
> = Partial<{
  options: Options;
  props: ComponentProps<ChildrenType>;
}>;

abstract class CreateComponent<
  ElementType extends Component = HTMLDivElement,
  ChildrenType extends Children = Children
> {
  component: ElementType;
  children: ComponentProps<ChildrenType>["children"];
  private props: ComponentProps<ChildrenType>;

  constructor({ elementName = "div", props = {} }: Constructor<ChildrenType>) {
    this.component = document.createElement(elementName) as ElementType;
    this.props = props;
    this.children = props.children;
    this._addProps();
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

  private _addProps(): void {
    this._addClassNames();
    this._addDataAttributes();
    appendChildren(this.component, this.children);
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
