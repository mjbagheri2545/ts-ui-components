import { ModeExcludedSystem } from "../../constants/global/style.global";
import { getMode, setMode } from "../../utilities/style.utilities";
import Fab from "../utility/fab";
import Icon from "../utility/icon";

function getModeColor(): ModeExcludedSystem {
  return getMode() === "dark" ? "light" : "dark";
}

class ToggleMode {
  component: HTMLButtonElement;
  constructor() {
    this.component = this._create();
  }
  private _create(): HTMLButtonElement {
    const toggleModeIcon = new Icon({ iconName: `${getModeColor()}_mode` });
    const toggleModeButton = new Fab(toggleModeIcon);

    toggleModeButton.component.addEventListener("click", () => {
      setMode(getModeColor());
      toggleModeIcon.setIcon(`${getModeColor()}_mode`);
    });
    return toggleModeButton.component;
  }
}

export default ToggleMode;
