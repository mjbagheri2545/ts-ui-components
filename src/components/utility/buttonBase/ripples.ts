import { appendChild } from "../../../utilities/components.utilities";
import {
  Properties,
  Property,
  setProperties,
} from "../../../utilities/style.utilities";
import { qs } from "../../../utilities/components.utilities";
import CreateComponent, {
  ElementComponent,
  NormalComponent,
} from "../../Component";
import Box from "../box";

const RIPPLES_ANIMATION_DURATION = 550;

type CreateRipples = {
  component: NormalComponent;
  top?: number;
  left?: number;
  animationDuration?: number;
};

class Ripples extends CreateComponent<HTMLSpanElement> {
  constructor() {
    super({
      component: new Box({
        elementName: "span",
        dataAttributes: "ripples",
      }),
    });
    this._create()
  }

  protected _create() {
    this.addSpecificClassNames([
      "ButtonBase-ripples",
      "Ripples",
      "position-absolute",
      "overflow-hidden",
    ]);
  }

  static createRipples({
    component,
    top,
    left,
    animationDuration = RIPPLES_ANIMATION_DURATION,
  }: CreateRipples): Box {
    const ripples = new Box({
      elementName: "span",
      classNames: ["Ripples-body", "position-absolute", "rounded-circle"],
    });

    const properties: Properties = [
      ...(top != null ? [{ key: "--top", value: `${top}px` } as Property] : []),
      ...(left != null
        ? [{ key: "--left", value: `${left}px` } as Property]
        : []),
      {
        key: "--ripples-animation-duration",
        value: `${animationDuration}ms`,
      },
    ];

    setProperties({ element: ripples, properties });

    appendChild(qs("[data-ripples]", component)!, ripples);

    setTimeout(() => {
      ripples.component.remove();
    }, animationDuration);

    return ripples;
  }
}

export default Ripples;
