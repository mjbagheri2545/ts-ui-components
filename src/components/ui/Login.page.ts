import { appendChildren } from "../../utilities/components.utilities";
import { qs } from "../../utilities/components.utilities";
import Box from "../utility/box";
import Button from "../utility/button";
import Icon from "../utility/icon";
import IconButton from "../utility/iconButton";
import InputField from "../utility/inputField";
import Link from "../utility/link";
import toast from "../utility/toast";

class Login {
  component: Box<HTMLDivElement>;

  constructor() {
    this.component = this._create();
  }

  private _create() {
    const title = new Box<HTMLHeadingElement>({
      elementName: "h1",
      styles: { fontSize: "2rem", marginBottom: "0.25rem" },
      children: "Login",
      classNames: "primary-text",
    });

    const homeLink = new Link("back to home");

    const loginIcon = new Icon({
      iconName: "lock",
      styles: { fontSize: "8rem !important" as any, marginTop: "1.25rem" },
    });

    const header = new Box({
      children: [title, homeLink, loginIcon],
      classNames: ["flex-center", "flex-column"],
      styles: { marginBottom: "1.75rem" },
    });

    const emailInput = new InputField({
      label: "Email",
      type: "email",
      icon: { element: new Icon({ iconName: "email", isOldIcon: true }) },
      errorMessage: "You must enter a valid email",
      isFullWidth: true,
      styles: {
        "& .Icon": {
          marginRight: "0.55rem",
        },
      },
    });

    const passwordIcon = new Icon({ iconName: "visibility", isOldIcon: true });
    const passwordIconButton = new IconButton(passwordIcon);

    const passwordInput = new InputField({
      label: "Password",
      type: "password",
      icon: { element: passwordIconButton },
      errorMessage: "You must enter a valid email",
      isFullWidth: true,
    });

    passwordIconButton.component.addEventListener("click", () => {
      const isVisible = passwordIcon.iconName === "visibility_off";
      passwordIcon.setIcon(isVisible ? "visibility" : "visibility_off");

      const input = qs<HTMLInputElement>(".input", passwordInput.component)!;
      input.type = isVisible ? "password" : "text";
    });

    const submitButton = new Button("login", {
      isFullWidth: true,
      styles: {
        marginTop: "1.25rem",
      },
    });
    submitButton.component.type = "submit";

    const form = new Box<HTMLFormElement>({
      elementName: "form",
      classNames: "width-100",
    });

    form.component.noValidate = true;

    appendChildren(form, [emailInput, passwordInput, submitButton]);

    form.component.addEventListener("submit", async (e) => {
      e.preventDefault();

      const isEmailValid = this._validate(emailInput);
      const isPasswordValid = this._validate(passwordInput);
      if (isEmailValid && isPasswordValid) {
        submitButton.isLoading = true;
        await this._sleep();
        toast.success("You logged in successfully with email.");
        submitButton.isLoading = false;
      }
    });

    const orText = new Box<HTMLSpanElement>({
      elementName: "span",
      classNames: ["width-100", "text-center", "primary-text"],
      styles: { margin: "1.5rem 0" },
      children: "Or",
    });

    const googleLoginButton = new Button("continue with google", {
      isFullWidth: true,
    });

    googleLoginButton.component.addEventListener("click", async () => {
      googleLoginButton.isLoading = true;
      await this._sleep();
      toast.success("You logged in successfully with google.");
      googleLoginButton.isLoading = false;
    });

    const container = new Box({
      classNames: ["flex-center", "flex-column", "width-100"],
      styles: { padding: "1rem 1.25rem", maxWidth: "35rem" },
    });

    appendChildren(container, [header, form, orText, googleLoginButton]);
    return container;
  }

  private _validate(inputField: InputField) {
    const input = qs<HTMLInputElement>(".input", inputField.component)!;

    if (input.value.length > 0) {
      inputField.setError(false);
      return true;
    }

    if (!inputField.error) {
      inputField.setError(true);
    }
    return false;
  }

  private _sleep() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export default Login;
