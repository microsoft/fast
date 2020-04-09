import { Behavior } from "./directives/behavior";

/**
 * Represents a collection of DOM nodes which can be bound to a data source.
 */
export interface View {
    /**
     * Binds a view's behaviors to its binding source.
     * @param source The binding source for the view's binding behaviors.
     */
    bind(source: unknown): void;

    /**
     * Unbinds a view's behaviors from its binding source.
     */
    unbind(): void;
}

/**
 * A View representing DOM nodes specifically for rendering the view of a custom element.
 */
export interface ElementView extends View {
    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node The parent node to append the view's DOM nodes to.
     */
    appendTo(node: Node): void;
}

/**
 * A view representing a range of DOM nodes which can be added/removed adhoc.
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
     * @param node The node to insert the view's DOM before.
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
 */
export class HTMLView implements ElementView, SyntheticView {
    private source: any = void 0;
    public firstChild: Node;
    public lastChild: Node;

    constructor(private fragment: DocumentFragment, private behaviors: Behavior[]) {
        this.firstChild = fragment.firstChild!;
        this.lastChild = fragment.lastChild!;
    }

    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node The parent node to append the view's DOM nodes to.
     */
    public appendTo(node: Node) {
        node.appendChild(this.fragment);
    }

    /**
     * Inserts the view's DOM nodes before the referenced node.
     * @param node The node to insert the view's DOM before.
     */
    public insertBefore(node: Node) {
        if (this.fragment.hasChildNodes()) {
            node.parentNode!.insertBefore(this.fragment, node);
        } else {
            let parentNode = node.parentNode!;
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
    public remove() {
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
    public dispose() {
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

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind();
        }
    }

    /**
     * Binds a view's behaviors to its binding source.
     * @param source The binding source for the view's binding behaviors.
     */
    public bind(source: unknown) {
        if (this.source === source) {
            return;
        } else if (this.source !== void 0) {
            this.unbind();
        }

        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].bind(source);
        }
    }

    /**
     * Unbinds a view's behaviors from its binding source.
     */
    public unbind() {
        if (this.source === void 0) {
            return;
        }

        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind();
        }

        this.source = void 0;
    }

    /**
     * Efficiently disposes of a contiguous range of synthetic view instances.
     * @param views A contiguous range of views to be disposed.
     */
    public static disposeContiguousBatch(views: SyntheticView[]) {
        if (views.length === 0) {
            return;
        }

        range.setStart(views[0].firstChild, 0);
        range.setEnd(views[views.length - 1].lastChild, 0);
        range.deleteContents();

        for (let i = 0, ii = views.length; i < ii; ++i) {
            const behaviors = (views[i] as any).behaviors as Behavior[];

            for (let j = 0, jj = behaviors.length; j < jj; ++j) {
                behaviors[j].unbind();
            }
        }
    }
}
