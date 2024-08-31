import Features from "./features";
import Box from "../../utility/box";
import { MAIN_COLORS } from "../../../constants/global/color.global";
import InputField from "../../utility/inputField";
import { SIZES } from "../../../constants/types/utilities.types";
import ListItem from "../../utility/list/ListItem";
import Icon from "../../utility/icon";
import IconButton from "../../utility/iconButton";
import Button from "../../utility/button";

class InputFieldFeatures extends Features {
  constructor() {
    super();
  }

  protected _create(): Box<HTMLDivElement> {
    const items = [
      this._color(),
      this._size(),
      this._isRequired(),
      this._placeholder(),
      this._icon(),
      this._error(),
      this._fullWidth(),
    ];

    return this._createFeaturePage({
      items,
      title: "input field",
    });
  }

  private _color() {
    return this._createFeature({
      items: MAIN_COLORS.map(
        (color) => new InputField({ label: color, color })
      ),
      title: "color",
      text: "default is primary",
    });
  }

  private _size() {
    return this._createFeature({
      items: SIZES.map((size) => new InputField({ label: size, size })),
      title: "size",
    });
  }

  private _isRequired() {
    return this._createFeature({
      items: [true, false].map(
        (isRequired) =>
          new InputField({
            label: isRequired ? "required" : "optional",
            isRequired,
          })
      ),
      title: "size",
      text: "default is medium",
    });
  }

  private _placeholder() {
    return this._createFeature({
      items: [
        new InputField({ label: "label" }),
        new InputField({
          label: "label",
          placeholder: "Your Custom Placeholder",
        }),
      ],
      title: "placeholder",
      text: 'default is "Enter your label"',
    });
  }

  private _icon() {
    const passwordIcon = new Icon({ iconName: "visibility" });
    const passwordIconButton = new IconButton(passwordIcon);
    passwordIconButton.component.addEventListener("click", () => {
      passwordIcon.setIcon(
        passwordIcon.iconName === "visibility" ? "visibility_off" : "visibility"
      );
    });

    return this._createFeature({
      items: [
        ...(["end", "start"] as const).map(
          (position) =>
            new InputField({
              label: `${position} icon`,
              icon: { element: new Icon({ iconName: "person" }), position },
            })
        ),
        new InputField({
          label: "with icon button",
          type: "password",
          icon: {
            element: passwordIconButton,
          },
        }),
      ],
      title: "icon",
    });
  }

  private _error() {
    const eventButton = new Button("change state");
    const inputFields = [
      new InputField({ label: "default is error message" }),
      new InputField({
        label: "custom default error message",
        errorMessage: "custom message",
      }),
    ];

    const dynamicErrorMessageInputField = new InputField({
      label: "dynamic error message",
    });

    eventButton.component.addEventListener("click", () => {
      inputFields.forEach((input) => input.setError(!input.error));
      dynamicErrorMessageInputField.setError(
        !dynamicErrorMessageInputField.error,
        "dynamic error message"
      );
    });

    return this._createFeature({
      items: [eventButton, ...inputFields, dynamicErrorMessageInputField],
      title: "error state",
    });
  }

  private _fullWidth() {
    return this._createFeature({
      items: [
        ...[false, true].map(
          (bool) =>
            new ListItem(
              new InputField({
                label: bool ? "normal full width" : "normal",
                isFullWidth: bool,
              }),
              { classNames: "width-100" }
            )
        ),
        new ListItem(
          new InputField({
            label: "full width without limit",
            isFullWidth: true,
            styles: {
              maxWidth: "none !important",
              "& .input": { maxWidth: "none !important" },
            },
          }),
          { classNames: "width-100" }
        ),
      ],
      title: "full width",
      text: "default is false",
    });
  }
}

export default InputFieldFeatures;
