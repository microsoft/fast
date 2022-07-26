import type { Subscriber } from "../index.js";
import { isFunction, Message } from "../interfaces.js";
import {
    ExecutionContext,
    Expression,
    ExpressionObserver,
    Observable,
} from "../observation/observable.js";
import { FAST } from "../platform.js";
import { DOM } from "./dom.js";
import {
    AddViewBehaviorFactory,
    Aspect,
    Aspected,
    Binding,
    HTMLDirective,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
} from "./html-directive.js";
import { Markup, nextId } from "./markup.js";

declare class TrustedHTML {}
const createInnerHTMLBinding = globalThis.TrustedHTML
    ? (binding: Expression) => (s, c) => {
          const value = binding(s, c);

          if (value instanceof TrustedHTML) {
              return value;
          }

          throw FAST.error(Message.bindingInnerHTMLRequiresTrustedTypes);
      }
    : (binding: Expression) => binding;

class OnChangeBinding<TSource = any, TReturn = any, TParent = any> extends Binding<
    TSource,
    TReturn,
    TParent
> {
    constructor(
        public readonly evaluate: Expression<TSource, TReturn, TParent>,
        public isVolatile: boolean
    ) {
        super();
    }

    createObserver(
        _: HTMLBindingDirective,
        subscriber: Subscriber
    ): ExpressionObserver<TSource, TReturn, TParent> {
        return Observable.binding(this.evaluate, subscriber, this.isVolatile);
    }
}

class OneTimeBinding<TSource = any, TReturn = any, TParent = any>
    extends Binding<TSource, TReturn, TParent>
    implements ExpressionObserver<TSource, TReturn, TParent> {
    constructor(public readonly evaluate: Expression<TSource, TReturn, TParent>) {
        super();
    }

    createObserver(): ExpressionObserver<TSource, TReturn, TParent> {
        return this;
    }

    observe(source: TSource, context: ExecutionContext<TParent>): TReturn {
        return this.evaluate(source, context);
    }

    dispose(): void {}
}

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
 * A simple View that can be interpolated into HTML content.
 * @public
 */
export interface ContentView {
    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the view within.
     */
    bind(source: any, context: ExecutionContext): void;

    /**
     * Unbinds a view's behaviors from its binding source and context.
     */
    unbind(): void;

    /**
     * Inserts the view's DOM nodes before the referenced node.
     * @param node - The node to insert the view's DOM before.
     */
    insertBefore(node: Node): void;

    /**
     * Removes the view's DOM nodes.
     * The nodes are not disposed and the view can later be re-inserted.
     */
    remove(): void;
}

/**
 * A simple template that can create ContentView instances.
 * @public
 */
export interface ContentTemplate {
    /**
     * Creates a simple content view instance.
     */
    create(): ContentView;
}

type ComposableView = ContentView & {
    isComposed?: boolean;
    needsBindOnly?: boolean;
};

type ContentTarget = Node & {
    $fastView?: ComposableView;
    $fastTemplate?: ContentTemplate;
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

    // If the value has a "create" method, then it's a ContentTemplate.
    if (value.create) {
        target.textContent = "";
        let view = target.$fastView as ComposableView;

        // If there's no previous view that we might be able to
        // reuse then create a new view from the template.
        if (view === void 0) {
            view = value.create();
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

                view = value.create();
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
        const view = target.$fastView;

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
 * A binding behavior for bindings that change.
 * @public
 */
export class BindingBehavior implements ViewBehavior {
    private observerProperty: string;

    /**
     * Creates an instance of ChangeBinding.
     * @param directive - The directive that has the configuration for this behavior.
     * @param updateTarget - The function used to update the target with the latest value.
     */
    constructor(
        public readonly directive: HTMLBindingDirective,
        protected updateTarget: UpdateTarget
    ) {
        this.observerProperty = `${directive.id}-o`;
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
    public handleChange(binding: Expression, observer: ExpressionObserver): void {
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

    /**
     * Returns the binding observer used to update the node.
     * @param target - The target node.
     * @returns A BindingObserver.
     */
    protected getObserver(target: Node): ExpressionObserver {
        return (
            target[this.observerProperty] ??
            (target[this.observerProperty] = this.directive.dataBinding.createObserver(
                this.directive,
                this
            ))
        );
    }

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
        return this;
    }
}

/**
 * A special binding behavior that can bind node content.
 * @public
 */
export class ContentBehavior extends BindingBehavior {
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        super.unbind(source, context, targets);

        const target = targets[this.directive.nodeId] as ContentTarget;
        const view = target.$fastView as ComposableView;

        if (view !== void 0 && view.isComposed) {
            view.unbind();
            view.needsBindOnly = true;
        }
    }
}

/**
 * A binding behavior for handling events.
 * @public
 */
export class EventBehavior {
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
        target.addEventListener(
            directive.targetAspect,
            this,
            directive.dataBinding.options
        );
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
        target.removeEventListener(
            directive.targetAspect,
            this,
            directive.dataBinding.options
        );
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
        const result = this.directive.dataBinding.evaluate(
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
 * A directive that applies bindings.
 * @public
 */
export class HTMLBindingDirective
    implements HTMLDirective, ViewBehaviorFactory, Aspected {
    private factory: Pick<ViewBehaviorFactory, "createBehavior"> | null = null;

    /**
     * The unique id of the factory.
     */
    id: string = nextId();

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
     * @param dataBinding - The binding configuration to apply.
     */
    constructor(public dataBinding: Binding) {}

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
                this.dataBinding.evaluate = createInnerHTMLBinding(
                    this.dataBinding.evaluate
                );
            }

            switch (this.aspectType) {
                case 1:
                    this.factory = new BindingBehavior(this, DOM.setAttribute);
                    break;
                case 2:
                    this.factory = new BindingBehavior(this, DOM.setBooleanAttribute);
                    break;
                case 3:
                    this.factory = new BindingBehavior(this, (t, a, v) => (t[a] = v));
                    break;
                case 4:
                    this.factory = new ContentBehavior(this, updateContentTarget);
                    break;
                case 5:
                    this.factory = new BindingBehavior(this, updateTokenListTarget);
                    break;
                case 6:
                    this.factory = new EventBehavior(this);
                    break;
                default:
                    throw FAST.error(Message.unsupportedBindingBehavior);
            }
        }

        return this.factory.createBehavior(targets);
    }
}

HTMLDirective.define(HTMLBindingDirective, { aspected: true });

/**
 * Creates an standard binding.
 * @param binding - The binding to refresh when changed.
 * @param isVolatile - Indicates whether the binding is volatile or not.
 * @returns A binding configuration.
 * @public
 */
export function bind<T = any>(
    binding: Expression<T>,
    isVolatile = Observable.isVolatileBinding(binding)
): Binding<T> {
    return new OnChangeBinding(binding, isVolatile);
}

/**
 * Creates a one time binding
 * @param binding - The binding to refresh when signaled.
 * @returns A binding configuration.
 * @public
 */
export function oneTime<T = any>(binding: Expression<T>): Binding<T> {
    return new OneTimeBinding(binding);
}

/**
 * Creates an event listener binding.
 * @param binding - The binding to invoke when the event is raised.
 * @param options - Event listener options.
 * @returns A binding configuration.
 * @public
 */
export function listener<T = any>(
    binding: Expression<T>,
    options?: AddEventListenerOptions
): Binding<T> {
    const config = new OnChangeBinding(binding, false);
    config.options = options;
    return config;
}

/**
 * Normalizes the input value into a binding.
 * @param value - The value to create the default binding for.
 * @returns A binding configuration for the provided value.
 * @public
 */
export function normalizeBinding<TSource = any, TReturn = any, TParent = any>(
    value: Expression<TSource, TReturn, TParent> | Binding<TSource, TReturn, TParent> | {}
): Binding<TSource, TReturn, TParent> {
    return isFunction(value)
        ? bind(value)
        : value instanceof Binding
        ? value
        : oneTime(() => value);
}
