import { isString, noop } from "../interfaces.js";
import { HTMLDirective } from "./html-directive.js";
import { NodeBehaviorOptions, NodeObservationDirective } from "./node-observation.js";
import type { CaptureType } from "./template.js";

/**
 * The options used to configure child list observation.
 * @public
 */
export interface ChildListDirectiveOptions<T = any>
    extends NodeBehaviorOptions<T>,
        Omit<MutationObserverInit, "subtree" | "childList"> {}

/**
 * The options used to configure subtree observation.
 * @public
 */
export interface SubtreeDirectiveOptions<T = any>
    extends NodeBehaviorOptions<T>,
        Omit<MutationObserverInit, "subtree" | "childList"> {
    /**
     * Indicates that child subtrees should be observed for changes.
     */
    subtree: boolean;

    /**
     * When subtrees are observed, a query selector is required to indicate
     * which of potentially many nodes should be assigned to the property.
     */
    selector: string;
}

/**
 * The options used to configure child/subtree node observation.
 * @public
 */
export type ChildrenDirectiveOptions<T = any> =
    | ChildListDirectiveOptions<T>
    | SubtreeDirectiveOptions<T>;

/**
 * The runtime behavior for child node observation.
 * @public
 */
export class ChildrenDirective extends NodeObservationDirective<ChildrenDirectiveOptions> {
    private observerProperty = Symbol();

    /**
     * Creates an instance of ChildrenDirective.
     * @param options - The options to use in configuring the child observation behavior.
     */
    constructor(options: ChildrenDirectiveOptions) {
        super(options);
        (options as MutationObserverInit).childList = true;
    }

    /**
     * Begins observation of the nodes.
     * @param target - The target to observe.
     */
    observe(target: any): void {
        let observer = target[this.observerProperty];

        if (!observer) {
            observer = new MutationObserver(this.handleEvent);
            observer.toJSON = noop;
            target[this.observerProperty] = observer;
        }

        observer.target = target;
        observer.observe(target, this.options);
    }

    /**
     * Disconnects observation of the nodes.
     * @param target - The target to unobserve.
     */
    disconnect(target: any): void {
        const observer = target[this.observerProperty];
        observer.target = null;
        observer.disconnect();
    }

    /**
     * Retrieves the raw nodes that should be assigned to the source property.
     * @param target - The target to get the node to.
     */
    getNodes(target: Element): Node[] {
        if ("selector" in this.options) {
            return Array.from(target.querySelectorAll(this.options.selector));
        }

        return Array.from(target.childNodes);
    }

    private handleEvent = (mutations: MutationRecord[], observer: any): void => {
        const target = observer.target;
        this.updateTarget(this.getSource(target), this.computeNodes(target));
    };
}

HTMLDirective.define(ChildrenDirective);

/**
 * A directive that observes the `childNodes` of an element and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure child node observation.
 * @public
 */
export function children<TSource = any, TParent = any>(
    propertyOrOptions:
        | (keyof TSource & string)
        | ChildrenDirectiveOptions<keyof TSource & string>
): CaptureType<TSource, TParent> {
    if (isString(propertyOrOptions)) {
        propertyOrOptions = {
            property: propertyOrOptions,
        };
    }

    return new ChildrenDirective(propertyOrOptions);
}
