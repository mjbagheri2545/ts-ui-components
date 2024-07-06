import { appendChildren } from "../../../utilities/components.utilities";
import CreateComponent, { ComponentProps, Components } from "../../Component";

export type LinkConstructorParams = { children: Components; href: string };

class Link extends CreateComponent<HTMLAnchorElement> {
  private _children: LinkConstructorParams["children"];
  private _href: LinkConstructorParams["href"];

  constructor(
    { children, href }: LinkConstructorParams,
    linkProps: ComponentProps = {}
  ) {
    super({ elementName: "a", props: linkProps });
    this._children = children;
    this._href = href;
    this._create();
  }

  protected _create(): void {
    this.addSpecificClassNames([
      "Link",
      "cursor-pointer",
      "standard-transition",
      "position-relative",
      "text-center",
      "overflow-hidden",
    ]);

    appendChildren(this.component, this._children);

    this.component.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState(null, "", this._href);
    });
  }
}

export default Link;
