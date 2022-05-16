import { isString, Message } from "../interfaces.js";
import {
    Binding,
    BindingObserver,
    ExecutionContext,
    Observable,
} from "../observation/observable.js";
import { FAST } from "../platform.js";
import { DOM } from "./dom.js";
import {
    AddViewBehaviorFactory,
    Aspect,
    Aspected,
    AspectType,
    HTMLDirective,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
} from "./html-directive.js";
import { Markup } from "./markup.js";
import type { CaptureType } from "./template.js";
import type { SyntheticView } from "./view.js";

// TODO: Fix the code docs in this file.

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
 * @alpha
 */
export type BindingBehaviorFactory = {
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior;
};

/**
 * @alpha
 */
export type BindingType = (directive: HTMLBindingDirective) => BindingBehaviorFactory;

function createType(bindingType: typeof UpdateBinding, updateTarget: UpdateTarget) {
    return directive => new bindingType(directive, updateTarget);
}

/**
 * @alpha
 */
export type BindingMode = Record<AspectType, BindingType>;

/**
 * @alpha
 */
export const BindingMode = Object.freeze({
    define(
        updateType: typeof UpdateBinding,
        eventType?: typeof EventBinding
    ): BindingMode {
        return Object.freeze({
            [Aspect.attribute]: createType(updateType, DOM.setAttribute),
            [Aspect.booleanAttribute]: createType(updateType, DOM.setBooleanAttribute),
            [Aspect.property]: createType(updateType, (t, a, v) => (t[a] = v)),
            [Aspect.content]: createType(
                createContentBinding(updateType),
                updateContentTarget
            ),
            [Aspect.tokenList]: createType(updateType, updateTokenListTarget),
            [Aspect.event]: eventType
                ? directive => new eventType(directive)
                : () => {
                      throw new Error();
                  },
        });
    },
});

/**
 * @alpha
 */
export interface BindingConfig<T = any> {
    mode: BindingMode;
    options: any;
}

/**
 * @alpha
 */
export type BindingConfigResolver<T> = (options: T) => BindingConfig<T>;

/**
 * @alpha
 */
export const BindingConfig = Object.freeze({
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

class UpdateBinding {
    constructor(
        public readonly directive: HTMLBindingDirective,
        protected updateTarget: UpdateTarget
    ) {}

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {}
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {}

    createBehavior(): ViewBehavior {
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
    const lookup = `${directive.id}-token-list`;
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

class OneTimeBinding extends UpdateBinding {
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId];
        this.updateTarget(
            target,
            directive.targetAspect,
            directive.binding(source, context),
            source,
            context
        );
    }
}

const signals: Record<string, undefined | Function | Function[]> = Object.create(null);

/**
 * @alpha
 */
export function sendSignal(signal: string): void {
    const found = signals[signal];
    if (found) {
        Array.isArray(found) ? found.forEach(x => x()) : found();
    }
}

class SignalBinding extends UpdateBinding {
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId];
        const signal = this.getSignal(source, context);
        const handler = (target[directive.id] = () => {
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

    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const signal = this.getSignal(source, context);
        const found = signals[signal];

        if (found && Array.isArray(found)) {
            const directive = this.directive;
            const target = targets[directive.nodeId];
            const handler = target[directive.id];
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
}

class ChangeBinding extends UpdateBinding {
    private isBindingVolatile: boolean;

    constructor(directive: HTMLBindingDirective, updateTarget: UpdateTarget) {
        super(directive, updateTarget);
        this.isBindingVolatile = Observable.isVolatileBinding(directive.binding);
    }

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId];
        const observer: BindingObserver =
            target[directive.id] ??
            (target[directive.id] = Observable.binding(
                directive.binding,
                this,
                this.isBindingVolatile
            ));

        (observer as any).target = target;
        (observer as any).source = source;
        (observer as any).context = context;

        this.updateTarget(
            target,
            directive.targetAspect!,
            observer.observe(source, context),
            source,
            context
        );
    }

    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.nodeId];
        const observer = target[this.directive.id];
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
            this.directive.targetAspect!,
            observer.observe(source, context!),
            source,
            context
        );
    }
}

type FASTEventSource = Node & {
    $fastSource: any;
    $fastContext: ExecutionContext | null;
};

class EventBinding {
    constructor(public readonly directive: HTMLBindingDirective) {}

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId] as FASTEventSource;
        target.$fastSource = source;
        target.$fastContext = context;
        target.addEventListener(directive.targetAspect!, this, directive.options);
    }

    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        this.removeEventListener(targets[this.directive.nodeId] as FASTEventSource);
    }

    protected removeEventListener(target: FASTEventSource): void {
        target.$fastSource = null;
        target.$fastContext = null;
        target.removeEventListener(
            this.directive.targetAspect!,
            this,
            this.directive.options
        );
    }

    handleEvent(event: Event): void {
        const target = event.currentTarget as any;
        const source = target.$fastSource;
        const context = target.$fastContext;

        ExecutionContext.setEvent(event);
        const result = this.directive.binding(source, context);
        ExecutionContext.setEvent(null);

        if (result !== true) {
            event.preventDefault();
        }
    }

    createBehavior(): ViewBehavior {
        return this;
    }
}

class OneTimeEventBinding extends EventBinding {
    handleEvent(event: Event): void {
        super.handleEvent(event);
        this.removeEventListener(event.currentTarget as FASTEventSource);
    }
}

/**
 * @alpha
 */
export type DefaultBindingOptions = {
    capture?: boolean;
};

const defaultBindingOptions: DefaultBindingOptions = {
    capture: false,
};

/**
 * @alpha
 */
export const onChange = BindingConfig.define(
    BindingMode.define(ChangeBinding, EventBinding),
    defaultBindingOptions
);

/**
 * @alpha
 */
export const oneTime = BindingConfig.define(
    BindingMode.define(OneTimeBinding, OneTimeEventBinding),
    defaultBindingOptions
);

const signalMode: BindingMode = BindingMode.define(SignalBinding);

/**
 * @alpha
 */
export const signal = <T = any>(options: string | Binding<T>): BindingConfig<T> => {
    return { mode: signalMode, options };
};

/**
 * @internal
 */
export class HTMLBindingDirective
    implements HTMLDirective, ViewBehaviorFactory, Aspected {
    private factory: BindingBehaviorFactory | null = null;

    id: string;
    nodeId: string;
    sourceAspect: string;
    targetAspect: string;
    aspectType: AspectType = Aspect.content;

    constructor(public binding: Binding, public mode: BindingMode, public options: any) {}

    createHTML(add: AddViewBehaviorFactory): string {
        return Markup.interpolation(add(this));
    }

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
 * @alpha
 */
export function bind<T = any>(
    binding: Binding<T>,
    config: BindingConfig<T> | DefaultBindingOptions = onChange
): CaptureType<T> {
    if (!("mode" in config)) {
        config = onChange(config);
    }

    return new HTMLBindingDirective(binding, config.mode, config.options);
}
