import { MAIN_COLORS } from "../../../constants/global/color.global";
import { ClassName } from "../../../constants/types/classNames.types";
import { titleCase } from "../../../utilities/common.utilities";
import { getMode } from "../../../utilities/style.utilities";
import CreateComponent, {
  Component,
  ComponentProps,
  NormalComponent,
} from "../../Component";
import Box from "../../utility/box";
import Link from "../../utility/link";
import List, { ListProps } from "../../utility/list";
import ListItem from "../../utility/list/ListItem";
import ToggleMode from "../ToggleMode";

type CreateFeatureOptions = {
  items: (NormalComponent | ListItem)[];
  title: string;
  text?: Component;
};

type CreateTitleAndDescriptionOptions = Omit<CreateFeatureOptions, "items"> & {
  styles: ComponentProps["styles"];
  classNames?: ClassName[];
  elementName: "h1" | "h2";
  titleLinkComponent?: Link;
};

abstract class Features {
  component: Box<HTMLDivElement>;
  constructor() {
    this.component = this._create();
  }

  protected abstract _create(): Box<HTMLDivElement>;

  protected _getCreateFeaturePageListOptions(): ListProps {
    return {
      isFlexColumn: true,
      gap: { row: 36, column: 0 },
      styles: { padding: 0 },
    } as const;
  }

  protected _getCreateFeatureListOptions(): ListProps {
    return { gap: { row: 24, column: 36 } } as const;
  }

  protected _getColorsWithMode() {
    return [...MAIN_COLORS, getMode() === "dark" ? "light" : "dark"] as const;
  }

  protected _createFeature({ items, ...restOptions }: CreateFeatureOptions) {
    const children = this._createTitleAndDescription({
      ...restOptions,
      elementName: "h2",
      styles: {
        fontSize: "var(--fs-largest)",
        marginLeft: "1.5rem",
      },
    });
    children.push(new List(items, this._getCreateFeatureListOptions()));

    return new Box({ children });
  }

  protected _createFeaturePage({
    items,
    ...restOptions
  }: CreateFeatureOptions) {
    const children = this._createTitleAndDescription({
      ...restOptions,
      elementName: "h1",
      classNames: ["flex-center"],
      styles: {
        fontSize: "2rem",
      },
    });

    const homeLink = new Link("back to home");

    const header = new Box({
      classNames: ["flex-center", "flex-column"],
      styles: { marginBottom: "1.5rem" },
      children: [(children[0] as CreateComponent).component, homeLink],
    });
    children[0] = header;
    children.push(new List(items, this._getCreateFeaturePageListOptions()));

    children.push(new ToggleMode().component);

    return new Box({
      children,
      styles: {
        "& .Fab": {
          right: "1.75rem",
          bottom: "1.75rem",
        },
      },
    });
  }

  protected _createFeatureListItem(component: NormalComponent, text: string) {
    return new ListItem(
      [
        component,
        new Box<HTMLSpanElement>({
          children: titleCase(text),
          elementName: "span",
          styles: { marginTop: "0.75rem", fontSize: "var(--fs-large)" },
        }),
      ],
      {
        classNames: ["flex-align-center", "flex-column"],
      }
    );
  }

  private _createTitleAndDescription({
    title,
    text,
    classNames,
    elementName,
    styles,
  }: CreateTitleAndDescriptionOptions): Component[] {
    const titleComponent = new Box<HTMLHeadingElement>({
      elementName,
      children: titleCase(title),
      classNames: ["primary-text", ...(classNames ?? [])],
      styles,
    });

    const children = [titleComponent];
    if (text != null) {
      const descriptionComponent = new Box<HTMLParagraphElement>({
        elementName: "p",
        children: text,
        styles: {
          marginLeft: "1.5rem",
          marginTop: "0.25rem",
          marginBottom: "0.5rem",
        },
      });
      children.push(descriptionComponent);
    }

    return children;
  }
}

export default Features;
