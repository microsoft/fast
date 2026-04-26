// Kernel

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
    booleanConverter,
    nullableBooleanConverter,
    nullableNumberConverter,
} from "./components/attributes.js";
export type { ElementControllerStrategy } from "./components/element-controller.js";
export {
    ElementController,
    Stages,
} from "./components/element-controller.js";
export { enableHydration } from "./components/enable-hydration.js";
export type {
    FASTElementExtension,
    FASTElementTemplateResolver,
    PartialFASTElementDefinition,
    ShadowRootOptions,
    TypeRegistry,
} from "./components/fast-definitions.js";
export {
    FASTElementDefinition,
    fastElementRegistry,
    type TemplateLifecycleCallbacks,
} from "./components/fast-definitions.js";
export { customElement, FASTElement } from "./components/fast-element.js";
export { isHydratable } from "./components/hydration.js";
export {
    type HydrationOptions,
    HydrationTracker,
} from "./components/hydration-tracker.js";
export {
    type AccessCachedPath,
    type CachedPath,
    type CachedPathCommon,
    type CachedPathMap,
    type ChildrenMap,
    type DefaultCachedPath,
    type EventCachedPath,
    type JSONSchema,
    type JSONSchemaCommon,
    type JSONSchemaDefinition,
    type RegisterPathConfig,
    type RepeatCachedPath,
    Schema,
    schemaRegistry,
} from "./components/schema.js";
// DOM
export { DOM, DOMAspect, type DOMPolicy, type DOMSink } from "./dom.js";
export type {
    Callable,
    Class,
    Constructable,
    Disposable,
    TrustedTypesPolicy,
} from "./interfaces.js";
export type { Sort, Splice } from "./observation/arrays.js";
// Observation
export {
    type Notifier,
    PropertyChangeNotifier,
    type Subscriber,
    SubscriberSet,
} from "./observation/notifier.js";
export type {
    Accessor,
    Expression,
    ExpressionController,
    ExpressionNotifier,
    ExpressionObserver,
    ObservationRecord,
} from "./observation/observable.js";
export { ExecutionContext, SourceLifetime } from "./observation/observable.js";
export { emptyArray, FAST } from "./platform.js";
// Type-only re-exports for types referenced by root public signatures
export type {
    ComposableStyles,
    ConstructibleStyleStrategy,
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
export { ChildrenDirective } from "./templating/children.js";
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
export type { HydratableView } from "./templating/hydration-view.js";
export { HydrationBindingError } from "./templating/hydration-view.js";
export { Markup, Parser } from "./templating/markup.js";
export type {
    ElementsFilter,
    NodeBehaviorOptions,
} from "./templating/node-observation.js";
export { elements, NodeObservationDirective } from "./templating/node-observation.js";
export { RefDirective } from "./templating/ref.js";
export { RenderBehavior, RenderDirective, render } from "./templating/render.js";
export type { RepeatOptions } from "./templating/repeat.js";
export { RepeatBehavior, RepeatDirective } from "./templating/repeat.js";
export type { SlottedDirectiveOptions } from "./templating/slotted.js";
export { SlottedDirective } from "./templating/slotted.js";
export type {
    CaptureType,
    ElementViewTemplate,
    HTMLTemplateCompilationResult,
    HTMLTemplateTag,
    SyntheticViewTemplate,
    TemplateValue,
} from "./templating/template.js";
export { InlineTemplateDirective, ViewTemplate } from "./templating/template.js";
export type {
    ElementView,
    SyntheticView,
    View,
} from "./templating/view.js";
export { HTMLView } from "./templating/view.js";
