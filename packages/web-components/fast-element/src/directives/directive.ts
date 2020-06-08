import { DOM } from "../dom";
import { Behavior, BehaviorFactory } from "./behavior";

/**
 * Instructs the template engine to apply behavior to a node.
 */
export abstract class Directive implements BehaviorFactory {
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
 * Describes the shape of a behavior constructor that can be created by
 * an {@link AttachedBehaviorDirective}.
 */
export type AttachedBehaviorType<T = any> = new (target: any, options: T) => Behavior;

/**
 * A directive that attaches special behavior to an element via a custom attribute.
 */
export class AttachedBehaviorDirective<T = any> extends Directive {
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
