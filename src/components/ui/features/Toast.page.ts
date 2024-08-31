import Features from "./features";
import Box from "../../utility/box";
import Button from "../../utility/button";
import toast from "../../utility/toast";
import {
  TOAST_POSITIONS,
  ToastContainer,
} from "../../utility/toast/ToastContainer";
import { addToastContainer } from "../../../utilities/style.utilities";

class ToastFeatures extends Features {
  constructor() {
    super();
  }

  protected _create(): Box<HTMLDivElement> {
    const items = [
      this._type(),
      this._autoClose(),
      this._position(),
      this._pauseOnHover(),
      this._pauseOnFocusLoss(),
      this._toastInQueue(),
    ];

    return this._createFeaturePage({ items, title: "toast" });
  }

  private _showToastButton(eventHandler: () => void, buttonText?: string) {
    const button = new Button(buttonText ?? "show toast");
    button.component.addEventListener("click", eventHandler);
    return [button];
  }

  private _type() {
    const handler = () => {
      const toastContainer = new ToastContainer({ maxToastsCount: 4 });
      addToastContainer(toastContainer);

      (["info", "success", "warning", "error"] as const).map((type) =>
        toast[type](`a toast with type ${type}`, {
          pauseOnHover: false,
          toastContainer,
          onClose: () => this._onToastClose(toastContainer),
        })
      );
    };

    return this._createFeature({
      items: this._showToastButton(handler),
      title: "type",
      text: "default is info",
    });
  }

  private _autoClose() {
    const handler = () => {
      toast.info("auto close off", { autoClose: false });
      toast.info("auto close on");
      toast.info(`auto close on with duration: ${10000}`, { autoClose: 10000 });
    };
    return this._createFeature({
      items: this._showToastButton(handler),
      title: "auto close",
      text: "default is 5000ms",
    });
  }

  private _position() {
    const items = TOAST_POSITIONS.map((position) => {
      const handler = () => {
        const toastContainer = new ToastContainer({ position });
        addToastContainer(toastContainer);
        toast.info(`toast 1 in position ${position}`, {
          toastContainer,
          onClose: () => this._onToastClose(toastContainer),
        });
        toast.info(`toast 2 in position ${position}`, {
          toastContainer,
          onClose: () => this._onToastClose(toastContainer),
        });
      };

      return this._showToastButton(handler, position)[0];
    });

    return this._createFeature({
      items,
      title: "position",
      text: "default is top-center",
    });
  }

  private _pauseOnHover() {
    const handler = () => {
      toast.info("pause on hover off", { pauseOnHover: false });
      toast.info("pause on hover on");
    };
    return this._createFeature({
      items: this._showToastButton(handler),
      title: "pause on hover",
      text: "default is true",
    });
  }

  private _pauseOnFocusLoss() {
    const handler = () => {
      toast.info("pause on focus loss off", { pauseOnFocusLoss: false });
      toast.info("pause on focus loss on");
    };
    return this._createFeature({
      items: this._showToastButton(handler),
      title: "pause on focus loss",
      text: "default is true",
    });
  }

  private _toastInQueue() {
    const handler = () => {
      Array(4)
        .fill(undefined)
        .forEach(() => toast.info("close one toast to see 4th toast"));
    };
    return this._createFeature({
      items: this._showToastButton(handler),
      title: "toast in queue",
      text: "default max toasts count in screen is 3",
    });
  }

  private _onToastClose(toastContainer: ToastContainer) {
    if (toastContainer.toasts.length === 1) {
      toastContainer.component.remove();
    }
  }
}

export default ToastFeatures;
