import { DOMAspect, DOMPolicy } from "../dom.js";
import type { Constructable, Mutable } from "../interfaces.js";
import type { Binding } from "../binding/binding.js";
import type { ExpressionController } from "../observation/observable.js";
import { createTypeRegistry, makeSerializationNoop } from "../platform.js";
import { Markup } from "./markup.js";

/**
 * The target nodes available to a behavior.
 * @public
 */
export type ViewBehaviorTargets = {
    [id: string]: Node;
};

/**
 * Controls the lifecycle of a view and provides relevant context.
 * @public
 */
export interface ViewController<TSource = any, TParent = any>
    extends ExpressionController<TSource, TParent> {
    /**
     * The parts of the view that are targeted by view behaviors.
     */
    readonly targets: ViewBehaviorTargets;
}

/**
 * Represents an object that can contribute behavior to a view.
 * @public
 */
export interface ViewBehavior<TSource = any, TParent = any> {
    /**
     * Bind this behavior.
     * @param controller - The view controller that manages the lifecycle of this behavior.
     */
    bind(controller: ViewController<TSource, TParent>): void;
}

/**
 * A factory that can create a {@link ViewBehavior} associated with a particular
 * location within a DOM fragment.
 * @public
 */
export interface ViewBehaviorFactory {
    /**
     * The unique id of the factory.
     */
    id?: string;

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    targetNodeId?: string;

    /**
     * The tag name of the DOM node to which the created behavior will apply.
     */
    targetTagName?: string | null;

    /**
     * The policy that the created behavior must run under.
     */
    policy?: DOMPolicy;

    /**
     * Creates a behavior.
     */
    createBehavior(): ViewBehavior;
}

/**
 * Represents a ViewBehaviorFactory after the compilation process has completed.
 * @public
 */
export type CompiledViewBehaviorFactory = Required<ViewBehaviorFactory>;

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
    aspectType: DOMAspect;

    /**
     * A binding if one is associated with the aspect.
     */
    dataBinding?: Binding;
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
    /**
     * Gets the directive definition associated with the instance.
     * @param instance - The directive instance to retrieve the definition for.
     */
    getForInstance: registry.getForInstance,

    /**
     * Gets the directive definition associated with the specified type.
     * @param type - The directive type to retrieve the definition for.
     */
    getByType: registry.getByType,

    /**
     * Defines an HTMLDirective based on the options.
     * @param type - The type to define as a directive.
     * @param options - Options that specify the directive's application.
     */
    define<TType extends Constructable<HTMLDirective>>(
        type: TType,
        options?: PartialHTMLDirectiveDefinition
    ): TType {
        options = options || {};
        (options as Mutable<HTMLDirectiveDefinition>).type = type;
        registry.register(options as HTMLDirectiveDefinition);
        return type;
    },

    /**
     *
     * @param directive - The directive to assign the aspect to.
     * @param value - The value to base the aspect determination on.
     * @remarks
     * If a falsy value is provided, then the content aspect will be assigned.
     */
    assignAspect(directive: Aspected, value?: string): void {
        if (!value) {
            directive.aspectType = DOMAspect.content;
            return;
        }

        directive.sourceAspect = value;

        switch (value[0]) {
            case ":":
                directive.targetAspect = value.substring(1);
                directive.aspectType =
                    directive.targetAspect === "classList"
                        ? DOMAspect.tokenList
                        : DOMAspect.property;
                break;
            case "?":
                directive.targetAspect = value.substring(1);
                directive.aspectType = DOMAspect.booleanAttribute;
                break;
            case "@":
                directive.targetAspect = value.substring(1);
                directive.aspectType = DOMAspect.event;
                break;
            default:
                directive.targetAspect = value;
                directive.aspectType = DOMAspect.attribute;
                break;
        }
    },
});

/**
 * Decorator: Defines an HTMLDirective.
 * @param options - Provides options that specify the directive's application.
 * @public
 */
export function htmlDirective(options?: PartialHTMLDirectiveDefinition) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Constructable<HTMLDirective>) {
        HTMLDirective.define(type, options);
    };
}

/**
 * A base class used for attribute directives that don't need internal state.
 * @public
 */
export abstract class StatelessAttachedAttributeDirective<TOptions>
    implements HTMLDirective, ViewBehaviorFactory, ViewBehavior
{
    /**
     * Creates an instance of RefDirective.
     * @param options - The options to use in configuring the directive.
     */
    public constructor(protected options: TOptions) {}

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
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    public createBehavior(): ViewBehavior {
        return this;
    }

    /**
     * Bind this behavior.
     * @param controller - The view controller that manages the lifecycle of this behavior.
     */
    public abstract bind(controller: ViewController): void;
}

makeSerializationNoop(StatelessAttachedAttributeDirective);
