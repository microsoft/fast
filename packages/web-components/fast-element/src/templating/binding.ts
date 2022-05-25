import { isString, Message } from "../interfaces.js";
import {
    Binding,
    BindingObserver,
    ExecutionContext,
    Observable,
    ObservationRecord,
} from "../observation/observable.js";
import { FAST } from "../platform.js";
import { DOM } from "./dom.js";
import {
    AddViewBehaviorFactory,
    Aspect,
    Aspected,
    HTMLDirective,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
} from "./html-directive.js";
import { Markup } from "./markup.js";
import type { CaptureType } from "./template.js";
import type { SyntheticView } from "./view.js";

declare class TrustedHTML {}
const createInnerHTMLBinding = globalThis.TrustedHTML
    ? (binding: Binding) => (s, c) => {
          const value = binding(s, c);

          if (value instanceof TrustedHTML) {
              return value;
          }

          throw FAST.error(Message.bindingInnerHTMLRequiresTrustedTypes);
      }
    : (binding: Binding) => binding;

/**
 * Describes how aspects of an HTML element will be affected by bindings.
 * @public
 */
export type BindingMode = Record<
    Aspect,
    (directive: HTMLBindingDirective) => Pick<ViewBehaviorFactory, "createBehavior">
>;

/**
 * Describes how aspects of an HTML element will be affected by bindings.
 * @public
 */
export const BindingMode = Object.freeze({
    /**
     * Creates a binding mode based on the supplied behavior types.
     * @param UpdateType - The base behavior type used to update aspects.
     * @param EventType - The base behavior type used to respond to events.
     * @returns A new binding mode.
     */
    define(
        UpdateType: typeof UpdateBinding,
        EventType: typeof EventBinding = EventBinding
    ): BindingMode {
        return Object.freeze({
            [1]: d => new UpdateType(d, DOM.setAttribute),
            [2]: d => new UpdateType(d, DOM.setBooleanAttribute),
            [3]: d => new UpdateType(d, (t, a, v) => (t[a] = v)),
            [4]: d => new (createContentBinding(UpdateType))(d, updateContentTarget),
            [5]: d => new UpdateType(d, updateTokenListTarget),
            [6]: d => new EventType(d),
        });
    },
});

/**
 * Describes the configuration for a binding expression.
 * @public
 */
export interface BindingConfig<T = any> {
    /**
     * The binding mode to configure the binding with.
     */
    mode: BindingMode;

    /**
     * Options to be supplied to the binding behaviors.
     */
    options: T;
}

/**
 * Creates a new binding configuration based on the supplied options.
 * @public
 */
export type BindingConfigResolver<T> = (options: T) => BindingConfig<T>;

/**
 * Describes the configuration for a binding expression.
 * @public
 */
export const BindingConfig = Object.freeze({
    /**
     * Creates a binding configuration based on the provided mode and options.
     * @param mode - The mode to use for the configuration.
     * @param defaultOptions - The default options to use for the configuration.
     * @returns A new binding configuration.
     */
    define<T>(
        mode: BindingMode,
        defaultOptions: T
    ): BindingConfig<T> & BindingConfigResolver<T> {
        const config: BindingConfig<T> & BindingConfigResolver<T> = (
            options: T
        ): BindingConfig<T> => {
            return {
                mode: config.mode,
                options: Object.assign({}, defaultOptions, options),
            };
        };

        config.options = defaultOptions;
        config.mode = mode;

        return config;
    },
});

/**
 * The "this" context for an update target function.
 * @public
 */
export interface UpdateTargetThis {
    /**
     * The directive configuration for the update.
     */
    directive: HTMLBindingDirective;
}

/**
 * A target update function.
 * @param this - The "this" context for the update.
 * @param target - The node that is targeted by the update.
 * @param aspect - The aspect of the node that is being targeted.
 * @param value - The value to assign to the aspect.
 * @param source - The source object that the value was derived from.
 * @param context - The execution context that the binding is being run under.
 * @public
 */
export type UpdateTarget = (
    this: UpdateTargetThis,
    target: Node,
    aspect: string,
    value: any,
    source: any,
    context: ExecutionContext
) => void;

/**
 * A base binding behavior for DOM updates.
 * @public
 */
export class UpdateBinding implements ViewBehavior {
    /**
     * Creates an instance of UpdateBinding.
     * @param directive - The directive that has the configuration for this behavior.
     * @param updateTarget - The function used to update the target with the latest value.
     */
    constructor(
        public readonly directive: HTMLBindingDirective,
        protected updateTarget: UpdateTarget
    ) {}

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {}

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {}

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
        return this;
    }
}

function createContentBinding(Type: typeof UpdateBinding): typeof UpdateBinding {
    return class extends Type {
        unbind(
            source: any,
            context: ExecutionContext,
            targets: ViewBehaviorTargets
        ): void {
            super.unbind(source, context, targets);

            const target = targets[this.directive.nodeId] as ContentTarget;
            const view = target.$fastView as ComposableView;

            if (view !== void 0 && view.isComposed) {
                view.unbind();
                view.needsBindOnly = true;
            }
        }
    };
}

type ComposableView = SyntheticView & {
    isComposed?: boolean;
    needsBindOnly?: boolean;
};

type ContentTarget = Node & {
    $fastView?: ComposableView;
    $fastTemplate?: { create(): SyntheticView };
};

function updateContentTarget(
    target: ContentTarget,
    aspect: string,
    value: any,
    source: any,
    context: ExecutionContext
): void {
    // If there's no actual value, then this equates to the
    // empty string for the purposes of content bindings.
    if (value === null || value === undefined) {
        value = "";
    }

    // If the value has a "create" method, then it's a template-like.
    if (value.create) {
        target.textContent = "";
        let view = target.$fastView as ComposableView;

        // If there's no previous view that we might be able to
        // reuse then create a new view from the template.
        if (view === void 0) {
            view = value.create() as SyntheticView;
        } else {
            // If there is a previous view, but it wasn't created
            // from the same template as the new value, then we
            // need to remove the old view if it's still in the DOM
            // and create a new view from the template.
            if (target.$fastTemplate !== value) {
                if (view.isComposed) {
                    view.remove();
                    view.unbind();
                }

                view = value.create() as SyntheticView;
            }
        }

        // It's possible that the value is the same as the previous template
        // and that there's actually no need to compose it.
        if (!view.isComposed) {
            view.isComposed = true;
            view.bind(source, context!);
            view.insertBefore(target);
            target.$fastView = view;
            target.$fastTemplate = value;
        } else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(source, context!);
        }
    } else {
        const view = target.$fastView as ComposableView;

        // If there is a view and it's currently composed into
        // the DOM, then we need to remove it.
        if (view !== void 0 && view.isComposed) {
            view.isComposed = false;
            view.remove();

            if (view.needsBindOnly) {
                view.needsBindOnly = false;
            } else {
                view.unbind();
            }
        }

        target.textContent = value;
    }
}

interface TokenListState {
    v: {};
    c: number;
}

function updateTokenListTarget(
    this: UpdateTargetThis,
    target: Element,
    aspect: string,
    value: any
): void {
    const directive = this.directive;
    const lookup = `${directive.id}-t`;
    const state: TokenListState =
        target[lookup] ?? (target[lookup] = { c: 0, v: Object.create(null) });
    const versions = state.v;
    let currentVersion = state.c;
    const tokenList = target[aspect] as DOMTokenList;

    // Add the classes, tracking the version at which they were added.
    if (value !== null && value !== undefined && value.length) {
        const names = value.split(/\s+/);

        for (let i = 0, ii = names.length; i < ii; ++i) {
            const currentName = names[i];

            if (currentName === "") {
                continue;
            }

            versions[currentName] = currentVersion;
            tokenList.add(currentName);
        }
    }

    state.v = currentVersion + 1;

    // If this is the first call to add classes, there's no need to remove old ones.
    if (currentVersion === 0) {
        return;
    }

    // Remove classes from the previous version.
    currentVersion -= 1;

    for (const name in versions) {
        if (versions[name] === currentVersion) {
            tokenList.remove(name);
        }
    }
}

/**
 * A binding behavior for one-time bindings.
 * @public
 */
export class OneTimeBinding extends UpdateBinding {
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        this.updateTarget(
            targets[directive.nodeId],
            directive.targetAspect,
            directive.binding(source, context),
            source,
            context
        );
    }
}

const signals: Record<string, undefined | Function | Function[]> = Object.create(null);

/**
 * A binding behavior for signal bindings.
 * @public
 */
export class SignalBinding extends UpdateBinding {
    private handlerProperty = `${this.directive.id}-h`;

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId];
        const signal = this.getSignal(source, context);
        const handler = (target[this.handlerProperty] = () => {
            this.updateTarget(
                target,
                directive.targetAspect!,
                directive.binding(source, context),
                source,
                context
            );
        });

        handler();

        const found = signals[signal];

        if (found) {
            Array.isArray(found)
                ? found.push(handler)
                : (signals[signal] = [found, handler]);
        } else {
            signals[signal] = handler;
        }
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const signal = this.getSignal(source, context);
        const found = signals[signal];

        if (found && Array.isArray(found)) {
            const directive = this.directive;
            const target = targets[directive.nodeId];
            const handler = target[this.handlerProperty];
            const index = found.indexOf(handler);
            if (index !== -1) {
                found.splice(index, 1);
            }
        } else {
            signals[signal] = void 0;
        }
    }

    private getSignal(source: any, context: ExecutionContext): string {
        const options = this.directive.options;
        return isString(options) ? options : options(source, context);
    }

    /**
     * Sends the specified signal to signaled bindings.
     * @param signal - The signal to send.
     * @public
     */
    public static send(signal: string): void {
        const found = signals[signal];
        if (found) {
            Array.isArray(found) ? found.forEach(x => x()) : found();
        }
    }
}

/**
 * A binding behavior for bindings that change.
 * @public
 */
export class ChangeBinding extends UpdateBinding {
    private isBindingVolatile: boolean;
    private observerProperty: string;

    /**
     * Creates an instance of ChangeBinding.
     * @param directive - The directive that has the configuration for this behavior.
     * @param updateTarget - The function used to update the target with the latest value.
     */
    constructor(directive: HTMLBindingDirective, updateTarget: UpdateTarget) {
        super(directive, updateTarget);
        this.isBindingVolatile = Observable.isVolatileBinding(directive.binding);
        this.observerProperty = `${directive.id}-o`;
    }

    /**
     * Returns the binding observer used to update the node.
     * @param target - The target node.
     * @returns A BindingObserver.
     */
    protected getObserver(target: Node): BindingObserver {
        return (
            target[this.observerProperty] ??
            (target[this.observerProperty] = Observable.binding(
                this.directive.binding,
                this,
                this.isBindingVolatile
            ))
        );
    }

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId];
        const observer = this.getObserver(target);

        (observer as any).target = target;
        (observer as any).source = source;
        (observer as any).context = context;

        this.updateTarget(
            target,
            directive.targetAspect,
            observer.observe(source, context),
            source,
            context
        );
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.nodeId];
        const observer = this.getObserver(target);
        observer.dispose();
        (observer as any).target = null;
        (observer as any).source = null;
        (observer as any).context = null;
    }

    /** @internal */
    public handleChange(binding: Binding, observer: BindingObserver): void {
        const target = (observer as any).target;
        const source = (observer as any).source;
        const context = (observer as any).context;
        this.updateTarget(
            target,
            this.directive.targetAspect,
            observer.observe(source, context!),
            source,
            context
        );
    }
}

/**
 * A binding behavior for handling events.
 * @public
 */
export class EventBinding {
    private contextProperty: string;
    private sourceProperty: string;

    /**
     * Creates an instance of EventBinding.
     * @param directive - The directive that has the configuration for this behavior.
     */
    constructor(public readonly directive: HTMLBindingDirective) {
        this.sourceProperty = `${directive.id}-s`;
        this.contextProperty = `${directive.id}-c`;
    }

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId];
        target[this.sourceProperty] = source;
        target[this.contextProperty] = context;
        target.addEventListener(directive.targetAspect, this, directive.options);
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId];
        target[this.sourceProperty] = target[this.contextProperty] = null;
        target.removeEventListener(directive.targetAspect, this, directive.options);
    }

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
        return this;
    }

    /**
     * @internal
     */
    handleEvent(event: Event): void {
        const target = event.currentTarget!;

        ExecutionContext.setEvent(event);
        const result = this.directive.binding(
            target[this.sourceProperty],
            target[this.contextProperty]
        );
        ExecutionContext.setEvent(null);

        if (result !== true) {
            event.preventDefault();
        }
    }
}

/**
 * The settings required to enable two-way binding.
 * @public
 */
export interface TwoWaySettings {
    /**
     * Determines which event to listen to, to detect changes in the view.
     * @param directive - The directive to determine the change event for.
     * @param target - The target element to determine the change event for.
     */
    determineChangeEvent(directive: HTMLBindingDirective, target: HTMLElement): string;
}

let twoWaySettings: TwoWaySettings = {
    determineChangeEvent() {
        return "change";
    },
};

/**
 * A binding behavior for bindings that update in two directions.
 * @public
 */
export class TwoWayBinding extends ChangeBinding {
    private changeEvent: string;

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        super.bind(source, context, targets);

        const directive = this.directive;
        const target = targets[directive.nodeId] as HTMLElement;

        if (!this.changeEvent) {
            this.changeEvent =
                directive.options.changeEvent ??
                twoWaySettings.determineChangeEvent(directive, target);
        }

        target.addEventListener(this.changeEvent, this);
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        super.unbind(source, context, targets);
        (targets[this.directive.nodeId] as HTMLElement).removeEventListener(
            this.changeEvent,
            this
        );
    }

    /** @internal */
    public handleEvent(event: Event): void {
        const directive = this.directive;
        const target = event.currentTarget as HTMLElement;

        let value;

        switch (directive.aspectType) {
            case 1:
                value = target.getAttribute(directive.targetAspect);
                break;
            case 2:
                value = target.hasAttribute(directive.targetAspect);
                break;
            case 4:
                value = target.innerText;
                break;
            default:
                value = target[directive.targetAspect];
                break;
        }

        const observer = this.getObserver(target);
        const last = (observer as any).last as ObservationRecord; // using internal API!!!
        last.propertySource[last.propertyName] = directive.options.fromView(value);
    }

    /**
     * Configures two-way binding.
     * @param settings - The settings to use for the two-way binding system.
     */
    public static configure(settings: TwoWaySettings) {
        twoWaySettings = settings;
    }
}

/**
 * The default binding options.
 * @public
 */
export type DefaultBindingOptions = AddEventListenerOptions;

/**
 * The default onChange binding configuration.
 * @public
 */
export const onChange = BindingConfig.define(
    BindingMode.define(ChangeBinding),
    {} as DefaultBindingOptions
);

/**
 * The default twoWay binding options.
 * @public
 */
export type DefaultTwoWayBindingOptions = DefaultBindingOptions & {
    changeEvent?: string;
    fromView?: (value: any) => any;
};

/**
 * The default twoWay binding configuration.
 * @public
 */
export const twoWay = BindingConfig.define(BindingMode.define(TwoWayBinding), {
    fromView: v => v,
} as DefaultTwoWayBindingOptions);

/**
 * The default onTime binding configuration.
 * @public
 */
export const oneTime = BindingConfig.define(BindingMode.define(OneTimeBinding), {
    once: true,
} as DefaultBindingOptions);

const signalMode: BindingMode = BindingMode.define(SignalBinding);

/**
 * Creates a signal binding configuration with the supplied options.
 * @param options - The signal name or a binding to use to retrieve the signal name.
 * @returns A binding configuration.
 * @public
 */
export const signal = <T = any>(
    options: string | Binding<T>
): BindingConfig<string | Binding<T>> => {
    return { mode: signalMode, options };
};

/**
 * A directive that applies bindings.
 * @public
 */
export class HTMLBindingDirective
    implements HTMLDirective, ViewBehaviorFactory, Aspected {
    private factory: Pick<ViewBehaviorFactory, "createBehavior"> | null = null;

    /**
     * The unique id of the factory.
     */
    id: string;

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    nodeId: string;

    /**
     * The original source aspect exactly as represented in markup.
     */
    sourceAspect: string;

    /**
     * The evaluated target aspect, determined after processing the source.
     */
    targetAspect: string;

    /**
     * The type of aspect to target.
     */
    aspectType: Aspect = Aspect.content;

    /**
     * Creates an instance of HTMLBindingDirective.
     * @param binding - The binding to apply.
     * @param mode - The binding mode to use when applying the binding.
     * @param options - The options to configure the binding with.
     */
    constructor(public binding: Binding, public mode: BindingMode, public options: any) {}

    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    createHTML(add: AddViewBehaviorFactory): string {
        return Markup.interpolation(add(this));
    }

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
        if (this.factory == null) {
            if (this.targetAspect === "innerHTML") {
                this.binding = createInnerHTMLBinding(this.binding);
            }

            this.factory = this.mode[this.aspectType](this);
        }

        return this.factory.createBehavior(targets);
    }
}

HTMLDirective.define(HTMLBindingDirective, { aspected: true });

/**
 * Creates a binding directive with the specified configuration.
 * @param binding - The binding expression.
 * @param config - The binding configuration.
 * @returns A binding directive.
 * @public
 */
export function bind<T = any>(
    binding: Binding<T>,
    config: BindingConfig | DefaultBindingOptions = onChange
): CaptureType<T> {
    if (!("mode" in config)) {
        config = onChange(config);
    }

    return new HTMLBindingDirective(binding, config.mode, config.options);
}
