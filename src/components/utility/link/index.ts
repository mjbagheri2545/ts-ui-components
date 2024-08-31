import CreateComponent, { ComponentProps, Components } from "../../Component";

type PropsWithHref = { children: Components; href: string };

function isHrefProvided(params: any): params is PropsWithHref {
  return typeof params?.href === "string";
}

export type LinkConstructorParams = PropsWithHref | Components;

class Link extends CreateComponent<HTMLAnchorElement> {
  private _children: Components;

  constructor(params: LinkConstructorParams, linkProps: ComponentProps = {}) {
    super({ elementName: "a", props: linkProps });
    const isHrefProvidedInParams = isHrefProvided(params);
    this._children = isHrefProvidedInParams ? params.children : params;
    this.component.href = isHrefProvidedInParams ? params.href : "/";
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

    this.appendChildren(this._children);
  }
}

export default Link;
