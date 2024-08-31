import Features from "./features";
import { SIZES } from "../../../constants/types/utilities.types";
import { getRandomIndex, titleCase } from "../../../utilities/common.utilities";
import { getMode } from "../../../utilities/style.utilities";
import Box from "../../utility/box";
import Button from "../../utility/button";
import Icon, { NEW_ICON_TYPES, OLD_ICON_TYPES } from "../../utility/icon";
import ListItem from "../../utility/list/ListItem";
import Link from "../../utility/link";

class IconFeatures extends Features {
  constructor() {
    super();
  }

  protected _create(): Box<HTMLDivElement> {
    const items = [
      this._color(),
      this._size(),
      this._newIconType(),
      this._oldIconType(),
      this._setIcon(),
    ];

    return this._createFeaturePage({
      items,
      title: "icon",
    });
  }

  private _color() {
    return this._createFeature({
      items: this._getColorsWithMode().map(
        (color) => new Icon({ iconName: "home", color })
      ),
      title: "color",
      text: "default is light",
    });
  }

  private _size() {
    return this._createFeature({
      items: ([...SIZES, "x-large"] as const).map((size) =>
        this._createFeatureListItem(new Icon({ iconName: "call", size }), size)
      ),
      title: "size",
      text: "default is medium",
    });
  }

  private _newIconType() {
    const link = new Link(
      {
        href: "https://fonts.google.com/icons?icon.set=Material+Symbols",
        children: " material symbols",
      },
      { styles: { minWidth: "170px", whiteSpace: "nowrap" } }
    );
    link.component.target = "_blank";

    const textContent =
      "new icons is default icon mode because recommended by google. default type is rounded. to see the complete list of new icons go to the";

    const text = new Box<HTMLSpanElement>({
      elementName: "span",
      children: [textContent, link],
      classNames: "flex-align-center",
    });

    return this._createFeature({
      items: NEW_ICON_TYPES.map((type) =>
        this._createFeatureListItem(
          new Icon({
            iconName: "home",
            type,
            size: "large",
          }),
          type
        )
      ),
      title: "new icons with types",
      text,
    });
  }

  private _oldIconType() {
    const link = new Link(
      {
        href: "https://fonts.google.com/icons?icon.set=Material+Symbols",
        children: " material symbols",
      },
      { styles: { minWidth: "170px", whiteSpace: "nowrap" } }
    );
    link.component.target = "_blank";

    const textContent =
      "default type is rounded. to see the complete list of new icons go to the";

    const text = new Box<HTMLSpanElement>({
      elementName: "span",
      children: [textContent, link],
      classNames: "flex-align-center",
    });
    return this._createFeature({
      items: OLD_ICON_TYPES.map((type) =>
        type !== "twoTone"
          ? this._createFeatureListItem(
              new Icon({
                iconName: "home",
                isOldIcon: true,
                type,
                size: "large",
              }),
              type
            )
          : new ListItem(
              [
                new Icon({
                  iconName: "home",
                  isOldIcon: true,
                  type,
                  size: "large",
                }),
                new Box<HTMLSpanElement>({
                  children: titleCase(type),
                  elementName: "span",
                  styles: {
                    marginTop: "0.75rem",
                    fontSize: "var(--fs-large)",
                    color: `var(--${getMode()})`,
                  },
                }),
              ],
              {
                classNames: ["flex-align-center", "flex-column"],
                styles: {
                  backgroundColor: `var(--${
                    getMode() === "dark" ? "light" : "dark"
                  })`,
                },
              }
            )
      ),
      title: "old icons with types",
      text,
    });
  }

  private _setIcon() {
    const eventButton = new Button("change icon");
    const icon = new Icon({ iconName: "home" });
    const randomIcons = [
      "search",
      "home",
      "settings",
      "menu",
      "favorite",
      "add",
      "delete",
      "close",
      "check_circle",
      "refresh",
    ] as const;

    eventButton.component.addEventListener("click", () => {
      const randomIndex = getRandomIndex(randomIcons.length);
      icon.setIcon(randomIcons[randomIndex]);
    });

    return this._createFeature({
      items: [
        eventButton,
        new ListItem(icon, { classNames: "flex-align-center" }),
      ],
      title: "set icon with animation",
    });
  }
}

export default IconFeatures;
