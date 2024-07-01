import { TRANSITION } from "../../../constants/global/style.global";
import {
  addConditionalClassNames,
  appendChild,
} from "../../../utilities/components.utilities";
import { getProperties } from "../../../utilities/style.utilities";
import { ComponentProps } from "../../Component";
import ButtonBase, { ButtonBaseProps } from "../buttonBase";
import Ripples from "../buttonBase/ripples";
import Icon from "../icon";

export type IconButtonChildren = Icon<boolean>;

class IconButton extends ButtonBase {
  constructor(
    private _icon: IconButtonChildren,
    iconButtonProps: ComponentProps<ButtonBaseProps> = {}
  ) {
    super(iconButtonProps);
    this._create();
  }

  setColor(color: ButtonBaseProps["color"]) {
    this._icon.setColor(color);
    this._setColor(color, this.options.color);
    this.options.color = color;
  }

  setIcon(callback: () => void) {
    callback();

    this.component.classList.remove("enter");
    this.addSpecificClassNames("leave");

    const timeoutId = setTimeout(() => {
      this.component.classList.remove("leave");
      this.addSpecificClassNames("enter");
      clearTimeout(timeoutId);
    }, TRANSITION.leaving.time);
  }

  protected _create(): void {
    this._addRipples();
    this.addSpecificClassNames([
      "IconButton",
      "rounded-circle",
      this.options.variant,
      ...addConditionalClassNames("button-shadow", this.options.variant === "filled"),
    ]);
    this._icon.setColor(
      this.options.color === "dark" ? undefined : this.options.color
    );
    appendChild(this.component, this._icon.component);
  }

  protected _addRipples(): void {
    appendChild(this.component, new Ripples());

    this.component.addEventListener("click", (e: MouseEvent) => {
      let top, left;

      if (this.options.variant === "filled") {
        const scaleFactor =
          this.options.size === "medium"
            ? 1
            : (getProperties({
                element: this.component,
                keys: "--scale",
              }) as number);

        const rect = this.component.getBoundingClientRect();
        top = (e.clientY - rect.top) / scaleFactor;
        left = (e.clientX - rect.left) / scaleFactor;
      }

      Ripples.createRipples({
        component: this.component,
        animationDuration: 450,
        top,
        left,
      });
    });
  }
}

export default IconButton;
