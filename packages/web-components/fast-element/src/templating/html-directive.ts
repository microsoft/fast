import { DOM } from "../dom";
import type { Behavior } from "../observation/behavior";

/**
 * The target nodes available to a behavior.
 * @public
 */
export type BehaviorTargets = {
    [id: string]: Node;
};

/**
 * A factory that can create a {@link Behavior} associated with a particular
 * location within a DOM fragment.
 * @public
 */
export interface NodeBehaviorFactory {
    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    targetId: string;

    /**
     * Creates a behavior.
     * @param target - The targets available for behaviors to be attached to.
     */
    createBehavior(targets: BehaviorTargets): Behavior;
}

/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
export abstract class HTMLDirective implements NodeBehaviorFactory {
    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    public targetId: string = "h";

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     */
    public abstract createPlaceholder(index: number): string;

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    public abstract createBehavior(targets: BehaviorTargets): Behavior;
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
export type AttachedBehaviorType<T = any> = new (
    targets: BehaviorTargets,
    targetId: string,
    options: T
) => Behavior;

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
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     * @remarks
     * Creates an instance of the `behavior` type this directive was constructed with
     * and passes the targets, targetId, and options to that `behavior`'s constructor.
     */
    public createBehavior(targets: BehaviorTargets): Behavior {
        return new this.behavior(targets, this.targetId, this.options);
    }
}
