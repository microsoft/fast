import type { Subscriber } from "../index.js";
import { isFunction, Message } from "../interfaces.js";
import {
    ExecutionContext,
    Expression,
    ExpressionController,
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
    ViewController,
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
    createObserver(): ExpressionObserver<TSource, TReturn, TParent> {
        return this;
    }

    bind(controller: ExpressionController): TReturn {
        return this.evaluate(controller.source, controller.context);
    }
}

type UpdateTarget = (
    this: HTMLBindingDirective,
    target: Node,
    aspect: string,
    value: any,
    controller: ViewController
) => void;

/**
 * A simple View that can be interpolated into HTML content.
 * @public
 */
export interface ContentView {
    readonly context: ExecutionContext;

    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the view within.
     */
    bind(source: any): void;

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

function updateContent(
    target: ContentTarget,
    aspect: string,
    value: any,
    controller: ViewController
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
            view.bind(controller.source);
            view.insertBefore(target);
            target.$fastView = view;
            target.$fastTemplate = value;
        } else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(controller.source);
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

function updateTokenList(
    this: HTMLBindingDirective,
    target: Element,
    aspect: string,
    value: any
): void {
    const lookup = `${this.id}-t`;
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

const setProperty = (t, a, v) => (t[a] = v);
const eventTarget = () => void 0;

/**
 * A directive that applies bindings.
 * @public
 */
export class HTMLBindingDirective
    implements HTMLDirective, ViewBehaviorFactory, ViewBehavior, Aspected {
    private data: string;
    private updateTarget: UpdateTarget | null = null;

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
    constructor(public dataBinding: Binding) {
        this.data = `${this.id}-d`;
    }

    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    createHTML(add: AddViewBehaviorFactory): string {
        return Markup.interpolation(add(this));
    }

    /**
     * Creates a behavior.
     */
    createBehavior(): ViewBehavior {
        if (this.updateTarget === null) {
            if (this.targetAspect === "innerHTML") {
                this.dataBinding.evaluate = createInnerHTMLBinding(
                    this.dataBinding.evaluate
                );
            }

            switch (this.aspectType) {
                case 1:
                    this.updateTarget = DOM.setAttribute;
                    break;
                case 2:
                    this.updateTarget = DOM.setBooleanAttribute;
                    break;
                case 3:
                    this.updateTarget = setProperty;
                    break;
                case 4:
                    this.bind = this.bindContent;
                    this.updateTarget = updateContent;
                    break;
                case 5:
                    this.updateTarget = updateTokenList;
                    break;
                case 6:
                    this.bind = this.bindEvent;
                    this.updateTarget = eventTarget;
                    break;
                default:
                    throw FAST.error(Message.unsupportedBindingBehavior);
            }
        }

        return this;
    }

    /** @internal */
    bindDefault(controller: ViewController): void {
        const target = controller.targets[this.nodeId];
        const observer = this.getObserver(target);
        (observer as any).target = target;
        (observer as any).controller = controller;

        this.updateTarget!(
            target,
            this.targetAspect,
            observer.bind(controller),
            controller
        );

        if (this.updateTarget === updateContent) {
            controller.onUnbind(this);
        }
    }

    /** @internal */
    bind = this.bindDefault;

    /** @internal */
    bindContent(controller: ViewController): void {
        this.bindDefault(controller);
        controller.onUnbind(this);
    }

    /** @internal */
    bindEvent(controller: ViewController) {
        const target = controller.targets[this.nodeId];
        target[this.data] = controller;
        target.addEventListener(this.targetAspect, this, this.dataBinding.options);
    }

    /** @internal */
    unbind(controller: ViewController): void {
        const target = controller.targets[this.nodeId] as ContentTarget;
        const view = target.$fastView as ComposableView;

        if (view !== void 0 && view.isComposed) {
            view.unbind();
            view.needsBindOnly = true;
        }
    }

    /** @internal */
    handleEvent(event: Event): void {
        const target = event.currentTarget!;

        ExecutionContext.setEvent(event);

        const controller = target[this.data] as ViewController;
        const result = this.dataBinding.evaluate(controller.source, controller.context);

        ExecutionContext.setEvent(null);

        if (result !== true) {
            event.preventDefault();
        }
    }

    /** @internal */
    handleChange(binding: Expression, observer: ExpressionObserver): void {
        const target = (observer as any).target;
        const controller = (observer as any).controller;
        this.updateTarget!(
            target,
            this.targetAspect,
            observer.bind(controller),
            controller
        );
    }

    private getObserver(target: Node): ExpressionObserver {
        return (
            target[this.data] ??
            (target[this.data] = this.dataBinding.createObserver(this, this))
        );
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
