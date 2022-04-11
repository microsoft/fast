import type { ExecutionContext } from "../observation/observable.js";
import {
    HTMLDirective,
    StatelessAttachedAttributeDirective,
    ViewBehaviorTargets,
} from "./html-directive.js";
import type { CaptureType } from "./template.js";

/**
 * The runtime behavior for template references.
 * @public
 */
export class RefDirective extends StatelessAttachedAttributeDirective<string> {
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    public bind(
        source: any,
        context: ExecutionContext,
        targets: ViewBehaviorTargets
    ): void {
        source[this.options] = targets[this.nodeId];
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    public unbind(): void {}
}

HTMLDirective.define(RefDirective);

/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
export const ref = <T = any>(propertyName: keyof T & string): CaptureType<T> =>
    new RefDirective(propertyName);
