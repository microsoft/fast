import { DOM, nextId } from "../dom";
import type { Behavior } from "../observation/behavior";
import type { Binding, ExecutionContext } from "../observation/observable";

/**
 * The target nodes available to a behavior.
 * @public
 */
export type ViewBehaviorTargets = {
    [id: string]: Node;
};

/**
 * Represents an object that can contribute behavior to a view.
 * @public
 */
export interface ViewBehavior<TSource = any, TParent = any, TGrandparent = any> {
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(
        source: TSource,
        context: ExecutionContext<TParent, TGrandparent>,
        targets: ViewBehaviorTargets
    ): void;

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(
        source: TSource,
        context: ExecutionContext<TParent, TGrandparent>,
        targets: ViewBehaviorTargets
    ): void;
}

/**
 * A factory that can create a {@link Behavior} associated with a particular
 * location within a DOM fragment.
 * @public
 */
export interface ViewBehaviorFactory {
    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    targetId: string;

    /**
     * Creates a behavior.
     * @param target - The targets available for behaviors to be attached to.
     */
    createBehavior(targets: ViewBehaviorTargets): Behavior | ViewBehavior;
}

/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
export abstract class HTMLDirective implements ViewBehaviorFactory {
    /**
     * The structural id of the directive based on the DOM node
     * that it applies to.
     */
    public targetId: string = "h";

    /**
     * The unique id of the directive instance.
     */
    public uniqueId: string = nextId();

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     */
    public abstract createPlaceholder(index: number): string;

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    public abstract createBehavior(targets: ViewBehaviorTargets): Behavior | ViewBehavior;
}

/**
 * A {@link HTMLDirective} that targets a particular aspect
 * (attribute, property, event, etc.) of a node.
 * @public
 */
export abstract class AspectedHTMLDirective extends HTMLDirective {
    abstract setAspect(value: string): void;

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     */
    public createPlaceholder: (index: number) => string =
        DOM.createInterpolationPlaceholder;
}

export abstract class InlinableHTMLDirective extends AspectedHTMLDirective {
    abstract binding: Binding;
    abstract rawAspect?: string;
}

/** @internal */
export abstract class StatelessAttachedAttributeDirective<T> extends HTMLDirective
    implements ViewBehavior {
    /**
     * Creates an instance of RefDirective.
     * @param options - The options to use in configuring the directive.
     */
    public constructor(protected options: T) {
        super();
    }

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
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
    abstract bind(
        source: any,
        context: ExecutionContext,
        targets: ViewBehaviorTargets
    ): void;

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    abstract unbind(
        source: any,
        context: ExecutionContext,
        targets: ViewBehaviorTargets
    ): void;
}
