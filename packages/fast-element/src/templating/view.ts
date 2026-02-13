import { Hydratable } from "../components/hydration.js";
import {
    buildViewBindingTargets,
    createRangeForNodes,
    HydrationTargetElementError,
    targetFactory,
    type ViewBehaviorBoundaries,
} from "../hydration/target-builder.js";
import type { Disposable } from "../interfaces.js";
import {
    ExecutionContext,
    Observable,
    SourceLifetime,
} from "../observation/observable.js";
import { makeSerializationNoop } from "../platform.js";
import type { ViewTemplate } from "../templating/template.js";
import type {
    CompiledViewBehaviorFactory,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
    ViewController,
} from "./html-directive.js";

/**
 * Represents a collection of DOM nodes which can be bound to a data source.
 * @public
 */
export interface View<TSource = any, TParent = any> extends Disposable {
    /**
     * The execution context the view is running within.
     */
    readonly context: ExecutionContext<TParent>;

    /**
     * The data that the view is bound to.
     */
    readonly source: TSource | null;

    /**
     * Indicates whether the controller is bound.
     */
    readonly isBound: boolean;

    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     */
    bind(source: TSource, context?: ExecutionContext<TParent>): void;

    /**
     * Unbinds a view's behaviors from its binding source and context.
     */
    unbind(): void;
}

/**
 * A View representing DOM nodes specifically for rendering the view of a custom element.
 * @public
 */
export interface ElementView<TSource = any, TParent = any>
    extends View<TSource, TParent> {
    /**
     * Indicates how the source's lifetime relates to the controller's lifetime.
     */
    readonly sourceLifetime?: SourceLifetime;

    /**
     * Registers an unbind handler with the controller.
     * @param behavior - An object to call when the controller unbinds.
     */
    onUnbind(behavior: { unbind(controller: ViewController<TSource, TParent>) }): void;

    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node - The parent node to append the view's DOM nodes to.
     */
    appendTo(node: Node): void;
}

/**
 * A view representing a range of DOM nodes which can be added/removed ad hoc.
 * @public
 */
export interface SyntheticView<TSource = any, TParent = any>
    extends View<TSource, TParent> {
    /**
     * The first DOM node in the range of nodes that make up the view.
     */
    readonly firstChild: Node;

    /**
     * The last DOM node in the range of nodes that make up the view.
     */
    readonly lastChild: Node;

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

function removeNodeSequence(firstNode: Node, lastNode: Node): void {
    const parent = firstNode.parentNode!;
    let current = firstNode;
    let next: ChildNode | null;

    while (current !== lastNode) {
        next = current.nextSibling;
        if (!next) {
            throw new Error(
                `Unmatched first/last child inside "${
                    (lastNode.getRootNode() as ShadowRoot).host.nodeName
                }".`
            );
        }
        parent.removeChild(current);
        current = next;
    }

    parent.removeChild(lastNode);
}

class DefaultExecutionContext<TParent> implements ExecutionContext<TParent> {
    /**
     * The index of the current item within a repeat context.
     */
    public index: number = 0;

    /**
     * The length of the current collection within a repeat context.
     */
    public length: number = 0;

    /**
     * The parent data source within a nested context.
     */
    public readonly parent: TParent;

    /**
     * The parent execution context when in nested context scenarios.
     */
    public readonly parentContext: ExecutionContext<TParent>;

    /**
     * The current event within an event handler.
     */
    public get event(): Event {
        return ExecutionContext.getEvent()!;
    }

    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    public get isEven(): boolean {
        return this.index % 2 === 0;
    }

    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    public get isOdd(): boolean {
        return this.index % 2 !== 0;
    }

    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    public get isFirst(): boolean {
        return this.index === 0;
    }

    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    public get isInMiddle(): boolean {
        return !this.isFirst && !this.isLast;
    }

    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    public get isLast(): boolean {
        return this.index === this.length - 1;
    }

    /**
     * Returns the typed event detail of a custom event.
     */
    public eventDetail<TDetail>(): TDetail {
        return (this.event as CustomEvent<TDetail>).detail;
    }

    /**
     * Returns the typed event target of the event.
     */
    public eventTarget<TTarget extends EventTarget>(): TTarget {
        return this.event.target! as TTarget;
    }
}

/**
 * The standard View implementation, which also implements ElementView and SyntheticView.
 * @public
 */
export class HTMLView<TSource = any, TParent = any>
    extends DefaultExecutionContext<TParent>
    implements
        ElementView<TSource, TParent>,
        SyntheticView<TSource, TParent>,
        ExecutionContext<TParent>
{
    private behaviors: ViewBehavior[] | null = null;
    private unbindables: { unbind(controller: ViewController): void }[] = [];

    /**
     * The data that the view is bound to.
     */
    public source: TSource | null = null;

    /**
     * Indicates whether the controller is bound.
     */
    public isBound = false;

    /**
     * Indicates how the source's lifetime relates to the controller's lifetime.
     */
    readonly sourceLifetime: SourceLifetime = SourceLifetime.unknown;

    /**
     * The execution context the view is running within.
     */
    public context: ExecutionContext<TParent> = this;

    /**
     * The first DOM node in the range of nodes that make up the view.
     */
    public firstChild: Node;

    /**
     * The last DOM node in the range of nodes that make up the view.
     */
    public lastChild: Node;

    /**
     * Constructs an instance of HTMLView.
     * @param fragment - The html fragment that contains the nodes for this view.
     * @param behaviors - The behaviors to be applied to this view.
     */
    public constructor(
        private fragment: DocumentFragment,
        private factories: ReadonlyArray<CompiledViewBehaviorFactory>,
        public readonly targets: ViewBehaviorTargets
    ) {
        super();
        this.firstChild = fragment.firstChild!;
        this.lastChild = fragment.lastChild!;
    }

    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node - The parent node to append the view's DOM nodes to.
     */
    public appendTo(node: Node): void {
        node.appendChild(this.fragment);
    }

    /**
     * Inserts the view's DOM nodes before the referenced node.
     * @param node - The node to insert the view's DOM before.
     */
    public insertBefore(node: Node): void {
        if (this.fragment.hasChildNodes()) {
            node.parentNode!.insertBefore(this.fragment, node);
        } else {
            const end = this.lastChild!;
            if (node.previousSibling === end) return;

            const parentNode = node.parentNode!;
            let current = this.firstChild!;
            let next;

            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next!;
            }

            parentNode.insertBefore(end, node);
        }
    }

    /**
     * Removes the view's DOM nodes.
     * The nodes are not disposed and the view can later be re-inserted.
     */
    public remove(): void {
        const fragment = this.fragment;
        const end = this.lastChild!;
        let current = this.firstChild!;
        let next;

        while (current !== end) {
            next = current.nextSibling;
            fragment.appendChild(current);
            current = next!;
        }

        fragment.appendChild(end);
    }

    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    public dispose(): void {
        removeNodeSequence(this.firstChild, this.lastChild);
        this.unbind();
    }

    public onUnbind(behavior: {
        unbind(controller: ViewController<TSource, TParent>): void;
    }): void {
        this.unbindables.push(behavior);
    }

    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the behaviors within.
     */
    public bind(source: TSource, context: ExecutionContext<TParent> = this): void {
        if (this.source === source) {
            return;
        }

        let behaviors = this.behaviors;

        if (behaviors === null) {
            this.source = source;
            this.context = context;
            this.behaviors = behaviors = new Array<ViewBehavior>(this.factories.length);
            const factories = this.factories;

            for (let i = 0, ii = factories.length; i < ii; ++i) {
                const behavior = factories[i].createBehavior();
                behavior.bind(this);
                behaviors[i] = behavior;
            }
        } else {
            if (this.source !== null) {
                this.evaluateUnbindables();
            }

            this.isBound = false;
            this.source = source;
            this.context = context;

            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(this);
            }
        }

        this.isBound = true;
    }

    /**
     * Unbinds a view's behaviors from its binding source.
     */
    public unbind(): void {
        if (!this.isBound || this.source === null) {
            return;
        }

        this.evaluateUnbindables();
        this.source = null;
        this.context = this;
        this.isBound = false;
    }

    private evaluateUnbindables() {
        const unbindables = this.unbindables;

        for (let i = 0, ii = unbindables.length; i < ii; ++i) {
            unbindables[i].unbind(this);
        }

        unbindables.length = 0;
    }

    /**
     * Efficiently disposes of a contiguous range of synthetic view instances.
     * @param views - A contiguous range of views to be disposed.
     */
    public static disposeContiguousBatch(views: SyntheticView[]): void {
        if (views.length === 0) {
            return;
        }

        removeNodeSequence(views[0].firstChild, views[views.length - 1].lastChild);

        for (let i = 0, ii = views.length; i < ii; ++i) {
            views[i].unbind();
        }
    }
}

makeSerializationNoop(HTMLView);
Observable.defineProperty(HTMLView.prototype, "index");
Observable.defineProperty(HTMLView.prototype, "length");

/** @public */
export interface HydratableView<TSource = any, TParent = any>
    extends ElementView,
        SyntheticView,
        DefaultExecutionContext<TParent> {
    [Hydratable]: symbol;
    readonly bindingViewBoundaries: Record<string, ViewNodes>;
    readonly hydrationStage: keyof typeof HydrationStage;
}

export interface ViewNodes {
    first: Node;
    last: Node;
}

export const HydrationStage = {
    unhydrated: "unhydrated",
    hydrating: "hydrating",
    hydrated: "hydrated",
} as const;

/** @public */
export class HydrationBindingError extends Error {
    constructor(
        /**
         * The error message
         */
        message: string | undefined,
        /**
         * The factory that was unable to be bound
         */
        public readonly factory: ViewBehaviorFactory,
        /**
         * A DocumentFragment containing a clone of the
         * view's Nodes.
         */
        public readonly fragment: DocumentFragment,

        /**
         * String representation of the HTML in the template that
         * threw the binding error.
         */
        public readonly templateString: string
    ) {
        super(message);
    }
}

export class HydrationView<TSource = any, TParent = any>
    extends DefaultExecutionContext<TParent>
    implements HydratableView
{
    [Hydratable] = Hydratable;
    public context: ExecutionContext<any> = this;
    public source: TSource | null = null;
    public isBound = false;
    public get hydrationStage() {
        return this._hydrationStage;
    }
    public get targets() {
        return this._targets;
    }
    public get bindingViewBoundaries() {
        return this._bindingViewBoundaries;
    }
    public readonly sourceLifetime: SourceLifetime = SourceLifetime.unknown;
    private unbindables: { unbind(controller: ViewController): void }[] = [];
    private fragment: DocumentFragment | null = null;
    private behaviors: ViewBehavior[] | null = null;
    private factories: CompiledViewBehaviorFactory[];
    private _hydrationStage: keyof typeof HydrationStage = HydrationStage.unhydrated;
    private _bindingViewBoundaries: ViewBehaviorBoundaries = {};
    private _targets: ViewBehaviorTargets = {};

    constructor(
        public readonly firstChild: Node,
        public readonly lastChild: Node,
        private sourceTemplate: ViewTemplate,
        private hostBindingTarget?: Element
    ) {
        super();
        this.factories = sourceTemplate.compile().factories;
    }

    /**
     * no-op. Hydrated views are don't need to be moved from a documentFragment
     * to the target node.
     */
    public insertBefore(node: Node): void {
        // No-op in cases where this is called before the view is removed,
        // because the nodes will already be in the document and just need hydrating.
        if (this.fragment === null) {
            return;
        }

        if (this.fragment.hasChildNodes()) {
            node.parentNode!.insertBefore(this.fragment, node);
        } else {
            const end = this.lastChild!;
            if (node.previousSibling === end) return;

            const parentNode = node.parentNode!;
            let current = this.firstChild!;
            let next;

            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next!;
            }

            parentNode.insertBefore(end, node);
        }
    }

    /**
     * Appends the view to a node. In cases where this is called before the
     * view has been removed, the method will no-op.
     * @param node - the node to append the view to.
     */
    public appendTo(node: Node): void {
        if (this.fragment !== null) {
            node.appendChild(this.fragment);
        }
    }

    public remove(): void {
        const fragment =
            this.fragment || (this.fragment = document.createDocumentFragment());
        const end = this.lastChild!;
        let current = this.firstChild!;
        let next;

        while (current !== end) {
            next = current.nextSibling;
            if (!next) {
                throw new Error(
                    `Unmatched first/last child inside "${
                        (end.getRootNode() as ShadowRoot).host.nodeName
                    }".`
                );
            }
            fragment.appendChild(current);
            current = next;
        }

        fragment.appendChild(end);
    }

    public bind(source: TSource, context: ExecutionContext<any> = this): void {
        if (this.hydrationStage !== HydrationStage.hydrated) {
            this._hydrationStage = HydrationStage.hydrating;
        }

        if (this.source === source) {
            return;
        }

        let behaviors = this.behaviors;

        if (behaviors === null) {
            this.source = source;
            this.context = context;
            try {
                const { targets, boundaries } = buildViewBindingTargets(
                    this.firstChild,
                    this.lastChild,
                    this.factories
                );
                this._targets = targets;
                this._bindingViewBoundaries = boundaries;
            } catch (error) {
                if (error instanceof HydrationTargetElementError) {
                    let templateString = this.sourceTemplate.html;
                    if (typeof templateString !== "string") {
                        templateString = templateString.innerHTML;
                    }
                    error.templateString = templateString;
                }
                throw error;
            }
            this.behaviors = behaviors = new Array<ViewBehavior>(this.factories.length);
            const factories = this.factories;

            for (let i = 0, ii = factories.length; i < ii; ++i) {
                const factory = factories[i];

                if (factory.targetNodeId === "h" && this.hostBindingTarget) {
                    targetFactory(factory, this.hostBindingTarget, this._targets);
                }

                // If the binding has been targeted or it is a host binding and the view has a hostBindingTarget
                if (factory.targetNodeId in this.targets) {
                    const behavior = factory.createBehavior();
                    behavior.bind(this);
                    behaviors[i] = behavior;
                } else {
                    let templateString = this.sourceTemplate.html;

                    if (typeof templateString !== "string") {
                        templateString = templateString.innerHTML;
                    }

                    const hostElement = (this.firstChild?.getRootNode() as ShadowRoot)
                        .host;
                    const hostName = hostElement?.nodeName || "unknown";
                    const factoryInfo = factory as any;

                    // Build detailed error message
                    const details: string[] = [
                        `HydrationView was unable to successfully target bindings inside "<${hostName.toLowerCase()}>".`,
                        `\nMismatch Details:`,
                        `  - Expected target node ID: "${factory.targetNodeId}"`,
                        `  - Available target IDs: [${
                            Object.keys(this.targets).join(", ") || "none"
                        }]`,
                    ];

                    if (factory.targetTagName) {
                        details.push(`  - Expected tag name: "${factory.targetTagName}"`);
                    }

                    if (factoryInfo.sourceAspect) {
                        details.push(`  - Source aspect: "${factoryInfo.sourceAspect}"`);
                    }

                    if (factoryInfo.aspectType !== undefined) {
                        details.push(`  - Aspect type: ${factoryInfo.aspectType}`);
                    }

                    details.push(
                        `\nThis usually means:`,
                        `  1. The server-rendered HTML doesn't match the client template`,
                        `  2. The hydration markers are missing or corrupted`,
                        `  3. The DOM structure was modified before hydration`,
                        `\nTemplate: ${templateString.slice(0, 200)}${
                            templateString.length > 200 ? "..." : ""
                        }`
                    );

                    throw new HydrationBindingError(
                        details.join("\n"),
                        factory,
                        createRangeForNodes(
                            this.firstChild,
                            this.lastChild
                        ).cloneContents(),
                        templateString
                    );
                }
            }
        } else {
            if (this.source !== null) {
                this.evaluateUnbindables();
            }

            this.isBound = false;
            this.source = source;
            this.context = context;

            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(this);
            }
        }

        this.isBound = true;
        this._hydrationStage = HydrationStage.hydrated;
    }

    public unbind(): void {
        if (!this.isBound || this.source === null) {
            return;
        }

        this.evaluateUnbindables();

        this.source = null;
        this.context = this;
        this.isBound = false;
    }

    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    public dispose(): void {
        removeNodeSequence(this.firstChild, this.lastChild);
        this.unbind();
    }

    public onUnbind(behavior: {
        unbind(controller: ViewController<TSource, TParent>): void;
    }) {
        this.unbindables.push(behavior);
    }

    private evaluateUnbindables() {
        const unbindables = this.unbindables;

        for (let i = 0, ii = unbindables.length; i < ii; ++i) {
            unbindables[i].unbind(this);
        }

        unbindables.length = 0;
    }
}

makeSerializationNoop(HydrationView);
