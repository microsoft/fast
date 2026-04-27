// Kernel

// Components
export {
    AttributeConfiguration,
    AttributeDefinition,
    type AttributeMode,
    attr,
    booleanConverter,
    type DecoratorAttributeConfiguration,
    nullableBooleanConverter,
    nullableNumberConverter,
    type ValueConverter,
} from "./attr.js";
// Binding
export { Binding, type BindingDirective } from "./binding/binding.js";
export { normalizeBinding } from "./binding/normalize.js";
export { oneTime } from "./binding/one-time.js";
export { listener, oneWay } from "./binding/one-way.js";
export { Signal, signal } from "./binding/signal.js";
export {
    type TwoWayBindingOptions,
    TwoWaySettings,
    twoWay,
} from "./binding/two-way.js";
export type { ElementControllerStrategy } from "./components/element-controller.js";
export {
    ElementController,
    Stages,
} from "./components/element-controller.js";
// Hydration
export {
    deferHydrationAttribute,
    enableHydration,
    type HydrationOptions,
} from "./components/enable-hydration.js";
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
export { HydrationMarkup, isHydratable } from "./components/hydration.js";
export { HydrationTracker } from "./components/hydration-tracker.js";
export * from "./context.js";
export { enableDebug } from "./debug.js";
// Declarative
export {
    AttributeMap,
    type AttributeMapConfig,
    attributeMap,
} from "./declarative/attribute-map.js";
export {
    ObserverMap,
    type ObserverMapConfig,
    type ObserverMapPathEntry,
    type ObserverMapPathNode,
    observerMap,
} from "./declarative/observer-map.js";
export { declarativeTemplate } from "./declarative/template.js";
export {
    type ResolvedStringsAndValues,
    TemplateParser,
} from "./declarative/template-parser.js";
export {
    type AttributeDataBindingBehaviorConfig,
    type AttributeDirective,
    type AttributeDirectiveBindingBehaviorConfig,
    assignObservables,
    assignProxy,
    type BaseDataBindingBehaviorConfig,
    type BehaviorConfig,
    type BehaviorType,
    bindingResolver,
    type ChainedExpression,
    ComparisonOperator,
    type ContentDataBindingBehaviorConfig,
    contextPrefixDot,
    type DataBindingBehaviorConfig,
    type DataBindingBindingType,
    type DeclarativeExpression,
    deepEqual,
    deepMerge,
    type EventArgType,
    eventArgAccessor,
    executionContextAccessor,
    expressionResolver,
    extractPathsFromChainedExpression,
    findDef,
    getBooleanBinding,
    getChildrenMap,
    getExpressionChain,
    getIndexOfNextMatchingTag,
    getNextBehavior,
    getRootPropertyName,
    isPlainObject,
    LogicalOperator,
    Operator,
    type ParsedEventArg,
    type PathType,
    parseEventArgs,
    pathResolver,
    type TemplateDirective,
    type TemplateDirectiveBehaviorConfig,
    transformInnerHTML,
} from "./declarative/utilities.js";
export * from "./di/di.js";
// Directives
export {
    type ChildListDirectiveOptions,
    ChildrenDirective,
    type ChildrenDirectiveOptions,
    children,
    type SubtreeDirectiveOptions,
} from "./directives/children.js";
export {
    type ElementsFilter,
    elements,
    type NodeBehaviorOptions,
    NodeObservationDirective,
} from "./directives/node-observation.js";
export { RefDirective, ref } from "./directives/ref.js";
export {
    RepeatBehavior,
    RepeatDirective,
    type RepeatOptions,
    repeat,
} from "./directives/repeat.js";
export {
    SlottedDirective,
    type SlottedDirectiveOptions,
    slotted,
} from "./directives/slotted.js";
export { when } from "./directives/when.js";
export * from "./dom.js";
export {
    type DOMAspectGuards,
    type DOMElementGuards,
    type DOMGuards,
    DOMPolicy,
    type DOMPolicyOptions,
    type DOMSinkGuards,
} from "./dom-policy.js";
export type {
    Callable,
    Class,
    Constructable,
    Disposable,
    TrustedTypesPolicy,
} from "./interfaces.js";
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
export {
    ExecutionContext,
    Observable,
    observable,
    SourceLifetime,
    volatile,
} from "./observation/observable.js";
export { type UpdateQueue, Updates } from "./observation/update-queue.js";
export { emptyArray, FAST } from "./platform.js";
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
} from "./schema.js";
export * from "./state/exports.js";
// Styles
export { type CSSTemplateTag, type CSSValue, css } from "./styles/css.js";
export {
    CSSDirective,
    type CSSDirectiveDefinition,
    cssDirective,
} from "./styles/css-directive.js";
export type {
    ComposableStyles,
    ConstructibleStyleStrategy,
} from "./styles/element-styles.js";
export { ElementStyles } from "./styles/element-styles.js";
export type { HostBehavior, HostController } from "./styles/host.js";
export type { StyleStrategy, StyleTarget } from "./styles/style-strategy.js";
// Templating
export { type CompilationStrategy, Compiler } from "./templating/compiler.js";
export {
    type ContentTemplate,
    type ContentView,
    HTMLBindingDirective,
} from "./templating/html-binding-directive.js";
export {
    type AddViewBehaviorFactory,
    type Aspected,
    type CompiledViewBehaviorFactory,
    HTMLDirective,
    type HTMLDirectiveDefinition,
    htmlDirective,
    type PartialHTMLDirectiveDefinition,
    StatelessAttachedAttributeDirective,
    type ViewBehavior,
    type ViewBehaviorFactory,
    type ViewBehaviorTargets,
    type ViewController,
} from "./templating/html-directive.js";
export type { HydratableView } from "./templating/hydration-view.js";
export { HydrationBindingError } from "./templating/hydration-view.js";
export { Markup, Parser } from "./templating/markup.js";
export { RenderBehavior, RenderDirective, render } from "./templating/render.js";
export {
    type CaptureType,
    type ElementViewTemplate,
    type HTMLTemplateCompilationResult,
    type HTMLTemplateTag,
    html,
    InlineTemplateDirective,
    type SyntheticViewTemplate,
    type TemplateValue,
    ViewTemplate,
} from "./templating/template.js";
export {
    type ElementView,
    HTMLView,
    type SyntheticView,
    type View,
} from "./templating/view.js";
export * from "./utilities.js";
