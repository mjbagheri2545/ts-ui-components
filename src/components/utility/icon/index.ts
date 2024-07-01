import { Colors } from "../../../constants/global/color.global";
import { TRANSITION } from "../../../constants/global/style.global";
import { Size } from "../../../constants/types/utilities.types";
import {
  MaterialNewIcons,
  MaterialOldIcons,
} from "../../../constants/types/icons.types";
import {
  addConditionalProperties,
  addSizeClassName,
  pickComponentProps,
} from "../../../utilities/components.utilities";
import CreateComponent, { ComponentProps } from "../../Component";

const ICON_SIZE = {
  small: "18px",
  large: "36px",
  "x-large": "48px",
};

function getIconClassName<IsNewIcon extends boolean>(
  type: IconProps<IsNewIcon>["type"],
  isNewIcon: boolean
) {
  switch (type) {
    case "filled":
      return "";
    case "rounded":
      return isNewIcon ? "rounded" : "round";
    case "twoTone":
      return "two-tone";
  }
  return type;
}

type GetIconSize = Exclude<IconProps["size"], "medium" | undefined>;

function getIconSize(size: GetIconSize) {
  return ICON_SIZE[size];
}

type NewIconType = "outlined" | "rounded" | "sharp";
type OldIconType = NewIconType | "twoTone" | "filled";

export type IconProps<IsNewIcon extends boolean = true> = Partial<{
  type: IsNewIcon extends true ? NewIconType : OldIconType;
  isNewIcon: boolean;
  color: Colors;
  size: Size | "x-large";
}>;

export type IconChildren<IsNewIcon extends boolean = true> =
  | (IsNewIcon extends true ? MaterialNewIcons : MaterialOldIcons)
  | (string & {});

class Icon<
  IsNewIcon extends boolean = true
> extends CreateComponent<HTMLSpanElement> {
  private options: IconProps<IsNewIcon> = {
    type: "rounded",
    isNewIcon: true,
    size: "medium",
  };

  constructor(
    public iconName: IconChildren<IsNewIcon>,
    iconProps: ComponentProps<IconProps<IsNewIcon>> = {}
  ) {
    const { props, options } = pickComponentProps(iconProps);
    super({ elementName: "span", props: props });
    this.options = { ...this.options, ...options };
    this._create();
  }

  setIcon(iconName: IconChildren<IsNewIcon>, isAnimationNeed: boolean = true) {
    this.iconName = iconName;
    if (!isAnimationNeed) return;

    this.component.classList.remove("fade-in");
    this.addSpecificClassNames("fade-out");

    const timeoutId = setTimeout(() => {
      this.component.classList.remove("fade-out");
      this.addSpecificClassNames("fade-in");
      this.component.innerText = this.iconName;
      clearTimeout(timeoutId);
    }, TRANSITION.leaving.time);
  }

  setColor(color: IconProps<IsNewIcon>["color"]) {
    this._setColor<IconProps<IsNewIcon>["color"]>(color, this.options.color);
    this.options.color = color;
  }

  protected _create(): void {
    this.component.innerText = this.iconName;
    this._addSpecificClassNames();

    addConditionalProperties(
      this.component,
      {
        key: "--size",
        value: getIconSize(this.options.size as GetIconSize),
      },
      this.options.size != null && this.options.size !== "medium"
    );
  }

  private _addSpecificClassNames() {
    const className = getIconClassName<IsNewIcon>(
      this.options.type,
      this.options.isNewIcon as boolean
    );

    this.addSpecificClassNames([
      "Icon",
      "rounded-circle",
      "flex-center",
      `material-${this.options.isNewIcon ? "symbols" : "icons"}${
        className!.length > 0 ? `-${className}` : ""
      }`,
      this.options.color,
      ...addSizeClassName(this.options.size),
    ]);
  }
}

export default Icon;
