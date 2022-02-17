import { DOM } from "../dom.js";
import { isString, Mutable } from "../interfaces.js";
import {
    Binding,
    BindingObserver,
    ExecutionContext,
    Observable,
    setCurrentEvent,
} from "../observation/observable.js";
import {
    InlinableHTMLDirective,
    ViewBehavior,
    ViewBehaviorTargets,
} from "./html-directive.js";
import type { CaptureType } from "./template.js";
import type { SyntheticView } from "./view.js";

export type BindingBehaviorFactory = {
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior;
};

export type BindingType = (directive: HTMLBindingDirective) => BindingBehaviorFactory;
export const notSupportedBindingType: BindingType = () => {
    throw new Error();
};

export interface BindingMode {
    attribute: BindingType;
    booleanAttribute: BindingType;
    property: BindingType;
    content: BindingType;
    tokenList: BindingType;
    event: BindingType;
}

export interface BindingConfig {
    mode: BindingMode;
    options: any;
}

interface UpdateTargetThis {
    directive: HTMLBindingDirective;
}

type UpdateTarget = (
    this: UpdateTargetThis,
    target,
    aspect: string,
    value,
    source: any,
    context: ExecutionContext
) => void;

class BindingBase {
    constructor(public readonly directive: HTMLBindingDirective) {}

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {}
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {}

    createBehavior(): ViewBehavior {
        return this;
    }
}

function createContentBinding(
    BaseType: typeof TargetUpdateBinding
): typeof TargetUpdateBinding {
    return class extends BaseType {
        unbind(
            source: any,
            context: ExecutionContext,
            targets: ViewBehaviorTargets
        ): void {
            super.unbind(source, context, targets);

            const target = targets[this.directive.targetId] as ContentTarget;
            const view = target.$fastView as ComposableView;

            if (view !== void 0 && view.isComposed) {
                view.unbind();
                view.needsBindOnly = true;
            }
        }
    };
}

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
    const state: TokenListState =
        target[directive.uniqueId] ??
        (target[directive.uniqueId] = { c: 0, v: Object.create(null) });
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

class TargetUpdateBinding extends BindingBase {
    constructor(directive: HTMLBindingDirective, protected updateTarget: UpdateTarget) {
        super(directive);
    }

    static createBindingConfig<T>(
        defaultOptions: T,
        eventType?: BindingType
    ): BindingConfig {
        const config: BindingConfig &
            ((options?: typeof defaultOptions) => BindingConfig) = (
            options: typeof defaultOptions
        ): BindingConfig => {
            return {
                mode: config.mode,
                options: Object.assign({}, defaultOptions, options),
            };
        };

        config.options = defaultOptions;
        config.mode = this.createBindingMode(eventType);

        return config;
    }

    static createBindingMode(
        eventType: BindingType = notSupportedBindingType
    ): BindingMode {
        return Object.freeze({
            attribute: this.createType(DOM.setAttribute),
            booleanAttribute: this.createType(DOM.setBooleanAttribute),
            property: this.createType(
                (target, aspect, value) => (target[aspect] = value)
            ),
            content: createContentBinding(this).createType(updateContentTarget),
            tokenList: this.createType(updateTokenListTarget),
            event: eventType,
        });
    }

    private static createType(updateTarget: UpdateTarget) {
        return directive => new this(directive, updateTarget);
    }
}

class OneTimeBinding extends TargetUpdateBinding {
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.targetId];
        this.updateTarget(
            target,
            directive.aspect!,
            directive.binding(source, context),
            source,
            context
        );
    }
}

const signals: Record<string, undefined | Function | Function[]> = Object.create(null);

export function sendSignal(signal: string): void {
    const found = signals[signal];
    if (found) {
        Array.isArray(found) ? found.forEach(x => x()) : found();
    }
}

class OnSignalBinding extends TargetUpdateBinding {
    bind(
        source: any,
        context: ExecutionContext<any, any>,
        targets: ViewBehaviorTargets
    ): void {
        const directive = this.directive;
        const target = targets[directive.targetId];
        const signal = this.getSignal(source, context);
        const handler = (target[directive.uniqueId] = () => {
            this.updateTarget(
                target,
                directive.aspect!,
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

    unbind(
        source: any,
        context: ExecutionContext<any, any>,
        targets: ViewBehaviorTargets
    ): void {
        const signal = this.getSignal(source, context);
        const found = signals[signal];

        if (found && Array.isArray(found)) {
            const directive = this.directive;
            const target = targets[directive.targetId];
            const handler = target[directive.uniqueId];
            const index = found.indexOf(handler);
            if (index !== -1) {
                found.splice(index, 1);
            }
        } else {
            signals[signal] = void 0;
        }
    }

    private getSignal(source: any, context: ExecutionContext<any, any>): string {
        const options = this.directive.options;
        return isString(options) ? options : options(source, context);
    }
}

class OnChangeBinding extends TargetUpdateBinding {
    private isBindingVolatile: boolean;

    constructor(directive: HTMLBindingDirective, updateTarget: UpdateTarget) {
        super(directive, updateTarget);
        this.isBindingVolatile = Observable.isVolatileBinding(directive.binding);
    }

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.targetId];
        const observer: BindingObserver =
            target[directive.uniqueId] ??
            (target[directive.uniqueId] = Observable.binding(
                directive.binding,
                this,
                this.isBindingVolatile
            ));

        (observer as any).target = target;
        (observer as any).source = source;
        (observer as any).context = context;

        this.updateTarget(
            target,
            directive.aspect!,
            observer.observe(source, context),
            source,
            context
        );
    }

    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.targetId];
        const observer = target[this.directive.uniqueId];
        observer.disconnect();
        observer.target = null;
        observer.source = null;
        observer.context = null;
    }

    /** @internal */
    public handleChange(binding: Binding, observer: BindingObserver): void {
        const target = (observer as any).target;
        const source = (observer as any).source;
        const context = (observer as any).context;
        this.updateTarget(
            target,
            this.directive.aspect!,
            observer.observe(source, context!),
            source,
            context
        );
    }
}

type ComposableView = SyntheticView & {
    isComposed?: boolean;
    needsBindOnly?: boolean;
};

type ContentTarget = Node & {
    $fastView?: ComposableView;
    $fastTemplate?: { create(): SyntheticView };
};

type FASTEventSource = Node & {
    $fastSource: any;
    $fastContext: ExecutionContext | null;
};

class EventListener extends BindingBase {
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.targetId] as FASTEventSource;
        target.$fastSource = source;
        target.$fastContext = context;
        target.addEventListener(directive.aspect!, this, directive.options);
    }

    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        this.removeEventListener(targets[this.directive.targetId] as FASTEventSource);
    }

    protected removeEventListener(target: FASTEventSource): void {
        target.$fastSource = null;
        target.$fastContext = null;
        target.removeEventListener(this.directive.aspect!, this, this.directive.options);
    }

    handleEvent(event: Event): void {
        const target = event.currentTarget as any;
        const source = target.$fastSource;
        const context = target.$fastContext;

        setCurrentEvent(event);
        const result = this.directive.binding(source, context);
        setCurrentEvent(null);

        if (result !== true) {
            event.preventDefault();
        }
    }
}

class OneTimeEventListener extends EventListener {
    handleEvent(event: Event): void {
        super.handleEvent(event);
        this.removeEventListener(event.currentTarget as FASTEventSource);
    }
}

export type DefaultBindingOptions = {
    capture?: boolean;
};

const defaultBindingOptions: DefaultBindingOptions = {
    capture: false,
};

export const onChange = OnChangeBinding.createBindingConfig(
    defaultBindingOptions,
    directive => new EventListener(directive)
);

export const oneTime = OneTimeBinding.createBindingConfig(
    defaultBindingOptions,
    directive => new OneTimeEventListener(directive)
);

const signalMode: BindingMode = OnSignalBinding.createBindingMode();

export const signal = <T = any>(options: string | Binding<T>): BindingConfig => {
    return { mode: signalMode, options };
};

/**
 * @internal
 */
export class HTMLBindingDirective extends InlinableHTMLDirective {
    private factory!: BindingBehaviorFactory;

    public readonly rawAspect?: string;
    public readonly aspect?: string;

    public constructor(
        public binding: Binding,
        public mode: BindingMode,
        public options: any
    ) {
        super();
    }

    public setAspect(value: string): void {
        (this as Mutable<this>).rawAspect = value;

        if (!value) {
            return;
        }

        switch (value[0]) {
            case ":":
                (this as Mutable<this>).aspect = value.substr(1);
                switch (this.aspect) {
                    case "innerHTML":
                        const binding = this.binding;
                        /* eslint-disable-next-line */
                        this.binding = (s, c) => DOM.createHTML(binding(s, c));
                        this.factory = this.mode.property(this);
                        break;
                    case "classList":
                        this.factory = this.mode.tokenList(this);
                        break;
                    default:
                        this.factory = this.mode.property(this);
                        break;
                }
                break;
            case "?":
                (this as Mutable<this>).aspect = value.substr(1);
                this.factory = this.mode.booleanAttribute(this);
                break;
            case "@":
                (this as Mutable<this>).aspect = value.substr(1);
                this.factory = this.mode.event(this);
                break;
            default:
                if (value === "class") {
                    (this as Mutable<this>).aspect = "className";
                    this.factory = this.mode.property(this);
                } else {
                    (this as Mutable<this>).aspect = value;
                    this.factory = this.mode.attribute(this);
                }
                break;
        }
    }

    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
        return (this.factory ?? this.mode.content(this)).createBehavior(targets);
    }
}

export function bind<T = any>(
    binding: Binding<T>,
    config: BindingConfig | DefaultBindingOptions = onChange
): CaptureType<T> {
    if (!("mode" in config)) {
        config = onChange(config);
    }

    return new HTMLBindingDirective(binding, config.mode, config.options);
}
