import Button from "./components/utility/button";
import { render } from "./utilities/components.utilities";
import { styleInitializer } from "./utilities/style.utilities";

function initialize() {
  styleInitializer();
}

initialize();

render(new Button("imam ali (a)"));
