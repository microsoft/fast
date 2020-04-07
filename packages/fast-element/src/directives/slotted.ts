import { AttachedBehaviorDirective } from "./directive";
import { CaptureType } from "../template";
import { NodeBehaviorBehaviorOptions, NodeObservationBehavior } from "./node-observation";

export interface SlottedBehaviorOptions<T = any>
    extends NodeBehaviorBehaviorOptions<T>,
        AssignedNodesOptions {}

export class SlottedBehavior extends NodeObservationBehavior<SlottedBehaviorOptions> {
    constructor(target: HTMLSlotElement, options: SlottedBehaviorOptions) {
        super(target, options);
    }

    getNodes() {
        return this.target.assignedNodes(this.options);
    }

    observe() {
        this.target.addEventListener("slotchange", this);
    }

    unobserve() {
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
