import type { Behavior } from "../observation/behavior";
import type { ExecutionContext } from "../observation/observable";

/**
 * Represents a collection of DOM nodes which can be bound to a data source.
 * @public
 */
export interface View {
    /**
     * The execution context the view is running within.
     */
    readonly context: ExecutionContext | null;

    /**
     * The data that the view is bound to.
     */
    readonly source: any | null;

    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the view within.
     */
    bind(source: unknown, context: ExecutionContext): void;

    /**
     * Unbinds a view's behaviors from its binding source and context.
     */
    unbind(): void;

    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    dispose(): void;
}

/**
 * A View representing DOM nodes specifically for rendering the view of a custom element.
 * @public
 */
export interface ElementView extends View {
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
export interface SyntheticView extends View {
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

    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    dispose(): void;
}

// A singleton Range instance used to efficiently remove ranges of DOM nodes.
// See the implementation of HTMLView below for further details.
const range = document.createRange();

/**
 * The standard View implementation, which also implements ElementView and SyntheticView.
 * @public
 */
export class HTMLView implements ElementView, SyntheticView {
    /**
     * The data that the view is bound to.
     */
    public source: any | null = null;

    /**
     * The execution context the view is running within.
     */
    public context: ExecutionContext | null = null;

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
        private behaviors: Behavior[]
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
            const parentNode = node.parentNode!;
            const end = this.lastChild!;
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
        const parent = this.firstChild.parentNode!;
        const end = this.lastChild!;
        let current = this.firstChild!;
        let next;

        while (current !== end) {
            next = current.nextSibling;
            parent.removeChild(current);
            current = next!;
        }

        parent.removeChild(end);

        const behaviors = this.behaviors;
        const oldSource = this.source;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind(oldSource);
        }
    }

    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the behaviors within.
     */
    public bind(source: unknown, context: ExecutionContext): void {
        const behaviors = this.behaviors;

        if (this.source === source) {
            return;
        } else if (this.source !== null) {
            const oldSource = this.source;

            this.source = source;
            this.context = context;

            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                const current = behaviors[i];
                current.unbind(oldSource);
                current.bind(source, context);
            }
        } else {
            this.source = source;
            this.context = context;

            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(source, context);
            }
        }
    }

    /**
     * Unbinds a view's behaviors from its binding source.
     */
    public unbind(): void {
        if (this.source === null) {
            return;
        }

        const behaviors = this.behaviors;
        const oldSource = this.source;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind(oldSource);
        }

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

        range.setStartBefore(views[0].firstChild);
        range.setEndAfter(views[views.length - 1].lastChild);
        range.deleteContents();

        for (let i = 0, ii = views.length; i < ii; ++i) {
            const view = views[i] as any;
            const behaviors = view.behaviors as Behavior[];
            const oldSource = view.source;

            for (let j = 0, jj = behaviors.length; j < jj; ++j) {
                behaviors[j].unbind(oldSource);
            }
        }
    }
}
