import Features from "./features";
import { MAIN_COLORS } from "../../../constants/global/color.global";
import { SIZES } from "../../../constants/types/utilities.types";
import { getRandomIndex } from "../../../utilities/common.utilities";
import Box from "../../utility/box";
import Button from "../../utility/button";
import Icon from "../../utility/icon";
import IconButton from "../../utility/iconButton";

class IconButtonFeatures extends Features {
  constructor() {
    super();
  }

  protected _create(): Box<HTMLDivElement> {
    const items = [
      this._color(),
      this._size(),
      this._variant(),
      this._setColor(),
      this._setIcon(),
    ];

    return this._createFeaturePage({
      items,
      title: "icon button",
    });
  }

  private _color() {
    return this._createFeature({
      items: this._getColorsWithMode().map(
        (color) => new IconButton(new Icon({ iconName: "colors" }), { color })
      ),
      title: "color",
      text: "default is primary",
    });
  }

  private _size() {
    return this._createFeature({
      items: SIZES.map((size) =>
        this._createFeatureListItem(
          new IconButton(new Icon({ iconName: "home" }), { size }),
          size
        )
      ),
      title: "size",
      text: "default is medium",
    });
  }

  private _variant() {
    return this._createFeature({
      items: (["filled", "outlined"] as const).map((variant) =>
        this._createFeatureListItem(
          new IconButton(new Icon({ iconName: "home" }), { variant }),
          variant
        )
      ),
      title: "variant",
      text: "default is outlined"
    });
  }

  private _setColor() {
    const eventButton = new Button("change color");
    const iconButton = new IconButton(new Icon({ iconName: "home" }));

    eventButton.component.addEventListener("click", () => {
      const randomIndex = getRandomIndex(MAIN_COLORS.length);
      iconButton.setColor(MAIN_COLORS[randomIndex]);
    });

    return this._createFeature({
      items: [eventButton, iconButton],
      title: "set color",
    });
  }

  private _setIcon() {
    const eventButton = new Button("change icon");
    const icon = new Icon({ iconName: "home" });
    const iconButton = new IconButton(icon);
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
      iconButton.setIcon(() => icon.setIcon(randomIcons[randomIndex]));
    });

    return this._createFeature({
      items: [eventButton, iconButton],
      title: "set icon with animation",
    });
  }
}

export default IconButtonFeatures;
