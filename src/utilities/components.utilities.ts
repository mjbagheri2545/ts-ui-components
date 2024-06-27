import CreateComponent, {
  Component,
  Components,
  ElementComponent,
  NormalComponent,
} from "../components/Component";
import { ClassName, ClassNames } from "../constants/types/classNames.types";

export function isCreateComponent(
  component: Component | unknown
): component is CreateComponent<ElementComponent> {
  return component instanceof CreateComponent;
}

export function getElementComponent(
  component: NormalComponent
): ElementComponent {
  return isCreateComponent(component) ? component.component : component;
}

export function isComponent(object: unknown): object is Component {
  return (
    typeof object === "string" ||
    isCreateComponent(object) ||
    object instanceof HTMLElement ||
    object instanceof SVGElement
  );
}

export function appendChildren(
  component: NormalComponent,
  children?: Components
) {
  if (children == null) return;

  if (Array.isArray(children)) {
    return children.forEach((child) => appendChild(component, child));
  }

  appendChild(component, children);
}

export function appendChild(component: NormalComponent, child: Component) {
  const parentComponent = getElementComponent(component);
  if (typeof child === "string") {
    return parentComponent.appendChild(document.createTextNode(child));
  }
  parentComponent.appendChild(
    isCreateComponent(child) ? child.component : child
  );
}

export function addClassNames(
  element: NormalComponent,
  classNames: ClassNames
): void {
  const elementComponent = getElementComponent(element);
  classNamesToArray(classNames).forEach((className) =>
    className.length > 0 ? elementComponent.classList.add(className) : null
  );
}

export function classNamesToArray(classNames: ClassNames): ClassName[] {
  if (Array.isArray(classNames)) {
    return classNames.filter((className) => className != null) as ClassName[];
  }
  return classNames == null ? [] : classNames.split(" ");
}

export function qs<Element extends ElementComponent = HTMLElement>(
  query: string,
  element: NormalComponent | Document = document
): Element | null {
  return (
    element !== document
      ? getElementComponent(element as NormalComponent)
      : element
  ).querySelector<Element>(query);
}
