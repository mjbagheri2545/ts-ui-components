import CreateComponent, { ComponentProps, Components } from "../../Component";

class ListItem extends CreateComponent<HTMLLIElement> {
  constructor(
    private _children: Components,
    listItemProps: ComponentProps = {}
  ) {
    super({ elementName: "li", props: listItemProps });
    this._create();
  }

  protected _create(): void {
    this.addSpecificClassNames([
      "ListItem",
      "standard-transition",
      "primary-text",
    ]);
    this.appendChildren(this._children);
  }
}

export default ListItem;
