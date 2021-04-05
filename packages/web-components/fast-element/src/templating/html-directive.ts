import { DOM } from "../dom";
import type { Behavior } from "../observation/behavior";

/**
 * A factory that can create a {@link Behavior} associated with a particular
 * location within a DOM fragment.
 * @public
 */
export interface NodeBehaviorFactory {
    /**
     * The index of the DOM node to which the created behavior will apply.
     */
    targetIndex: number;

    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     */
    createBehavior(target: Node): Behavior;
}

/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
export abstract class HTMLDirective implements NodeBehaviorFactory {
    /**
     * The index of the DOM node to which the created behavior will apply.
     */
    public targetIndex: number = 0;

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     */
    public abstract createPlaceholder(index: number): string;

    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     */
    public abstract createBehavior(target: Node): Behavior;
}

/**
 * A {@link HTMLDirective} that targets a named attribute or property on a node.
 * @public
 */
export abstract class TargetedHTMLDirective extends HTMLDirective {
    /**
     * Gets/sets the name of the attribute or property that this
     * directive is targeting on the associated node.
     */
    public abstract targetName: string | undefined;

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     */
    public createPlaceholder: (index: number) => string =
        DOM.createInterpolationPlaceholder;
}

/**
 * Describes the shape of a behavior constructor that can be created by
 * an {@link AttachedBehaviorHTMLDirective}.
 * @public
 */
export type AttachedBehaviorType<T = any> = new (target: any, options: T) => Behavior;

/**
 * A directive that attaches special behavior to an element via a custom attribute.
 * @public
 */
export class AttachedBehaviorHTMLDirective<T = any> extends HTMLDirective {
    /**
     *
     * @param name - The name of the behavior; used as a custom attribute on the element.
     * @param behavior - The behavior to instantiate and attach to the element.
     * @param options - Options to pass to the behavior during creation.
     */
    public constructor(
        private name: string,
        private behavior: AttachedBehaviorType<T>,
        private options: T
    ) {
        super();
    }

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     * @remarks
     * Creates a custom attribute placeholder.
     */
    public createPlaceholder(index: number): string {
        return DOM.createCustomAttributePlaceholder(this.name, index);
    }

    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     * @remarks
     * Creates an instance of the `behavior` type this directive was constructed with
     * and passes the target and options to that `behavior`'s constructor.
     */
    public createBehavior(target: Node): Behavior {
        return new this.behavior(target, this.options);
    }
}
