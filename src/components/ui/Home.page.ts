import FEATURE_PAGES_INFORMATION from "../../constants/global/ui.global";
import { appendChildren } from "../../utilities/components.utilities";
import Box from "../utility/box";
import Link from "../utility/link";
import List from "../utility/list";
import ToggleMode from "./ToggleMode";

class Home {
  component: Box<HTMLElement>;
  constructor() {
    this.component = this._create();
  }

  private _create(): Box<HTMLElement> {
    const links = new List<HTMLElement>(
      [
        ...FEATURE_PAGES_INFORMATION,
        { linkText: "login page", linkHref: "/login" },
      ].map(
        (page) => new Link({ children: page.linkText, href: page.linkHref })
      ),
      {
        elementName: "nav",
      }
    );

    const heading = new Box<HTMLHeadingElement>({
      elementName: "h1",
      classNames: ["text-center", "primary-text"],
      children: "Home",
      styles: { fontSize: "2rem", marginBottom: "2rem" },
    });

    const noticeText =
      "Notice: As you can see layout is very very simple, because at first i just create this project to practice typescript as my first typescript project but i decided to publish it but now i don't have time to create beautiful and full responsive layout for this project, but as you can see components are beautiful and full featured. maybe in the later i will come back and develop more components and more advanced feature and create a good and beautiful layout and add documents and publish it as a ui component library for pure js projects. see the login page that i created with this components, this is great for pure project!";

    const notice = new Box<HTMLParagraphElement>({
      elementName: "p",
      classNames: ["text-center", "primary-text"],
      children: noticeText,
      styles: {
        fontSize: "var(--fs-larger-1)",
        lineHeight: "1.75rem",
        padding: "0 1rem",
      },
    });

    const header = new Box<HTMLElement>({ elementName: "header" });
    appendChildren(header, [
      heading,
      links,
      notice,
      new ToggleMode().component,
    ]);

    return header;
  }
}

export default Home;
