import Features from "./features";
import { SIZES } from "../../../constants/types/utilities.types";
import Box from "../../utility/box";
import Button from "../../utility/button";
import ListItem from "../../utility/list/ListItem";

class ButtonFeatures extends Features {
  constructor() {
    super();
  }
  protected _create(): Box<HTMLDivElement> {
    const items = [
      this._color(),
      this._size(),
      this._variant(),
      this._isLoading(),
      this._fullWidth(),
    ];

    return this._createFeaturePage({
      items,
      title: "button",
    });
  }

  private _color() {
    return this._createFeature({
      items: this._getColorsWithMode().map(
        (color) => new Button(color, { color })
      ),
      title: "color",
      text: "default is primary",
    });
  }

  private _size() {
    return this._createFeature({
      items: SIZES.map((size) => new Button(size, { size })),
      title: "size",
      text: "default is medium",
    });
  }

  private _variant() {
    return this._createFeature({
      items: (["filled", "outlined", "text"] as const).map(
        (variant) => new Button(variant, { variant })
      ),
      title: "variant",
      text: "default is filled",
    });
  }

  private _isLoading() {
    const eventButton = new Button("change state");
    const fetchButton = new Button("Fetch");
    eventButton.component.addEventListener("click", () => {
      fetchButton.isLoading = !fetchButton.isLoading;
    });

    return this._createFeature({
      items: [eventButton, fetchButton],
      title: "loading state",
    });
  }

  private _fullWidth() {
    return this._createFeature({
      items: [
        ...[false, true].map(
          (bool) =>
            new ListItem(
              new Button(bool ? "normal full width" : "normal", {
                isFullWidth: bool,
              }),
              { classNames: "width-100" }
            )
        ),
        new ListItem(
          new Button("full width without limit", {
            isFullWidth: true,
            styles: { maxWidth: "none !important" },
          }),
          { classNames: "width-100" }
        ),
      ],
      title: "full width",
      text: "default is false",
    });
  }
}

export default ButtonFeatures;
