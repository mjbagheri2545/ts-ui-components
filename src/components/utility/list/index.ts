import HtmlTags from "../../../constants/types/htmlTags.types";
import {
  addConditionalClassNames,
  pickComponentProps,
} from "../../../utilities/components.utilities";
import { Properties, setProperties } from "../../../utilities/style.utilities";
import CreateComponent, {
  ComponentProps,
  NormalComponent,
} from "../../Component";
import ListItem from "./ListItem";

function isListItem(item: any): item is ListItem {
  return item instanceof ListItem;
}

function getGapValue(
  gap: NonNullable<ListProps["gap"]>,
  gapProperty: "row" | "column"
): number {
  return typeof gap === "number" ? gap : gap[gapProperty];
}

export type ListProps = Partial<{
  isFlexColumn: boolean;
  justifyContent: "center" | "space-between";
  alignItems: "start" | "center" | "end";
  gap: number | { row: number; column: number };
  elementName: HtmlTags;
}> &
  ComponentProps;

class List<
  ElementType extends HTMLElement = HTMLUListElement
> extends CreateComponent<ElementType> {
  private options: ListProps = { isFlexColumn: false };

  constructor(
    private _items: (NormalComponent | ListItem)[],
    listProps: ListProps = {}
  ) {
    const { props, options } = pickComponentProps(listProps);
    super({ elementName: options.elementName ?? "ul", props });
    this.options = { ...this.options, ...options };
    this._create();
  }

  protected _create(): void {
    this.addSpecificClassNames([
      "List",
      "flex",
      "flex-wrap",
      "height-100",
      "width-100",
      ...addConditionalClassNames("flex-column", this.options.isFlexColumn),
      ...addConditionalClassNames(
        `justify-${this.options.justifyContent}`,
        this.options.justifyContent != null
      ),
      ...addConditionalClassNames(
        `align-items-${this.options.alignItems}`,
        this.options.alignItems != null
      ),
    ]);
    this._items.forEach((item) =>
      this.appendChild(isListItem(item) ? item : new ListItem(item))
    );

    if (this.options.gap != null) {
      const properties = [
        {
          key: "--row-gap",
          value: `${getGapValue(this.options.gap, "row")}px`,
        },
        {
          key: "--column-gap",
          value: `${getGapValue(this.options.gap, "column")}px`,
        },
      ] satisfies Properties;

      setProperties({
        element: this.component,
        properties,
      });
    }
  }
}

export default List;
