import Features from "./features";
import Box from "../../utility/box";
import Spinner from "../../utility/spinner";

class SpinnerFeatures extends Features {
  constructor() {
    super();
  }

  protected _create(): Box<HTMLDivElement> {
    const items = [
      this._color(),
      this._size(),
      this._animationDuration(),
      this._strokeWidth(),
    ];

    return this._createFeaturePage({
      items,
      title: "spinner",
    });
  }

  private _color() {
    return this._createFeature({
      items: this._getColorsWithMode().map((color) => new Spinner({ color })),
      title: "color",
      text: "default is primary",
    });
  }

  private _size() {
    return this._createFeature({
      items: [40, 80, 120, 160, 200].map((size) =>
        this._createFeatureListItem(new Spinner({ size }), `${size}px`)
      ),
      title: "size",
      text: "default is 40px",
    });
  }

  private _animationDuration() {
    return this._createFeature({
      items: [400, 800, 1200, 1600, 2000, 2500, 3000].map((animationDuration) =>
        this._createFeatureListItem(
          new Spinner({ animationDuration }),
          `${animationDuration}ms`
        )
      ),
      title: "animation duration",
      text: "default is 800ms",
    });
  }

  private _strokeWidth() {
    return this._createFeature({
      items: [2, 4, 6, 8, 10, 14, 18].map((strokeWidth) =>
        this._createFeatureListItem(
          new Spinner({ strokeWidth, size: 10 * strokeWidth }),
          `${strokeWidth}px`
        )
      ),
      title: "stroke width",
      text: "default is 5px",
    });
  }
}

export default SpinnerFeatures;
