import { Observable } from "../observation/observable";
import { emptyArray } from "../platform";
/**
 * Creates a function that can be used to filter a Node array, selecting only elements.
 * @param selector - An optional selector to restrict the filter to.
 * @public
 */
export function elements(selector) {
    if (selector) {
        return function (value, index, array) {
            return value.nodeType === 1 && value.matches(selector);
        };
    }
    return function (value, index, array) {
        return value.nodeType === 1;
    };
}
/**
 * A base class for node observation.
 * @internal
 */
export class NodeObservationBehavior {
    /**
     * Creates an instance of NodeObservationBehavior.
     * @param target - The target to assign the nodes property on.
     * @param options - The options to use in configuring node observation.
     */
    constructor(target, options) {
        this.target = target;
        this.options = options;
        this.source = null;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source) {
        const name = this.options.property;
        this.shouldUpdate = Observable.getAccessors(source).some(x => x.name === name);
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
    unbind() {
        this.updateTarget(emptyArray);
        this.source = null;
        if (this.shouldUpdate) {
            this.disconnect();
        }
    }
    /** @internal */
    handleEvent() {
        this.updateTarget(this.computeNodes());
    }
    computeNodes() {
        let nodes = this.getNodes();
        if (this.options.filter !== void 0) {
            nodes = nodes.filter(this.options.filter);
        }
        return nodes;
    }
    updateTarget(value) {
        this.source[this.options.property] = value;
    }
}
