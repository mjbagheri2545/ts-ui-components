import { TRANSITION } from "../../../constants/global/style.global";
import {
  appendChildren,
  pickComponentProps,
} from "../../../utilities/components.utilities";
import { qs } from "../../../utilities/components.utilities";
import CreateComponent, {
  Component,
  ComponentProps,
  ElementComponent,
} from "../../Component";
import Box from "../box";
import Icon from "../icon";
import IconButton from "../iconButton";
import toastContainer, {
  DEFAULT_TOAST_DURATION,
  SharedToastProps,
  ToastContainer,
} from "./ToastContainer";

const toast = {
  success: createToastMethod("success"),
  info: createToastMethod("info"),
  warning: createToastMethod("warning"),
  error: createToastMethod("error"),
};

export default toast;

function createToastMethod(type: Exclude<ToastProps["type"], undefined>) {
  return function (
    message: string,
    toastProps: ComponentProps<Omit<ToastProps, "type">> = {}
  ) {
    new Toast(message, { type, ...toastProps });
  };
}

function getCategoryIcon(type: ToastProps["type"]) {
  if (type === "success") return "check_circle";
  if (type === "error") return "cancel";
  return type;
}

export type ToastProps = {
  type?: "success" | "error" | "warning" | "info";
  toastContainer?: ToastContainer;
  onClose?: (toast: Toast) => void;
} & SharedToastProps;

export class Toast extends CreateComponent {
  private options: ToastProps = { type: "success" };
  private _indicatorProgress: number;
  private _isPausing: boolean = false;

  constructor(
    private _message: string,
    toastProps: ComponentProps<ToastProps> = {}
  ) {
    const { props, options } = pickComponentProps(toastProps);
    super({ props });
    this.options = { ...this.options, ...options };
    this._indicatorProgress = this.duration;
    this._create();
  }

  private get finalToastContainer() {
    return this.options.toastContainer || toastContainer;
  }

  private get duration() {
    return this.isAutoCloseBoolean
      ? this.isAutoClose
        ? DEFAULT_TOAST_DURATION
        : 0
      : ((this.options.autoClose ||
          this.finalToastContainer.options.autoClose) as number);
  }

  private get isToastContainerAutoCloseBoolean() {
    return (
      this.options.autoClose == null &&
      typeof this.finalToastContainer.options.autoClose
    );
  }

  private get isAutoCloseBoolean() {
    return (
      typeof this.options.autoClose === "boolean" ||
      this.isToastContainerAutoCloseBoolean
    );
  }

  get isAutoClose() {
    return typeof this.options.autoClose === "boolean"
      ? this.options.autoClose
      : this.isToastContainerAutoCloseBoolean
      ? this.finalToastContainer.options.autoClose
      : true;
  }

  protected _create(): void {
    this.addSpecificClassNames([
      "Toast",
      "standard-transition",
      "overflow-hidden",
      "rounded",
      "primary-text",
      this.options.type,
    ]);

    const indicator = this._createIndicator();
    const body = this._createBody();
    this.appendChildren([body, indicator]);

    this.finalToastContainer.handleOnThrowToast(this);
  }

  private _createIndicator(): Box<HTMLSpanElement> {
    return new Box<HTMLSpanElement>({
      elementName: "span",
      classNames: ["indicator", "rounded"],
      dataAttributes: "indicator",
    });
  }

  private _createBody(): Component {
    const body = new Box({
      classNames: [
        "body",
        "flex-align-center",
        "justify-space-between",
        "standard-transition",
      ],
    });

    const closeIcon = new Icon({ iconName: "close" });
    const closeButton = new IconButton(closeIcon, {
      classNames: "close-button",
      color: this.options.type,
    });

    closeButton.component.addEventListener("click", this._remove.bind(this));

    const categoryIcon = new Icon({
      classNames: "category-icon",
      size: "large",
      color: this.options.type,
      iconName: getCategoryIcon(this.options.type) as string,
    });

    const message = new Box({
      elementName: "span",
      classNames: "message",
      children: this._message,
    });

    const content = new Box({
      children: [categoryIcon, message],
      classNames: ["content", "flex-align-center"],
    });

    appendChildren(body.component, [content, closeButton]);

    return body.component;
  }

  autoClose(): void {
    const timeoutId = setTimeout(() => {
      const indicator = qs(
        "[data-indicator]",
        this.component
      ) as ElementComponent;

      const timer = setInterval(() => {
        if (this._isPausing) return;
        if (this._indicatorProgress <= 0) {
          this._remove();
          return clearInterval(timer);
        }
        indicator.style.width = `${
          (this._indicatorProgress / this.duration) * 100
        }%`;
        this._indicatorProgress -= 10;
      }, 10);
      clearTimeout(timeoutId);
    }, TRANSITION.entering.time);

    this._pauseOnHover();
    this._pauseOnFocusLoss();
  }

  private _remove(): void {
    this.addSpecificClassNames("leave");
    const timeoutId = setTimeout(() => {
      this.options.onClose?.(this);
      this.component.remove();
      this.finalToastContainer.removeToast(this);
      clearTimeout(timeoutId);
    }, TRANSITION.leaving.time);
  }

  private get isPauseOnHover() {
    return this.options.pauseOnHover != null
      ? this.options.pauseOnHover
      : this.finalToastContainer.options.pauseOnHover;
  }

  private _pauseOnHover() {
    if (this.isPauseOnHover) {
      this.component.addEventListener(
        "mouseenter",
        () => (this._isPausing = true)
      );
      this.component.addEventListener(
        "mouseleave",
        () => (this._isPausing = false)
      );
    }
  }

  private get isPauseOnFocusLoss() {
    return this.options.pauseOnFocusLoss != null
      ? this.options.pauseOnFocusLoss
      : this.finalToastContainer.options.pauseOnFocusLoss;
  }

  private _visibilityChange(bool: boolean) {
    this._isPausing = bool;
  }

  private _pauseOnFocusLoss() {
    if (this.isPauseOnFocusLoss) {
      window.addEventListener("blur", () => this._visibilityChange(true));
      window.addEventListener("focus", () => this._visibilityChange(false));
      return;
    }
    window.removeEventListener("blur", () => this._visibilityChange(true));
    window.removeEventListener("focus", () => this._visibilityChange(false));
  }
}
