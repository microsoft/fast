import type { CaptureType } from "./template";
import { HTMLDirective, ViewBehavior, ViewBehaviorTargets } from "./html-directive";
import type { ExecutionContext } from "../observation/observable";
import { DOM } from "../dom";

/**
 * The runtime behavior for template references.
 * @public
 */
export class RefDirective extends HTMLDirective implements ViewBehavior {
    /**
     * Creates an instance of RefDirective.
     * @param propertyName - The name of the property to assign the reference to.
     */
    public constructor(private propertyName: string) {
        super();
    }

    /**
     * Creates a behavior.
     */
    createBehavior() {
        return this;
    }

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     * @remarks
     * Creates a custom attribute placeholder.
     */
    public createPlaceholder(index: number): string {
        return DOM.createCustomAttributePlaceholder(index);
    }

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
        source[this.propertyName] = targets[this.targetId];
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    public unbind(): void {}
}

/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
export function ref<T = any>(propertyName: keyof T & string): CaptureType<T> {
    return new RefDirective(propertyName);
}
