import { ColorKeys } from "../../../constants/global/color.global";
import { Size } from "../../../constants/types/utilities.types";
import {
  addConditionalProperties,
  addSizeClassName,
  pickComponentProps,
} from "../../../utilities/components.utilities";
import CreateComponent, { ComponentProps } from "../../Component";

const BUTTON_BASE_SIZE = {
  small: 0.85,
  large: 1.05,
};

function getScaleSize(size: Exclude<Size, "medium">) {
  return BUTTON_BASE_SIZE[size];
}

export type ButtonBaseProps = Partial<{
  color: ColorKeys | "light" | "dark";
  size: Size;
}>;

abstract class ButtonBase extends CreateComponent<HTMLButtonElement> {
  protected options: ButtonBaseProps = { color: "primary", size: "medium" };

  constructor(buttonBaseProps: ComponentProps<ButtonBaseProps> = {}) {
    const { props, options } = pickComponentProps(buttonBaseProps);
    super({ elementName: "button", props });
    this.options = { ...this.options, ...options };
    this._createButtonBase();
  }

  protected _addRipples(): void {}

  protected _createButtonBase(): void {
    this.addSpecificClassNames([
      "ButtonBase",
      "cursor-pointer",
      "flex-center",
      "standard-transition",
      "position-relative",
      ...addSizeClassName(this.options.size),
      this.options.color,
    ]);
    this._addSpecificProperties();
  }

  private _addSpecificProperties() {
    this.component.type = "button";
    this.component.dataset.buttonBase = "";

    addConditionalProperties(
      this.component,
      {
        key: "--scale",
        value: `${getScaleSize(this.options.size as Exclude<Size, "medium">)}`,
      },
      this.options.size != null && this.options.size !== "medium"
    );
  }
}

export default ButtonBase;
