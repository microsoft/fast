import { CaptureType } from "../template";
import { AttachedBehaviorDirective } from "./directive";
import { NodeBehaviorBehaviorOptions, NodeObservationBehavior } from "./node-observation";

/**
 * The options used to configure child node observation.
 */
export interface ChildrenBehaviorOptions<T = any>
    extends NodeBehaviorBehaviorOptions<T>,
        MutationObserverInit {}

/**
 * The runtime behavior for child node observation.
 */
export class ChildrenBehavior extends NodeObservationBehavior<ChildrenBehaviorOptions> {
    private observer: MutationObserver | null = null;

    /**
     * Creates an instance of ChildrenBehavior.
     * @param target - The element target to observe children on.
     * @param options - The options to use when observing the element children.
     */
    public constructor(target: HTMLSlotElement, options: ChildrenBehaviorOptions) {
        super(target, options);
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
        return Array.from(this.target.childNodes);
    }
}

/**
 * A directive that observes the `childNodes` of an element and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure child node observation.
 */
export function children<T = any>(
    propertyOrOptions: (keyof T & string) | ChildrenBehaviorOptions<keyof T & string>
): CaptureType<T> {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = {
            property: propertyOrOptions,
            childList: true,
        };
    }

    return new AttachedBehaviorDirective(
        "fast-children",
        ChildrenBehavior,
        propertyOrOptions as any
    );
}
