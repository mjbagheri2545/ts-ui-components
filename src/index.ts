import { styleInitializer } from "./utilities/style.utilities";
import { addClassNames, render } from "./utilities/components.utilities";
import * as FeaturePages from "./components/ui/features";
import Home from "./components/ui/Home.page";
import Login from "./components/ui/Login.page";
import FEATURE_PAGES_INFORMATION from "./constants/global/ui.global";

styleInitializer();

function initializer() {
  styleInitializer();
  addClassNames(document.body, ["flex-center"]);
  addClassNames(document.getElementById("app")!, ["flex-center"]);

  const pages = [
    ...FEATURE_PAGES_INFORMATION.map(({ ComponentName, ...rest }) => ({
      ...rest,
      Component: new FeaturePages[ComponentName]().component,
    })),
    { linkHref: "/", Component: new Home().component },
    { linkHref: "/login", Component: new Login().component },
  ];

  for (const page of pages) {
    if (page.linkHref === window.location.pathname) {
      render(page.Component);
      return;
    }
  }

  window.location.href = "/";
}

initializer();
