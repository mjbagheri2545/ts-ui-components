import { MainColors } from "../../../constants/global/color.global";
import {
  addConditionalProperties,
  pickComponentProps,
} from "../../../utilities/components.utilities";
import CreateComponent, { ComponentProps } from "../../Component";

export type SpinnerProps = Partial<{
  size: number;
  color: MainColors | "light";
  strokeWidth: number;
}>;

class Spinner extends CreateComponent<HTMLSpanElement> {
  private options: SpinnerProps;

  constructor(spinnerProps: ComponentProps<SpinnerProps> = {}) {
    const { props, options } = pickComponentProps(spinnerProps);
    super({ elementName: "span", props });
    this.options = options;
    this._create();
  }

  setColor(color: SpinnerProps["color"]) {
    this._setColor<SpinnerProps["color"]>(color, this.options.color);
    this.options.color = color;
  }

  protected _create(): void {
    this.addSpecificClassNames([
      "Spinner",
      "rounded-circle",
      this.options.color,
    ]);
    this._addSpecificProperties();
  }

  private _addSpecificProperties() {
    addConditionalProperties(
      this.component,
      {
        key: "--size",
        value: `${this.options.size}px`,
      },
      this.options.size != null
    );
    addConditionalProperties(
      this.component,
      {
        key: "--stroke-width",
        value: `${this.options.strokeWidth}px`,
      },
      this.options.strokeWidth != null
    );
  }
}

export default Spinner;