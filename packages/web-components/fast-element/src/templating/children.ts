import { isString } from "../interfaces";
import { NodeObservationDirective, NodeBehaviorOptions } from "./node-observation";
import type { CaptureType } from "./template";

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
    extends Omit<NodeBehaviorOptions<T>, "filter">,
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
export class ChildrenDirective extends NodeObservationDirective<
    ChildrenDirectiveOptions
> {
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
    observe(target: any) {
        const observerId = `${this.targetId}-observer`;
        const observer =
            target[observerId] ??
            (target[observerId] = new MutationObserver(this.handleEvent));
        observer.$fastTarget = target;
        observer.observe(target, this.options);
    }

    /**
     * Disconnects observation of the nodes.
     * @param target - The target to unobserve.
     */
    disconnect(target: any) {
        const observerId = `${this.targetId}-observer`;
        const observer = target[observerId];
        observer.$fastTarget = null;
        observer.disconnect();
    }

    /**
     * Retrieves the raw nodes that should be assigned to the source property.
     * @param target - The target to get the node to.
     */
    getNodes(target: Element): Node[] {
        if ("subtree" in this.options) {
            return Array.from(target.querySelectorAll(this.options.selector));
        }

        return Array.from(target.childNodes);
    }

    private handleEvent = (mutations: MutationRecord[], observer: any): void => {
        const target = observer.$fastTarget;
        const source = target.$fastSource;
        this.updateTarget(source, this.computeNodes(target));
    };
}

/**
 * A directive that observes the `childNodes` of an element and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure child node observation.
 * @public
 */
export function children<T = any>(
    propertyOrOptions: (keyof T & string) | ChildListDirectiveOptions<keyof T & string>
): CaptureType<T> {
    if (isString(propertyOrOptions)) {
        propertyOrOptions = {
            property: propertyOrOptions,
        };
    }

    return new ChildrenDirective(
        propertyOrOptions as ChildListDirectiveOptions<keyof T & string>
    );
}
