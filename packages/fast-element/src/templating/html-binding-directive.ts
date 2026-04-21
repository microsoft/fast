import type { Binding, BindingDirective } from "../binding/binding.js";
import { isHydratable } from "../components/hydration.js";
import { DOM, DOMAspect, type DOMPolicy } from "../dom.js";
import { Message } from "../interfaces.js";
import {
    ExecutionContext,
    type Expression,
    type ExpressionObserver,
} from "../observation/observable.js";
import { FAST } from "../platform.js";
import {
    type AddViewBehaviorFactory,
    type Aspected,
    HTMLDirective,
    type ViewBehavior,
    type ViewBehaviorFactory,
    type ViewController,
} from "./html-directive.js";
import { Markup } from "./markup.js";
import { HydrationStage } from "./view.js";

type UpdateTarget = (
    this: HTMLBindingDirective,
    target: Node,
    aspect: string,
    value: any,
    controller: ViewController,
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
    bind(source: any, context?: ExecutionContext): void;

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

export interface HydratableContentTemplate extends ContentTemplate {
    /**
     * Hydrates a content view from first/last nodes.
     */
    hydrate(first: Node, last: Node): ContentView;
}

type ComposableView = ContentView & {
    isComposed?: boolean;
    needsBindOnly?: boolean;
};

type ContentTarget = Node & {
    $fastView?: ComposableView;
    $fastTemplate?: ContentTemplate;
};

function isContentTemplate(value: any): value is ContentTemplate {
    return value.create !== undefined;
}

/**
 * Sink function for DOMAspect.content bindings (text content interpolation).
 * Handles two cases:
 * - If the value is a ContentTemplate (has a create() method), it composes a child
 *   view into the DOM, managing view lifecycle (create/reuse/remove/bind).
 * - If the value is a primitive, it sets target.textContent directly, first removing
 *   any previously composed view.
 */
function updateContent(
    this: HTMLBindingDirective,
    target: ContentTarget,
    aspect: string,
    value: any,
    controller: ViewController,
): void {
    // If there's no actual value, then this equates to the
    // empty string for the purposes of content bindings.
    if (value === null || value === undefined) {
        value = "";
    }

    // If the value has a "create" method, then it's a ContentTemplate.
    if (isContentTemplate(value)) {
        target.textContent = "";
        let view = target.$fastView as ComposableView;

        // If there's no previous view that we might be able to
        // reuse then create a new view from the template.
        if (view === void 0) {
            if (
                isHydratable(controller) &&
                isHydratable(value) &&
                controller.bindingViewBoundaries[this.targetNodeId] !== undefined &&
                controller.hydrationStage !== HydrationStage.hydrated
            ) {
                const viewNodes = controller.bindingViewBoundaries[this.targetNodeId];
                view = value.hydrate(viewNodes.first, viewNodes.last);
            } else {
                view = value.create();
            }
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
            view.bind(controller.source, controller.context);
            view.insertBefore(target);
            target.$fastView = view;
            target.$fastTemplate = value;
        } else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(controller.source, controller.context);
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
    cv: {};
    v: number;
}

/**
 * Sink function for DOMAspect.tokenList bindings (e.g., :classList).
 * Uses a versioning scheme to efficiently track which CSS classes were added
 * in the current update vs. the previous one. Classes from the previous version
 * that aren't present in the new value are automatically removed.
 */
function updateTokenList(
    this: HTMLBindingDirective,
    target: Element,
    aspect: string,
    value: any,
): void {
    const lookup = `${this.id}-t`;
    const state: TokenListState =
        target[lookup] ?? (target[lookup] = { v: 0, cv: Object.create(null) });
    const classVersions = state.cv;
    let version = state.v;
    const tokenList = target[aspect] as DOMTokenList;

    // Add the classes, tracking the version at which they were added.
    if (value !== null && value !== undefined && value.length) {
        const names = value.split(/\s+/);

        for (let i = 0, ii = names.length; i < ii; ++i) {
            const currentName = names[i];

            if (currentName === "") {
                continue;
            }

            classVersions[currentName] = version;
            tokenList.add(currentName);
        }
    }

    state.v = version + 1;

    // If this is the first call to add classes, there's no need to remove old ones.
    if (version === 0) {
        return;
    }

    // Remove classes from the previous version.
    version -= 1;

    for (const name in classVersions) {
        if (classVersions[name] === version) {
            tokenList.remove(name);
        }
    }
}

/**
 * Maps each DOMAspect type to its corresponding DOM update ("sink") function.
 * When a binding value changes, the sink function for the binding's aspect type
 * is called to push the new value into the DOM. Events are handled separately
 * via addEventListener in bind(), so the event sink is a no-op.
 */
const sinkLookup: Record<DOMAspect, UpdateTarget> = {
    [DOMAspect.attribute]: DOM.setAttribute,
    [DOMAspect.booleanAttribute]: DOM.setBooleanAttribute,
    [DOMAspect.property]: (t, a, v) => (t[a] = v),
    [DOMAspect.content]: updateContent,
    [DOMAspect.tokenList]: updateTokenList,
    [DOMAspect.event]: () => void 0,
};

/**
 * The central binding directive that bridges data expressions and DOM updates.
 *
 * HTMLBindingDirective fulfills three roles simultaneously:
 * - **HTMLDirective**: Produces placeholder HTML via createHTML() during template authoring.
 * - **ViewBehaviorFactory**: Creates behaviors (returns itself) during view creation.
 * - **ViewBehavior / EventListener**: Attaches to a DOM node during bind, manages
 *   expression observers for reactive updates, and handles DOM events directly.
 *
 * The aspectType (set by HTMLDirective.assignAspect during template processing)
 * determines which DOM "sink" function is used to apply values — e.g.,
 * setAttribute for attributes, addEventListener for events, textContent for content.
 *
 * @public
 */
export class HTMLBindingDirective
    implements
        HTMLDirective,
        ViewBehaviorFactory,
        ViewBehavior,
        Aspected,
        BindingDirective
{
    private data: string;
    private updateTarget: UpdateTarget | null = null;

    /**
     * The unique id of the factory.
     */
    id: string;

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    targetNodeId: string;

    /**
     * The tagname associated with the target node.
     */
    targetTagName: string | null;

    /**
     * The policy that the created behavior must run under.
     */
    policy: DOMPolicy;

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
    aspectType: DOMAspect = DOMAspect.content;

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
     */
    createBehavior(): ViewBehavior {
        if (this.updateTarget === null) {
            const sink = sinkLookup[this.aspectType];
            const policy = this.dataBinding.policy ?? this.policy;

            if (!sink) {
                throw FAST.error(Message.unsupportedBindingBehavior);
            }

            this.data = `${this.id}-d`;
            this.updateTarget = policy.protect(
                this.targetTagName,
                this.aspectType,
                this.targetAspect,
                sink,
            );
        }

        return this;
    }

    /**
     * Attaches this binding to its target DOM node.
     * - For events: stores the controller reference on the target element and registers
     *   this directive as the EventListener via addEventListener. The directive's
     *   handleEvent() method will be called when the event fires.
     * - For content bindings: registers an unbind handler, then falls through to the
     *   default path.
     * - For all non-event bindings: creates (or reuses) an ExpressionObserver, evaluates
     *   the binding expression, and applies the result to the DOM via the updateTarget
     *   sink function. The observer will call handleChange() on future data changes.
     * @internal
     */
    bind(controller: ViewController): void {
        const target = controller.targets[this.targetNodeId];

        switch (this.aspectType) {
            case DOMAspect.event:
                target[this.data] = controller;
                target.addEventListener(
                    this.targetAspect,
                    this,
                    this.dataBinding.options,
                );
                break;
            case DOMAspect.content:
                controller.onUnbind(this);
            // intentional fall through
            default: {
                const observer =
                    target[this.data] ??
                    (target[this.data] = this.dataBinding.createObserver(this, this));

                (observer as any).target = target;
                (observer as any).controller = controller;

                // Evaluate to establish dependency tracking
                const value = observer.bind(controller);

                // Skip DOM update for attribute bindings when prerendered —
                // the server has already rendered the correct attribute values.
                // Content, property, and tokenList bindings must still run
                // so structural directives, host properties, and class lists
                // are properly initialized.
                if (
                    controller._skipAttrUpdates &&
                    (this.aspectType === DOMAspect.attribute ||
                        this.aspectType === DOMAspect.booleanAttribute)
                ) {
                    break;
                }

                this.updateTarget!(
                    target,
                    this.targetAspect,
                    value,
                    controller,
                );
                break;
            }
        }
    }

    /** @internal */
    unbind(controller: ViewController): void {
        const target = controller.targets[this.targetNodeId] as ContentTarget;
        const view = target.$fastView as ComposableView;

        if (view !== void 0 && view.isComposed) {
            view.unbind();
            view.needsBindOnly = true;
        }
    }

    /**
     * Implements the EventListener interface. When a DOM event fires on the target
     * element, this method retrieves the ViewController stored on the element,
     * sets the event on the ExecutionContext so `c.event` is available to the
     * binding expression, and evaluates the expression. If the expression returns
     * anything other than `true`, the event's default action is prevented.
     * @internal
     */
    handleEvent(event: Event): void {
        const controller = event.currentTarget![this.data] as ViewController;

        if (controller.isBound) {
            ExecutionContext.setEvent(event);
            const result = this.dataBinding.evaluate(
                controller.source,
                controller.context,
            );
            ExecutionContext.setEvent(null);

            if (result !== true) {
                event.preventDefault();
            }
        }
    }

    /**
     * Called by the ExpressionObserver when a tracked dependency changes.
     * Re-evaluates the binding expression via observer.bind() and pushes
     * the new value to the DOM through the updateTarget sink function.
     * This is the reactive update path that keeps the DOM in sync with data.
     *
     * Guards against stale notifications: when a view is unbound (e.g., after
     * a parent `when` directive tears down a child element), coupled-lifetime
     * observers may still hold active subscriptions. If a property change fires
     * on the source element while the view is inactive, this guard prevents
     * the binding expression from evaluating with a null source.
     * @internal
     */
    handleChange(binding: Expression, observer: ExpressionObserver): void {
        const controller = (observer as any).controller;

        // https://github.com/microsoft/fast/issues/7444
        // This guard will be reconsidered in the next major version.
        if (!controller.isBound) {
            return;
        }

        const target = (observer as any).target;
        this.updateTarget!(
            target,
            this.targetAspect,
            observer.bind(controller),
            controller,
        );
    }
}

HTMLDirective.define(HTMLBindingDirective, { aspected: true });
