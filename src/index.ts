import Button from "./components/utility/button";
import Fab from "./components/utility/fab";
import Icon from "./components/utility/icon";
import IconButton from "./components/utility/iconButton";
import Link from "./components/utility/link";
import { render } from "./utilities/components.utilities";
import { styleInitializer } from "./utilities/style.utilities";

function initialize() {
  styleInitializer();
}

initialize();

render(new Link({ children: "ali bagheri", href: "to-bagheri" }));
