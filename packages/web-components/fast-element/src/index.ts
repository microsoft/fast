// Kernel
export type {
    Callable,
    Constructable,
    Disposable,
    FASTGlobal,
    Mutable,
    StyleStrategy,
    StyleTarget,
} from "./interfaces.js";
export * from "./platform.js";
export * from "./dom.js";

// Observation
export * from "./observation/observable.js";
export * from "./observation/notifier.js";
export * from "./observation/arrays.js";
export * from "./observation/update-queue.js";

// Styles
export * from "./styles/element-styles.js";
export * from "./styles/css.js";
export * from "./styles/css-directive.js";
export * from "./styles/host.js";

// Templating
export * from "./templating/template.js";
export * from "./templating/compiler.js";
export { Markup, Parser } from "./templating/markup.js";
export * from "./templating/binding.js";
export * from "./templating/html-directive.js";
export * from "./templating/ref.js";
export * from "./templating/when.js";
export * from "./templating/repeat.js";
export * from "./templating/slotted.js";
export * from "./templating/children.js";
export * from "./templating/view.js";
export * from "./templating/node-observation.js";
export * from "./templating/dangerous-html.js";

// Components
export * from "./components/fast-element.js";
export * from "./components/fast-definitions.js";
export * from "./components/attributes.js";
export {
    ElementController,
    ElementControllerStrategy,
} from "./components/element-controller.js";
