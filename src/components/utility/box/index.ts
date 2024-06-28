import HtmlTags from "../../../constants/types/htmlTags.types";
import {
  appendChildren,
  pickComponentProps,
} from "../../../utilities/components.utilities";
import CreateComponent, {
  ComponentProps,
  Components,
  ElementComponent,
} from "../../Component";

export type BoxProps = Partial<{
  elementName: HtmlTags;
  component: CreateComponent<ElementComponent>;
  children: Components;
}>;

class Box<
  ElementType extends ElementComponent = HTMLDivElement
> extends CreateComponent<ElementType> {
  private options: BoxProps;

  constructor(boxProps: ComponentProps<BoxProps> = {}) {
    const { props, options } = pickComponentProps(boxProps);
    super({
      elementName: options.elementName || "div",
      props,
      component: options.component,
    });
    this.options = options;
    this._create();
  }

  protected _create(): void {
    this.addSpecificClassNames([
      "Box",
      `${this.options.elementName || "div"}-Box`,
    ]);
    appendChildren(this.component, this.options.children);
  }
}

export default Box;
