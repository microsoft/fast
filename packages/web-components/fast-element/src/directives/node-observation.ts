import { Accessor, Observable } from "../observation/observable";
import { emptyArray } from "../interfaces";
import { Behavior } from "./behavior";

/**
 * Options for configuring node observation behavior.
 */
export interface NodeBehaviorBehaviorOptions<T = any> {
    /**
     * The property to assign the observed nodes to.
     */
    property: T;
}

/**
 * A base class for node observation.
 * @internal
 */
export abstract class NodeObservationBehavior<T extends NodeBehaviorBehaviorOptions>
    implements Behavior {
    private source: any = null;
    private shouldUpdate!: boolean;

    /**
     *
     * @param target - The target to assign the nodes property on.
     * @param options - The options to use in configuring node observation.
     */
    constructor(protected target: HTMLSlotElement, protected options: T) {}

    /**
     * Begins observation of the nodes.
     */
    public abstract observe(): void;

    /**
     * Disconnects observation of the nodes.
     */
    public abstract disconnect(): void;

    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    protected abstract getNodes(): Node[];

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    public bind(source: any): void {
        const name = this.options.property;
        this.shouldUpdate = Observable.getAccessors(source).some(
            (x: Accessor) => x.name === name
        );
        this.source = source;
        this.updateTarget(this.getNodes());

        if (this.shouldUpdate) {
            this.observe();
        }
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    public unbind(): void {
        this.updateTarget(emptyArray);
        this.source = null;

        if (this.shouldUpdate) {
            this.disconnect();
        }
    }

    /** @internal */
    public handleEvent(): void {
        this.updateTarget(this.getNodes());
    }

    private updateTarget(value: ReadonlyArray<any>): void {
        this.source[this.options.property] = value;
    }
}
