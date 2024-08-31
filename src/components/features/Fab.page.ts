import Features from "./features";
import { TRANSITION } from "../../../constants/global/style.global";
import { appendChild } from "../../../utilities/components.utilities";
import { qs } from "../../../utilities/components.utilities";
import Box from "../../utility/box";
import Button from "../../utility/button";
import Fab, { FAB_SHARP_POSITIONS } from "../../utility/fab";
import Icon from "../../utility/icon";
import List from "../../utility/list";
import ListItem from "../../utility/list/ListItem";

class FabFeatures extends Features {
  constructor() {
    super();
  }

  protected _create(): Box<HTMLDivElement> {
    const items = [
      this._color(),
      this._position(),
      this._sharpPosition(),
      this._animation(),
    ];
    return this._createFeaturePage({
      items,
      title: "fab (floating action button)",
    });
  }

  private _getFabStyles() {
    return { position: "static !important" as any };
  }

  private _color() {
    return this._createFeature({
      items: this._getColorsWithMode().map(
        (color) =>
          new Fab(new Icon({ iconName: "colors" }), {
            color,
            styles: this._getFabStyles(),
          })
      ),
      title: "color",
      text: "default is primary",
    });
  }

  private _position() {
    return this._createFeature({
      items: [
        new ListItem(
          (["left", "right"] as const).map((position) =>
            this._createFeatureListItem(
              new Fab(new Icon({ iconName: "add" }), {
                position,
                styles: this._getFabStyles(),
              }),
              position
            )
          ),
          {
            classNames: [
              "width-100",
              "flex-align-center",
              "justify-space-between",
            ],
          }
        ),
      ],
      title: "position",
      text: "default is right",
    });
  }

  private _sharpPosition() {
    return this._createFeature({
      items: FAB_SHARP_POSITIONS.map((sharpPosition) =>
        this._createFeatureListItem(
          new Fab(new Icon({ iconName: "add" }), {
            sharpPosition,
            styles: this._getFabStyles(),
          }),
          sharpPosition
        )
      ),
      title: "sharp position",
      text: "default is none",
    });
  }

  private _animation() {
    const eventButton = new Button("remove fab");
    const fab = new Fab(
      new Icon({ iconName: "add", dataAttributes: "animationListFab" }),
      {
        styles: this._getFabStyles(),
      }
    );

    eventButton.component.addEventListener("click", () => {
      const fab = qs("[data-animation-list-fab]") as Fab["component"];
      const list = fab!.parentElement!.parentElement as List["component"];
      if (fab == null) {
        appendChild(
          list,
          new ListItem(
            new Fab(new Icon({ iconName: "add" }), {
              styles: this._getFabStyles(),
            })
          )
        );
        qs(".text", eventButton)!.innerText = "remove fab";
      } else {
        fab.classList.add("leave");
        setTimeout(() => {
          fab.parentElement?.remove();
        }, TRANSITION.leaving.time);
        qs(".text", eventButton)!.innerText = "show fab";
      }
    });

    return this._createFeature({
      items: [eventButton, fab],
      title: "animation",
    });
  }
}

export default FabFeatures;
