import { Behavior } from "./behavior";
import { Observable } from "../observation/observable";
import { emptyArray } from "../interfaces";

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

    bind(source: any) {
        this.shouldUpdate =
            Observable.getObservedProperties(source).indexOf(this.options.property) !==
            -1;
        this.source = source;
        this.updateTarget(this.getNodes());

        if (this.shouldUpdate) {
            this.observe();
        }
    }

    unbind() {
        this.updateTarget(emptyArray);
        this.source = null;

        if (this.shouldUpdate) {
            this.unobserve();
        }
    }

    handleEvent() {
        this.updateTarget(this.getNodes());
    }

    updateTarget(value: ReadonlyArray<any>) {
        this.source[this.options.property] = value;
    }
}
