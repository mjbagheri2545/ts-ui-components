import { TRANSITION } from "../../../constants/global/style.global";
import { addConditionalClassNames } from "../../../utilities/components.utilities";
import { ComponentProps } from "../../Component";
import ButtonBase, { ButtonBaseProps } from "../buttonBase";
import Ripples from "../buttonBase/ripples";
import Icon from "../icon";

class IconButton extends ButtonBase {
  constructor(
    private _icon: Icon,
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
      ...addConditionalClassNames("shadow", this.options.variant === "filled"),
    ]);
    this._icon.setColor(
      this.options.color === "dark" ? undefined : this.options.color
    );
    this.appendChild(this._icon.component);
  }

  protected _addRipples(): void {
    this.appendChild(new Ripples());

    this.component.addEventListener("click", () => {
      Ripples.createRipples({
        component: this.component,
        animationDuration: 450,
      });
    });
  }
}

export default IconButton;
