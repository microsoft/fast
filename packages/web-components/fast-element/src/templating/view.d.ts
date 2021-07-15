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
/**
 * The standard View implementation, which also implements ElementView and SyntheticView.
 * @public
 */
export declare class HTMLView implements ElementView, SyntheticView {
    private fragment;
    private behaviors;
    /**
     * The data that the view is bound to.
     */
    source: any | null;
    /**
     * The execution context the view is running within.
     */
    context: ExecutionContext | null;
    /**
     * The first DOM node in the range of nodes that make up the view.
     */
    firstChild: Node;
    /**
     * The last DOM node in the range of nodes that make up the view.
     */
    lastChild: Node;
    /**
     * Constructs an instance of HTMLView.
     * @param fragment - The html fragment that contains the nodes for this view.
     * @param behaviors - The behaviors to be applied to this view.
     */
    constructor(fragment: DocumentFragment, behaviors: Behavior[]);
    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node - The parent node to append the view's DOM nodes to.
     */
    appendTo(node: Node): void;
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
    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the behaviors within.
     */
    bind(source: unknown, context: ExecutionContext): void;
    /**
     * Unbinds a view's behaviors from its binding source.
     */
    unbind(): void;
    /**
     * Efficiently disposes of a contiguous range of synthetic view instances.
     * @param views - A contiguous range of views to be disposed.
     */
    static disposeContiguousBatch(views: SyntheticView[]): void;
}
