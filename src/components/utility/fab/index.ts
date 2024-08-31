import { pickComponentProps } from "../../../utilities/components.utilities";
import CreateComponent, { ComponentProps } from "../../Component";
import { ButtonBaseProps } from "../buttonBase";
import Icon from "../icon";
import IconButton from "../iconButton";

export const FAB_SHARP_POSITIONS = [
  "none",
  "top",
  "bottom",
  "right",
  "left",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export type FabSharpPosition = (typeof FAB_SHARP_POSITIONS)[number];

export type FabProps = Omit<ButtonBaseProps, "variant"> &
  Partial<{
    sharpPosition: FabSharpPosition;
    position: "left" | "right";
  }>;

class Fab extends CreateComponent<HTMLButtonElement> {
  private options: FabProps = { sharpPosition: "none", position: "right" };
  private _iconButton: IconButton;

  constructor(
    _icon: Icon,
    fabProps: ComponentProps<FabProps> = {}
  ) {
    const { options } = pickComponentProps(fabProps);
    const iconButton = new IconButton(_icon, {
      variant: "filled",
      ...fabProps,
    });
    super({
      component: iconButton,
    });
    this._iconButton = iconButton;
    this.options = { ...this.options, ...options };
    this._create();
  }

  get iconButton() {
    return this._iconButton;
  }

  protected _create(): void {
    this.addSpecificClassNames([
      "Fab",
      "position-fixed",
      "enter",
      this.options.sharpPosition != null
        ? `sharp-${this.options.sharpPosition}`
        : "",
      this.options.position,
    ]);
  }
}

export default Fab;
