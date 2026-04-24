import { DOM } from "./dom.js";
import { DOMPolicy } from "./dom-policy.js";

// Binding
export { Binding, type BindingDirective } from "./binding/binding.js";
export { normalizeBinding } from "./binding/normalize.js";
export { oneTime } from "./binding/one-time.js";
export { listener, oneWay } from "./binding/one-way.js";
export type {
    AttributeMode,
    DecoratorAttributeConfiguration,
    ValueConverter,
} from "./components/attributes.js";
// Components
export {
    AttributeConfiguration,
    AttributeDefinition,
    attr,
    booleanConverter,
    nullableBooleanConverter,
    nullableNumberConverter,
} from "./components/attributes.js";
export type { ElementControllerStrategy } from "./components/element-controller.js";
export {
    ElementController,
    Stages,
} from "./components/element-controller.js";
export type {
    FASTElementExtension,
    PartialFASTElementDefinition,
    ShadowRootOptions,
    TypeRegistry,
} from "./components/fast-definitions.js";
export {
    FASTElementDefinition,
    fastElementRegistry,
    type TemplateLifecycleCallbacks,
    TemplateOptions,
} from "./components/fast-definitions.js";
export { customElement, FASTElement } from "./components/fast-element.js";
export { deferHydrationAttribute, isHydratable } from "./components/hydration.js";
export {
    type ElementHydrationCallbacks,
    HydrationTracker,
} from "./components/hydration-tracker.js";
// DOM
export { DOM, DOMAspect, type DOMPolicy, type DOMSink } from "./dom.js";
export type {
    Callable,
    Class,
    Constructable,
    Disposable,
    TrustedTypesPolicy,
} from "./interfaces.js";
export type { FASTGlobal } from "./kernel.js";
// Observation
export {
    ArrayObserver,
    type LengthObserver,
    lengthOf,
    Sort,
    type SortObserver,
    Splice,
    SpliceStrategy,
    SpliceStrategySupport,
    sortedCount,
} from "./observation/arrays.js";
export {
    type Notifier,
    PropertyChangeNotifier,
    type Subscriber,
    SubscriberSet,
} from "./observation/notifier.js";
export {
    type Accessor,
    ExecutionContext,
    type Expression,
    type ExpressionController,
    type ExpressionNotifier,
    type ExpressionObserver,
    Observable,
    type ObservationRecord,
    observable,
    SourceLifetime,
    volatile,
} from "./observation/observable.js";
export { type UpdateQueue, Updates } from "./observation/update-queue.js";
export { emptyArray, FAST } from "./platform.js";
export { type CSSTemplateTag, type CSSValue, css } from "./styles/css.js";
// Styles
export {
    CSSDirective,
    type CSSDirectiveDefinition,
    cssDirective,
} from "./styles/css-directive.js";
export {
    type ComposableStyles,
    type ConstructibleStyleStrategy,
    ElementStyles,
} from "./styles/element-styles.js";
export type { HostBehavior, HostController } from "./styles/host.js";
export type { StyleStrategy, StyleTarget } from "./styles/style-strategy.js";
export type {
    ChildListDirectiveOptions,
    ChildrenDirectiveOptions,
    SubtreeDirectiveOptions,
} from "./templating/children.js";
// Templating
export { ChildrenDirective, children } from "./templating/children.js";
export type { CompilationStrategy } from "./templating/compiler.js";
export { Compiler } from "./templating/compiler.js";
export type {
    ContentTemplate,
    ContentView,
} from "./templating/html-binding-directive.js";
export { HTMLBindingDirective } from "./templating/html-binding-directive.js";
export type {
    AddViewBehaviorFactory,
    Aspected,
    CompiledViewBehaviorFactory,
    HTMLDirectiveDefinition,
    PartialHTMLDirectiveDefinition,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
    ViewController,
} from "./templating/html-directive.js";
export {
    HTMLDirective,
    htmlDirective,
    StatelessAttachedAttributeDirective,
} from "./templating/html-directive.js";
export { Markup, Parser } from "./templating/markup.js";
export type {
    ElementsFilter,
    NodeBehaviorOptions,
} from "./templating/node-observation.js";
export {
    elements,
    NodeObservationDirective,
} from "./templating/node-observation.js";
export { RefDirective, ref } from "./templating/ref.js";
export { RenderBehavior, RenderDirective, render } from "./templating/render.js";
export type { RepeatOptions } from "./templating/repeat.js";
export {
    RepeatBehavior,
    RepeatDirective,
    repeat,
} from "./templating/repeat.js";
export type { SlottedDirectiveOptions } from "./templating/slotted.js";
export { SlottedDirective, slotted } from "./templating/slotted.js";
export type {
    CaptureType,
    ElementViewTemplate,
    HTMLTemplateCompilationResult,
    HTMLTemplateTag,
    SyntheticViewTemplate,
    TemplateValue,
} from "./templating/template.js";
export {
    html,
    InlineTemplateDirective,
    ViewTemplate,
} from "./templating/template.js";
export type {
    ElementView,
    HydratableView,
    SyntheticView,
    View,
} from "./templating/view.js";
export { HTMLView, HydrationBindingError } from "./templating/view.js";
export { when } from "./templating/when.js";

DOM.setPolicy(DOMPolicy.create());
