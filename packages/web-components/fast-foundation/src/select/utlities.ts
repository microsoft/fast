import { AttachedBehaviorDirective, CaptureType, ChildrenBehavior, ChildrenBehaviorOptions } from "@microsoft/fast-element";

/**
 * The options used to configure subtree observation.
 * @public
 */
export interface SubtreeBehaviorOptions<T = any>
    extends ChildrenBehaviorOptions<T>,
        MutationObserverInit {
            selector: string;
        }

/**
 * The runtime behavior for subtree observation.
 * @public
 */
export class SubtreeBehavior extends ChildrenBehavior {
    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    protected getNodes(): ChildNode[] {
        return Array.from(this.target.querySelectorAll((this.options as SubtreeBehaviorOptions).selector));
    }
}

/**
 * A directive that observes the `subtree` of an element and updates a property
 * whenever the nodes change.
 * @param options - The options used to configure subtree observation.
 * @public
 */
export function subtree<T = any>(
    options: SubtreeBehaviorOptions<keyof T & string>
): CaptureType<T> {
    (options as MutationObserverInit).childList = true;
    (options as MutationObserverInit).subtree = true;

    return new AttachedBehaviorDirective(
        "fast-subtree",
        SubtreeBehavior,
        options as any
    );
}