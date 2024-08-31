import HtmlTags from "../../../constants/types/htmlTags.types";
import { pickComponentProps } from "../../../utilities/components.utilities";
import CreateComponent, {
  ComponentProps,
  Components,
  ElementComponent,
} from "../../Component";

export type BoxProps = Partial<{
  elementName: HtmlTags;
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
    });
    this.options = options;
    this._create();
  }

  protected _create(): void {
    this.addSpecificClassNames([
      "Box",
      `${this.options.elementName || "div"}-Box`,
    ]);
    this.appendChildren(this.options.children);
  }
}

export default Box;
