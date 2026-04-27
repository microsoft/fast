// Kernel

// Components
export type { ElementControllerStrategy } from "./components/element-controller.js";
export {
    ElementController,
    Stages,
} from "./components/element-controller.js";
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
