import type { Constructable, Mutable } from "../interfaces.js";
import type { Behavior } from "../observation/behavior.js";
import type { Binding, ExecutionContext } from "../observation/observable.js";
import { createTypeRegistry } from "../platform.js";
import { Markup } from "./markup.js";

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
export interface ViewBehavior<TSource = any, TParent = any> {
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(
        source: TSource,
        context: ExecutionContext<TParent>,
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
        context: ExecutionContext<TParent>,
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
     * The unique id of the factory.
     */
    id: string;

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    nodeId: string;

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    createBehavior(targets: ViewBehaviorTargets): Behavior | ViewBehavior;
}

/**
 * Used to add behavior factories when constructing templates.
 * @public
 */
export type AddViewBehaviorFactory = (factory: ViewBehaviorFactory) => string;

/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
export interface HTMLDirective {
    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    createHTML(add: AddViewBehaviorFactory): string;
}

/**
 * Represents metadata configuration for an HTMLDirective.
 * @public
 */
export interface PartialHTMLDirectiveDefinition {
    /**
     * Indicates whether the directive needs access to template contextual information
     * such as the sourceAspect, targetAspect, and aspectType.
     */
    aspected?: boolean;
}

/**
 * Defines metadata for an HTMLDirective.
 * @public
 */
export interface HTMLDirectiveDefinition<
    TType extends Constructable<HTMLDirective> = Constructable<HTMLDirective>
> extends Required<PartialHTMLDirectiveDefinition> {
    /**
     * The type that the definition provides metadata for.
     */
    readonly type: TType;
}

const registry = createTypeRegistry<HTMLDirectiveDefinition>();

/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
export const HTMLDirective = Object.freeze({
    getForInstance: registry.getForInstance,
    getByType: registry.getByType,
    define<TType extends Constructable<HTMLDirective>>(
        type: TType,
        options?: PartialHTMLDirectiveDefinition
    ): TType {
        options = options || {};
        (options as Mutable<HTMLDirectiveDefinition>).type = type;
        registry.register(options as HTMLDirectiveDefinition);
        return type;
    },
});

/**
 * Decorator: Defines an HTMLDirective.
 * @param options - Provides options that specify the directives application.
 * @public
 */
export function htmlDirective(options?: PartialHTMLDirectiveDefinition) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Constructable<HTMLDirective>) {
        HTMLDirective.define(type, options);
    };
}

/**
 * The type of HTML aspect to target.
 * @public
 */
export const Aspect = Object.freeze({
    /**
     * Not aspected.
     */
    none: 0,

    /**
     * An attribute.
     */
    attribute: 1,

    /**
     * A boolean attribute.
     */
    booleanAttribute: 2,

    /**
     * A property.
     */
    property: 3,

    /**
     * Content
     */
    content: 4,

    /**
     * A token list.
     */
    tokenList: 5,

    /**
     * An event.
     */
    event: 6,

    /**
     *
     * @param directive - The directive to assign the aspect to.
     * @param value - The value to base the aspect determination on.
     */
    assign(directive: Aspected, value: string): void {
        directive.sourceAspect = value;

        if (!value) {
            return;
        }

        switch (value[0]) {
            case ":":
                directive.targetAspect = value.substring(1);
                switch (directive.targetAspect) {
                    case "innerHTML":
                        directive.aspectType = Aspect.property;
                        break;
                    case "classList":
                        directive.aspectType = Aspect.tokenList;
                        break;
                    default:
                        directive.aspectType = Aspect.property;
                        break;
                }
                break;
            case "?":
                directive.targetAspect = value.substring(1);
                directive.aspectType = Aspect.booleanAttribute;
                break;
            case "@":
                directive.targetAspect = value.substring(1);
                directive.aspectType = Aspect.event;
                break;
            default:
                if (value === "class") {
                    directive.targetAspect = "className";
                    directive.aspectType = Aspect.property;
                } else {
                    directive.targetAspect = value;
                    directive.aspectType = Aspect.attribute;
                }
                break;
        }
    },
});

/**
 * Represents something that applies to a specific aspect of the DOM.
 * @public
 */
export interface Aspected {
    /**
     * The original source aspect exactly as represented in markup.
     */
    sourceAspect: string;

    /**
     * The evaluated target aspect, determined after processing the source.
     */
    targetAspect: string;

    /**
     * The type of aspect to target.
     */
    aspectType: number;

    /**
     * A binding if one is associated with the aspect.
     */
    binding?: Binding;
}

/**
 * A base class used for attribute directives that don't need internal state.
 * @public
 */
export abstract class StatelessAttachedAttributeDirective<T>
    implements HTMLDirective, ViewBehaviorFactory, ViewBehavior {
    /**
     * The unique id of the factory.
     */
    id: string;

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    nodeId: string;

    /**
     * Creates an instance of RefDirective.
     * @param options - The options to use in configuring the directive.
     */
    public constructor(protected options: T) {}

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
    public createHTML(add: AddViewBehaviorFactory): string {
        return Markup.attribute(add(this));
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
