import type { Behavior } from "../observation/behavior";
import type { CaptureType } from "./template";
/**
 * The runtime behavior for template references.
 * @public
 */
export declare class RefBehavior implements Behavior {
    private target;
    private propertyName;
    /**
     * Creates an instance of RefBehavior.
     * @param target - The element to reference.
     * @param propertyName - The name of the property to assign the reference to.
     */
    constructor(target: HTMLElement, propertyName: string);
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source: any): void;
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind(): void;
}
/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
export declare function ref<T = any>(propertyName: keyof T & string): CaptureType<T>;
