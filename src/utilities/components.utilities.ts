import CreateComponent, {
  Child,
  Children,
  Component,
} from "../components/Component";

export function appendChildren(component: Component, children?: Children) {
  if (children == null) return;

  if (Array.isArray(children)) {
    return children.forEach((child) => addChild(component, child));
  }

  addChild(component, children);
}

type IsChildACreateComponent = Exclude<Child, string>;

function isChildACreateComponent(
  child: IsChildACreateComponent
): child is Exclude<IsChildACreateComponent, Component> {
  return child instanceof CreateComponent;
}

export function addChild(component: Component, child: Child) {
  if (typeof child === "string") {
    return component.appendChild(document.createTextNode(child));
  }

  component.appendChild(
    isChildACreateComponent(child) ? child.component : child
  );
}
