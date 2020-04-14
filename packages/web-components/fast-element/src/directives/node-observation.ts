import { Observable } from "../observation/observable";
import { emptyArray } from "../interfaces";
import { Behavior } from "./behavior";

export interface NodeBehaviorBehaviorOptions<T = any> {
    property: T;
}

export abstract class NodeObservationBehavior<T extends NodeBehaviorBehaviorOptions>
    implements Behavior {
    private source: any = null;
    private shouldUpdate!: boolean;

    constructor(protected target: HTMLSlotElement, protected options: T) {}

    abstract observe(): void;
    abstract unobserve(): void;
    abstract getNodes(): Node[];

    bind(source: any): void {
        this.shouldUpdate =
            Observable.getObservedProperties(source).indexOf(this.options.property) !==
            -1;
        this.source = source;
        this.updateTarget(this.getNodes());

        if (this.shouldUpdate) {
            this.observe();
        }
    }

    unbind(): void {
        this.updateTarget(emptyArray);
        this.source = null;

        if (this.shouldUpdate) {
            this.unobserve();
        }
    }

    handleEvent(): void {
        this.updateTarget(this.getNodes());
    }

    updateTarget(value: ReadonlyArray<any>): void {
        this.source[this.options.property] = value;
    }
}
