import { AttachedBehaviorHTMLDirective } from "./html-directive";
import { NodeBehaviorOptions, NodeObservationBehavior } from "./node-observation";
import type { CaptureType } from "./template";

/**
 * The options used to configure child list observation.
 * @public
 */
export interface ChildListBehaviorOptions<T = any>
    extends NodeBehaviorOptions<T>,
        Omit<MutationObserverInit, "subtree" | "childList"> {}

/**
 * The options used to configure subtree observation.
 * @public
 */
export interface SubtreeBehaviorOptions<T = any>
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
export type ChildrenBehaviorOptions<T = any> =
    | ChildListBehaviorOptions<T>
    | SubtreeBehaviorOptions<T>;

/**
 * The runtime behavior for child node observation.
 * @public
 */
export class ChildrenBehavior extends NodeObservationBehavior<ChildrenBehaviorOptions> {
    private observer: MutationObserver | null = null;

    /**
     * Creates an instance of ChildrenBehavior.
     * @param target - The element target to observe children on.
     * @param options - The options to use when observing the element children.
     */
    public constructor(target: HTMLElement, options: ChildrenBehaviorOptions) {
        super(target, options);
        (options as MutationObserverInit).childList = true;
    }

    /**
     * Begins observation of the nodes.
     */
    public observe(): void {
        if (this.observer === null) {
            this.observer = new MutationObserver(this.handleEvent.bind(this));
        }

        this.observer.observe(this.target, this.options);
    }

    /**
     * Disconnects observation of the nodes.
     */
    public disconnect(): void {
        this.observer!.disconnect();
    }

    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    protected getNodes(): ChildNode[] {
        if ("subtree" in this.options) {
            return Array.from(this.target.querySelectorAll(this.options.selector));
        }

        return Array.from(this.target.childNodes);
    }
}

/**
 * A directive that observes the `childNodes` of an element and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure child node observation.
 * @public
 */
export function children<T = any>(
    propertyOrOptions: (keyof T & string) | ChildrenBehaviorOptions<keyof T & string>
): CaptureType<T> {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = {
            property: propertyOrOptions,
        };
    }

    return new AttachedBehaviorHTMLDirective(
        "fast-children",
        ChildrenBehavior,
        propertyOrOptions as any
    );
}
