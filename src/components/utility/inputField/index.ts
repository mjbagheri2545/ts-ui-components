import { MainColors } from "../../../constants/global/color.global";
import { Size } from "../../../constants/types/utilities.types";
import {
  addClassNames,
  addConditionalClassNames,
  addSizeClassName,
  appendChildren,
  pickComponentProps,
  qs,
} from "../../../utilities/components.utilities";
import { setProperties } from "../../../utilities/style.utilities";
import CreateComponent, { ComponentProps } from "../../Component";
import Box from "../box";
import Icon from "../icon";
import IconButton from "../iconButton";
import { v4 as uuidV4 } from "uuid";

const INPUT_SIZE = {
  small: "40px",
  large: "56px",
};

function getInputSize(size: Exclude<Size, "medium">) {
  return INPUT_SIZE[size];
}

function isIconButton(
  icon: Exclude<InputIcon["element"], undefined>
): icon is IconButton {
  return icon instanceof IconButton;
}

type InputIcon = {
  element?: Icon | IconButton;
  position?: "start" | "end";
};

export type InputFieldProps = { label: string } & Partial<{
  placeholder: string;
  type: string;
  icon: InputIcon;
  isFullWidth: boolean;
  size: Size;
  errorMessage: string;
  color: MainColors;
  id: string;
  isRequired: boolean;
}>;

class InputField extends CreateComponent {
  private options: InputFieldProps;
  private _error: boolean = false;

  constructor(inputFieldProps: ComponentProps<InputFieldProps>) {
    const { props, options } = pickComponentProps(inputFieldProps);
    super({ props });
    this.options = {
      isFullWidth: false,
      type: "text",
      size: "medium",
      color: "primary",
      isRequired: true,
      placeholder: `Enter your ${options.label}`,
      ...options,
      icon: { position: "end", ...options.icon },
    };
    this._create();
  }

  get error() {
    return this._error;
  }

  setError(error: boolean, errorMessage?: string) {
    this._error = error;
    const errorComponent = qs(
      "[data-error-message]",
      this.component
    ) as HTMLElement;

    errorComponent.innerText =
      errorMessage || this.options.errorMessage || errorComponent.innerText;

    this.component.classList[error ? "add" : "remove"]("isError");
    this._setColor<MainColors>(
      error ? "error" : this.options.color,
      error ? this.options.color : "error"
    );
    if (this.options.icon?.element != null) {
      this.options.icon.element.setColor(error ? "error" : this.options.color);
    }
  }

  protected _create(): void {
    this._setColor(this.options.color);
    this.addSpecificClassNames([
      "InputField",
      "position-relative",
      "rounded",
      "primary-text",
      ...addConditionalClassNames("isRequired", this.options.isRequired),
      ...addConditionalClassNames("width-100", this.options.isFullWidth),
    ]);

    if (this.options.size != null && this.options.size !== "medium") {
      setProperties({
        element: this.component,
        properties: {
          key: "--height",
          value: getInputSize(this.options.size),
        },
      });
    }

    const input = this._createInput();
    const label = this._createLabel();
    label.component.htmlFor = input.component.id;

    const error = this._createError();
    this._createIcon();

    this.appendChildren([input, label, error]);
  }

  private _createInput(): Box<HTMLInputElement> {
    const input = new Box<HTMLInputElement>({
      elementName: "input",
      classNames: [
        "input",
        "rounded",
        "standard-transition",
        ...addSizeClassName(this.options.size),
        ...addConditionalClassNames("width-100", this.options.isFullWidth),
      ],
    });

    input.component.addEventListener("change", () => {
      if (input.component.value.length > 0) {
        input.component.classList.add("active");
      } else {
        input.component.classList.remove("active");
      }
    });

    const id = this.options.id || uuidV4();
    input.component.placeholder = this.options.placeholder || "";
    input.component.id = id;
    input.component.type = this.options.type!;
    return input;
  }

  private _createLabel(): Box<HTMLLabelElement> {
    const label = new Box<HTMLLabelElement>({
      elementName: "label",
      classNames: ["label", "position-absolute", "standard-transition"],
    });
    appendChildren(label.component, this.options.label);
    return label;
  }

  private _createError(): Box<HTMLParagraphElement> {
    const error = new Box<HTMLParagraphElement>({
      elementName: "p",
      classNames: ["error-message", "width-100"],
      dataAttributes: "errorMessage",
    });

    appendChildren(error.component, this.options.errorMessage ?? "Error");
    return error;
  }

  private _createIcon() {
    if (this.options.icon?.element != null) {
      addClassNames(this.options.icon.element.component, [
        ...addConditionalClassNames(
          `position-${this.options.icon.position}`,
          this.options.icon?.position != null
        ),
        "input-icon",
        "standard-transition",
      ]);
      this.appendChild(this.options.icon.element.component);
      this.addSpecificClassNames(
        isIconButton(this.options.icon.element) ? "hasIconButton" : ""
      );
      this.options.icon.element.setColor(this.options.color);
    }
  }
}

export default InputField;
