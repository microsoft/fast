import type { Disposable } from "../interfaces.js";
import type { ExecutionContext } from "../observation/observable.js";
import type {
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
    readonly context: ExecutionContext<TParent> | null;

    /**
     * The data that the view is bound to.
     */
    readonly source: TSource | null;

    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     */
    bind(source: TSource): void;

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
        parent.removeChild(current);
        current = next!;
    }

    parent.removeChild(lastNode);
}

/**
 * The standard View implementation, which also implements ElementView and SyntheticView.
 * @public
 */
export class HTMLView<TSource = any, TParent = any>
    implements ElementView<TSource, TParent>, SyntheticView<TSource, TParent> {
    private behaviors: ViewBehavior[] | null = null;

    /**
     * The data that the view is bound to.
     */
    public source: TSource | null = null;

    /**
     * The execution context the view is running within.
     */
    public get context(): ExecutionContext<TParent> {
        // TODO: make this a real context
        return this as any;
    }

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
        private factories: ReadonlyArray<ViewBehaviorFactory>,
        public readonly targets: ViewBehaviorTargets
    ) {
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

    onUnbind(behavior: { unbind(controller: ViewController<TSource, TParent>) }): void {}

    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the behaviors within.
     */
    public bind(source: TSource): void {
        let behaviors = this.behaviors;
        const oldSource = this.source;

        if (oldSource === source) {
            return;
        }

        this.source = source;

        if (oldSource !== null) {
            // TODO: unbind unbindables

            for (let i = 0, ii = behaviors!.length; i < ii; ++i) {
                const current = behaviors![i];
                current.bind(this);
            }
        } else if (behaviors === null) {
            this.behaviors = behaviors = new Array<ViewBehavior>(this.factories.length);
            const factories = this.factories;

            for (let i = 0, ii = factories.length; i < ii; ++i) {
                const behavior = factories[i].createBehavior();
                behavior.bind(this);
                behaviors[i] = behavior;
            }
        } else {
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(this);
            }
        }
    }

    /**
     * Unbinds a view's behaviors from its binding source.
     */
    public unbind(): void {
        const oldSource = this.source;

        if (oldSource === null) {
            return;
        }

        // TODO unbind bindables

        this.source = null;
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
