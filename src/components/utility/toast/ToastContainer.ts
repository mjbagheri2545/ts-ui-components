import { Toast } from ".";
import { TRANSITION } from "../../../constants/global/style.global";
import { ClassName } from "../../../constants/types/classNames.types";
import { Property, setProperties } from "../../../utilities/style.utilities";
import CreateComponent from "../../Component";

function addPositionClassName(
  position: ToastContainerProps["position"]
): ClassName[] {
  const classNames: ClassName[] = [];
  const positionClassNames = ["bottom", "left", "right"];

  positionClassNames.forEach((positionClassName) => {
    if (position?.includes(positionClassName)) {
      classNames.push(positionClassName);
    }
  });
  return classNames;
}

const MARGIN_FROM_EDGES = 6;
const MARGIN_TOP = 2;
export const DEFAULT_TOAST_DURATION = 5000;

function getTranslateX(position: ToastContainerProps["position"]): Property {
  let value: string = "calc(50dvw - 50%)";
  if (position?.includes("left")) {
    value = `${MARGIN_FROM_EDGES}dvw`;
  } else if (position?.includes("right")) {
    value = `${100 - MARGIN_FROM_EDGES}dvw`;
  }

  return { key: "--translateX", value };
}

export type SharedToastProps = Partial<{
  autoClose: number | boolean;
  pauseOnHover: boolean;
  pauseOnFocusLoss: boolean;
}>;

export const TOAST_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

type ToastContainerProps = Partial<{
  maxToastsCount: number;
  position: (typeof TOAST_POSITIONS)[number];
}> &
  SharedToastProps;

export class ToastContainer extends CreateComponent {
  private _toastsInQueue: Toast[] = [];
  private _toastsObserver: MutationObserver | undefined;
  private _options: ToastContainerProps = {
    autoClose: DEFAULT_TOAST_DURATION,
    maxToastsCount: 3,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    position: "top-center",
  };
  toasts: Toast[] = [];

  constructor(options: ToastContainerProps = {}) {
    super({
      props: {
        classNames: [
          "ToastContainer",
          "position-fixed",
          ...addPositionClassName(options.position),
        ],
        dataAttributes: "toastContainer",
      },
    });
    this._options = { ...this.options, ...options };

    setProperties({
      element: this.component,
      properties: [
        {
          key: "--margin-from-edges",
          value: `${MARGIN_FROM_EDGES}dvh`,
        },
        getTranslateX(this.options.position),
      ],
    });
  }

  protected _create(): void {}

  get options() {
    return this._options;
  }

  get toastsLength() {
    return this.toasts.length;
  }

  handleOnThrowToast(toast: Toast): void {
    if (this.toastsLength === this.options.maxToastsCount) {
      this._toastsInQueue.push(toast);
      return this._observeToasts();
    }

    this.toasts.push(toast);
    this._setToastFromTop(toast);

    this.appendChild(toast);
    toast.isAutoClose ? toast.autoClose() : null;
  }

  private _setToastFromTop(toast: Toast) {
    const toastIndex = this.toasts.indexOf(toast);

    let toastFromTop: number = 0;
    if (toastIndex !== 0) {
      for (const [index, otherToast] of Object.entries(this.toasts)) {
        if (parseInt(index) >= toastIndex) {
          break;
        }
        toastFromTop += otherToast.component.clientHeight;
      }
    }

    setProperties({
      element: toast.component,
      properties: {
        key: "--toast-from-edge",
        value: `${toastFromTop + MARGIN_TOP * 16 * toastIndex}px`,
      },
    });
  }

  removeToast(toast: Toast) {
    const toastIndex = this.toasts.indexOf(toast);
    this.toasts = this.toasts.filter((_, index) => toastIndex !== index);

    this.toasts.forEach((toast, index) => {
      if (index >= toastIndex) this._setToastFromTop(toast);
    });
  }

  private _observeToasts() {
    if (this._toastsObserver == null) {
      this._toastsObserver = new MutationObserver(
        this._toastsObserverCallback.bind(this)
      );
    }
    this._toastsObserver.observe(this.component, { childList: true });
  }

  private _toastsObserverCallback(
    mutationsList: MutationRecord[],
    observer: MutationObserver
  ) {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
        const toastInQueue = this._toastsInQueue.shift();
        if (toastInQueue != null) {
          setTimeout(() => {
            this.handleOnThrowToast(toastInQueue);
          }, TRANSITION.entering.time);
        }
        if (this._toastsInQueue.length === 0) {
          observer.disconnect();
        }
      }
    });
  }
}

const toastContainer = new ToastContainer();

export default toastContainer;
