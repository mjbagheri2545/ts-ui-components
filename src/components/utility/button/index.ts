import {
  appendChild,
  pickComponentProps,
} from "../../../utilities/components.utilities";
import { getProperties } from "../../../utilities/style.utilities";
import { Component, ComponentProps, Components } from "../../Component";
import Box from "../box";
import ButtonBase, { ButtonBaseProps } from "../buttonBase";
import Ripples from "../buttonBase/ripples";

export type ButtonProps = Omit<ButtonBaseProps, "variant"> &
  Partial<{
    variant: ButtonBaseProps["variant"] | "text";
    isFullWidth: boolean;
  }>;

class Button extends ButtonBase {
  private _options: ButtonProps = { variant: "filled" };

  constructor(
    private _children: Components,
    { variant, ...restButtonProps }: ComponentProps<ButtonProps> = {}
  ) {
    const { options } = pickComponentProps(restButtonProps);
    super(restButtonProps);
    this._options = {
      ...this.options,
      ...this._options,
      ...options,
    };
    this._options.variant = variant || this._options.variant;
    this._create();
  }

  protected _create(): void {
    this._appendChildren();
    this._addRipples();
    this.addSpecificClassNames([
      "Button",
      "rounded",
      "button-shadow",
      this._options.variant,
      this._options.isFullWidth ? "width-100" : "",
    ]);
  }

  private _appendChildren() {
    if (Array.isArray(this._children)) {
      return this._children.forEach(this._appendChild);
    }

    this._appendChild(this._children);
  }

  private _appendChild(child: Component) {
    if (typeof child === "string") {
      const box = new Box<HTMLSpanElement>({
        classNames: "text",
        elementName: "span",
      });
      appendChild(box.component, child);
      return appendChild(this.component, box.component);
    }
    appendChild(this.component, child);
  }

  protected _addRipples(): void {
    appendChild(this.component, new Ripples());

    this.component.addEventListener("click", (e: MouseEvent) => {
      const scaleFactor =
        this.options.size === "medium"
          ? 1
          : (getProperties({
              element: this.component,
              keys: "--scale",
            }) as number);

      const rect = this.component.getBoundingClientRect();
      const top = (e.clientY - rect.top) / scaleFactor;
      const left = (e.clientX - rect.left) / scaleFactor;

      Ripples.createRipples({
        component: this.component,
        top,
        left,
      });
    });
  }
}

export default Button;
