import { DOM } from "./dom.js";
import { DOMPolicy } from "./dom-policy.js";

export {
    AttributeConfiguration,
    AttributeDefinition,
    attr,
    booleanConverter,
    nullableBooleanConverter,
    nullableNumberConverter,
} from "./attr.js";
export {
    Binding,
    listener,
    normalizeBinding,
    oneTime,
    oneWay,
} from "./binding.js";
export { ChildrenDirective, children } from "./directives/children.js";
export { elements, NodeObservationDirective } from "./directives/node-observation.js";
export { RefDirective, ref } from "./directives/ref.js";
export { RepeatBehavior, RepeatDirective, repeat } from "./directives/repeat.js";
export { SlottedDirective, slotted } from "./directives/slotted.js";
export { when } from "./directives/when.js";
export { DOM, DOMAspect } from "./dom.js";
export { html } from "./html.js";
export {
    enableHydration,
    HydrationBindingError,
    HydrationTracker,
    isHydratable,
} from "./hydration.js";
export * from "./index.js";
export { Observable, observable } from "./observable.js";
export { RenderBehavior, RenderDirective, render } from "./render.js";
export { Schema, schemaRegistry } from "./schema.js";
export {
    Compiler,
    HTMLBindingDirective,
    HTMLDirective,
    HTMLView,
    htmlDirective,
    InlineTemplateDirective,
    Markup,
    Parser,
    StatelessAttachedAttributeDirective,
    ViewTemplate,
} from "./templating.js";
export { Updates } from "./updates.js";
export { volatile } from "./volatile.js";

DOM.setPolicy(DOMPolicy.create());
