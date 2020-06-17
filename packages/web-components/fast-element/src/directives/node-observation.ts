import { Accessor, Observable } from "../observation/observable";
import { emptyArray } from "../interfaces";
import { Behavior } from "./behavior";

/**
 * Options for configuring node observation behavior.
 * @public
 */
export interface NodeBehaviorBehaviorOptions<T = any> {
    /**
     * The property to assign the observed nodes to.
     */
    property: T;

    /**
     * Filters nodes that are synced with the property.
     * Called one time for each element in the array.
     * @param value - The Node that is being inspected.
     * @param index - The index of the node within the array.
     * @param array - The Node array that is being filtered.
     */
    filter?(value: Node, index: number, array: Node[]): boolean;
}

/**
 * Creates a function that can be used to filter a Node array, selecting only elements.
 * @param tagName - An optional tag name to restrict the filter to.
 * @public
 */
export function elements(tagName?: string) {
    if (tagName) {
        tagName = tagName.toUpperCase();

        return function (value: Node, index: number, array: Node[]): boolean {
            return value.nodeType === 1 && (value as HTMLElement).tagName === tagName;
        };
    }

    return function (value: Node, index: number, array: Node[]): boolean {
        return value.nodeType === 1;
    };
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
     * Creates an instance of NodeObservationBehavior.
     * @param target - The target to assign the nodes property on.
     * @param options - The options to use in configuring node observation.
     */
    constructor(protected target: HTMLElement, protected options: T) {}

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
        this.updateTarget(this.computeNodes());

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
        this.updateTarget(this.computeNodes());
    }

    private computeNodes() {
        let nodes = this.getNodes();

        if (this.options.filter !== void 0) {
            nodes = nodes.filter(this.options.filter!);
        }

        return nodes;
    }

    private updateTarget(value: ReadonlyArray<any>): void {
        this.source[this.options.property] = value;
    }
}
