import { AttachedBehaviorHTMLDirective } from "./html-directive";
/**
 * The runtime behavior for template references.
 * @public
 */
export class RefBehavior {
    /**
     * Creates an instance of RefBehavior.
     * @param target - The element to reference.
     * @param propertyName - The name of the property to assign the reference to.
     */
    constructor(target, propertyName) {
        this.target = target;
        this.propertyName = propertyName;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source) {
        source[this.propertyName] = this.target;
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    unbind() {}
}
/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
export function ref(propertyName) {
    return new AttachedBehaviorHTMLDirective("fast-ref", RefBehavior, propertyName);
}
