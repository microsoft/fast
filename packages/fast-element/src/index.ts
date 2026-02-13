// Kernel
export type {
    Callable,
    Class,
    Constructable,
    Disposable,
    FASTGlobal,
    TrustedTypesPolicy,
} from "./interfaces.js";
export { emptyArray, FAST } from "./platform.js";

// DOM
export { DOM, DOMAspect, type DOMPolicy, type DOMSink } from "./dom.js";

// Observation
export {
    ArrayObserver,
    lengthOf,
    Sort,
    sortedCount,
    Splice,
    SpliceStrategy,
    SpliceStrategySupport,
    type LengthObserver,
    type SortObserver,
} from "./observation/arrays.js";
export {
    PropertyChangeNotifier,
    SubscriberSet,
    type Notifier,
    type Subscriber,
} from "./observation/notifier.js";
export {
    ExecutionContext,
    Observable,
    observable,
    SourceLifetime,
    volatile,
    type Accessor,
    type Expression,
    type ExpressionController,
    type ExpressionNotifier,
    type ExpressionObserver,
    type ObservationRecord,
} from "./observation/observable.js";
export { Updates, type UpdateQueue } from "./observation/update-queue.js";

// Binding
export { Binding, type BindingDirective } from "./binding/binding.js";
export { normalizeBinding } from "./binding/normalize.js";
export { oneTime } from "./binding/one-time.js";
export { listener, oneWay } from "./binding/one-way.js";

// Styles
export { CSSBindingDirective } from "./styles/css-binding-directive.js";
export {
    cssDirective,
    CSSDirective,
    type AddBehavior,
    type CSSDirectiveDefinition,
} from "./styles/css-directive.js";
export { css, type CSSTemplateTag, type CSSValue } from "./styles/css.js";
export {
    ElementStyles,
    type ComposableStyles,
    type ConstructibleStyleStrategy,
} from "./styles/element-styles.js";
export { type HostBehavior } from "./styles/host.js";
export type { HostController } from "./styles/host.js";
export type { StyleStrategy, StyleTarget } from "./styles/style-strategy.js";

// Templating
export { children, ChildrenDirective } from "./templating/children.js";
export type {
    ChildListDirectiveOptions,
    ChildrenDirectiveOptions,
    SubtreeDirectiveOptions,
} from "./templating/children.js";
export { Compiler } from "./templating/compiler.js";
export type { CompilationStrategy } from "./templating/compiler.js";
export { HTMLBindingDirective } from "./templating/html-binding-directive.js";
export type {
    ContentTemplate,
    ContentView,
} from "./templating/html-binding-directive.js";
export {
    htmlDirective,
    HTMLDirective,
    StatelessAttachedAttributeDirective,
} from "./templating/html-directive.js";
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
export { Markup, Parser } from "./templating/markup.js";
export { elements, NodeObservationDirective } from "./templating/node-observation.js";
export type {
    ElementsFilter,
    NodeBehaviorOptions,
} from "./templating/node-observation.js";
export { ref, RefDirective } from "./templating/ref.js";
export { render, RenderBehavior, RenderDirective } from "./templating/render.js";
export { repeat, RepeatBehavior, RepeatDirective } from "./templating/repeat.js";
export type { RepeatOptions } from "./templating/repeat.js";
export { slotted, SlottedDirective } from "./templating/slotted.js";
export type { SlottedDirectiveOptions } from "./templating/slotted.js";
export { html, InlineTemplateDirective, ViewTemplate } from "./templating/template.js";
export type {
    CaptureType,
    ElementViewTemplate,
    HTMLTemplateCompilationResult,
    HTMLTemplateTag,
    SyntheticViewTemplate,
    TemplateValue,
} from "./templating/template.js";
export { HTMLView, HydrationBindingError } from "./templating/view.js";
export type {
    ElementView,
    HydratableView,
    SyntheticView,
    View,
} from "./templating/view.js";
export { when } from "./templating/when.js";

// Components
export {
    attr,
    AttributeConfiguration,
    AttributeDefinition,
    booleanConverter,
    nullableBooleanConverter,
    nullableNumberConverter,
} from "./components/attributes.js";
export type {
    AttributeMode,
    DecoratorAttributeConfiguration,
    ValueConverter,
} from "./components/attributes.js";
export {
    ElementController,
    HydratableElementController,
    needsHydrationAttribute,
    Stages,
    type HydrationControllerCallbacks,
} from "./components/element-controller.js";
export type { ElementControllerStrategy } from "./components/element-controller.js";
export {
    FASTElementDefinition,
    fastElementRegistry,
    TemplateOptions,
    type TemplateLifecycleCallbacks,
} from "./components/fast-definitions.js";
export type {
    PartialFASTElementDefinition,
    ShadowRootOptions,
    TypeRegistry,
} from "./components/fast-definitions.js";
export { customElement, FASTElement } from "./components/fast-element.js";
export { deferHydrationAttribute, isHydratable } from "./components/hydration.js";
