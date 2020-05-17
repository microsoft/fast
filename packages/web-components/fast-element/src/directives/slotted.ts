import { CaptureType } from "../template";
import { AttachedBehaviorDirective } from "./directive";
import { NodeBehaviorBehaviorOptions, NodeObservationBehavior } from "./node-observation";

export interface SlottedBehaviorOptions<T = any>
    extends NodeBehaviorBehaviorOptions<T>,
        AssignedNodesOptions {}

export class SlottedBehavior extends NodeObservationBehavior<SlottedBehaviorOptions> {
    constructor(target: HTMLSlotElement, options: SlottedBehaviorOptions) {
        super(target, options);
    }

    getNodes(): Node[] {
        return this.target.assignedNodes(this.options);
    }

    observe(): void {
        this.target.addEventListener("slotchange", this);
    }

    unobserve(): void {
        this.target.removeEventListener("slotchange", this);
    }
}

export function slotted<T = any>(
    propertyOrOptions: (keyof T & string) | SlottedBehaviorOptions<keyof T & string>
): CaptureType<T> {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = { property: propertyOrOptions };
    }

    return new AttachedBehaviorDirective(
        "fast-slotted",
        SlottedBehavior,
        propertyOrOptions as any
    );
}
