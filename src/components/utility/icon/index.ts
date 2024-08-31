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
import { getMode } from "../../../utilities/style.utilities";

const ICON_SIZE = {
  small: "18px",
  large: "36px",
  "x-large": "48px",
};

function getIconClassName(type: IconProps["type"], isOldIcon?: boolean) {
  switch (type) {
    case "filled":
      return "";
    case "rounded":
      return isOldIcon ? "round" : "rounded";
    case "twoTone":
      return "two-tone";
  }
  return type;
}

type GetIconSize = Exclude<IconProps["size"], "medium" | undefined>;

function getIconSize(size: GetIconSize) {
  return ICON_SIZE[size];
}

export const NEW_ICON_TYPES = ["outlined", "rounded", "sharp"] as const;
export const OLD_ICON_TYPES = [...NEW_ICON_TYPES, "twoTone", "filled"] as const;

type NewIconType = (typeof NEW_ICON_TYPES)[number];
type OldIconType = (typeof OLD_ICON_TYPES)[number];

type NewIconProps = {
  isOldIcon?: false;
  type?: NewIconType;
  iconName: MaterialNewIcons | (string & {});
};

type OldIconProps = {
  isOldIcon: true;
  type?: OldIconType;
  iconName: MaterialOldIcons | (string & {});
};

export type IconProps = {
  color?: Colors;
  size?: Size | "x-large";
} & (NewIconProps | OldIconProps);

class Icon extends CreateComponent<HTMLSpanElement> {
  private options: Omit<IconProps, "iconName"> = {
    type: "rounded",
    size: "medium",
  };
  iconName: IconProps["iconName"];

  constructor(iconProps: ComponentProps<IconProps>) {
    const { props, options } = pickComponentProps(iconProps);
    super({ elementName: "span", props: props });
    this.options = {
      ...this.options,
      ...(getMode() === "dark" ? { color: "light" } : {}),
      ...options,
    };
    this.iconName = options.iconName;
    this._create();
  }

  setIcon(iconName: IconProps["iconName"], isAnimationNeed: boolean = true) {
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

  setColor(color: IconProps["color"]) {
    this._setColor<IconProps["color"]>(color, this.options.color);
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
    const className = getIconClassName(
      this.options.type,
      this.options.isOldIcon
    );

    this.addSpecificClassNames([
      "Icon",
      "rounded-circle",
      "flex-center",
      `material-${this.options.isOldIcon ? "icons" : "symbols"}${
        className!.length > 0 ? `-${className}` : ""
      }`,
      this.options.color,
      ...addSizeClassName(this.options.size),
    ]);
  }
}

export default Icon;
