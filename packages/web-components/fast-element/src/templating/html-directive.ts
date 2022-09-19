import type { HostBehavior } from "../index.js";
import type { Constructable, Mutable } from "../interfaces.js";
import type { Subscriber } from "../observation/notifier.js";
import {
    ExecutionContext,
    Expression,
    ExpressionController,
    ExpressionObserver,
} from "../observation/observable.js";
import { createTypeRegistry } from "../platform.js";
import type { HostController } from "../styles/host.js";
import { Markup, nextId } from "./markup.js";

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
 * Bridges between ViewBehaviors and HostBehaviors, enabling a host to
 * control ViewBehaviors.
 * @public
 */
export interface ViewBehaviorOrchestrator<TSource = any, TParent = any>
    extends ViewController<TSource, TParent>,
        HostBehavior<TSource> {
    /**
     *
     * @param nodeId - The structural id of the DOM node to which a behavior will apply.
     * @param target - The DOM node associated with the id.
     */
    addTarget(nodeId: string, target: Node): void;

    /**
     * Adds a behavior.
     * @param behavior - The behavior to add.
     */
    addBehavior(behavior: ViewBehavior): void;

    /**
     * Adds a behavior factory.
     * @param factory - The behavior factory to add.
     * @param target - The target the factory will create behaviors for.
     */
    addBehaviorFactory(factory: ViewBehaviorFactory, target: Node): void;
}

/**
 * Bridges between ViewBehaviors and HostBehaviors, enabling a host to
 * control ViewBehaviors.
 * @public
 */
export const ViewBehaviorOrchestrator = Object.freeze({
    /**
     * Creates a ViewBehaviorOrchestrator.
     * @param source - The source to to associate behaviors with.
     * @returns A ViewBehaviorOrchestrator.
     */
    create<TSource = any, TParent = any>(
        source: TSource
    ): ViewBehaviorOrchestrator<TSource, TParent> {
        const behaviors: ViewBehavior[] = [];
        const targets: ViewBehaviorTargets = {};
        let unbindables: { unbind(controller: ViewController<TSource>) }[] | null = null;
        let isConnected = false;

        return {
            source,
            context: ExecutionContext.default,
            targets,
            get isBound() {
                return isConnected;
            },
            addBehaviorFactory(factory: ViewBehaviorFactory, target: Node): void {
                const nodeId = factory.nodeId || (factory.nodeId = nextId());
                factory.id || (factory.id = nextId());
                this.addTarget(nodeId, target);
                this.addBehavior(factory.createBehavior());
            },
            addTarget(nodeId: string, target: Node) {
                targets[nodeId] = target;
            },
            addBehavior(behavior: ViewBehavior): void {
                behaviors.push(behavior);

                if (isConnected) {
                    behavior.bind(this);
                }
            },
            onUnbind(unbindable: { unbind(controller: ViewController<TSource>) }) {
                if (unbindables === null) {
                    unbindables = [];
                }

                unbindables.push(unbindable);
            },
            connectedCallback(controller: HostController<TSource>) {
                if (!isConnected) {
                    isConnected = true;
                    behaviors.forEach(x => x.bind(this));
                }
            },
            disconnectedCallback(controller: HostController<TSource>) {
                if (isConnected) {
                    isConnected = false;

                    if (unbindables !== null) {
                        unbindables.forEach(x => x.unbind(this));
                    }
                }
            },
        };
    },
});

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
    id: string;

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    nodeId: string;

    /**
     * Creates a behavior.
     */
    createBehavior(): ViewBehavior;
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
 * Captures a binding expression along with related information and capabilities.
 *
 * @public
 */
export abstract class Binding<TSource = any, TReturn = any, TParent = any> {
    /**
     * Options associated with the binding.
     */
    options?: any;

    /**
     * Creates a binding.
     * @param evaluate - Evaluates the binding.
     * @param isVolatile - Indicates whether the binding is volatile.
     */
    public constructor(
        public evaluate: Expression<TSource, TReturn, TParent>,
        public isVolatile: boolean = false
    ) {}

    /**
     * Creates an observer capable of notifying a subscriber when the output of a binding changes.
     * @param directive - The HTML Directive to create the observer for.
     * @param subscriber - The subscriber to changes in the binding.
     */
    abstract createObserver(
        directive: HTMLDirective,
        subscriber: Subscriber
    ): ExpressionObserver<TSource, TReturn, TParent>;
}

/**
 * The type of HTML aspect to target.
 * @public
 */
export const Aspect = Object.freeze({
    /**
     * Not aspected.
     */
    none: 0 as const,

    /**
     * An attribute.
     */
    attribute: 1 as const,

    /**
     * A boolean attribute.
     */
    booleanAttribute: 2 as const,

    /**
     * A property.
     */
    property: 3 as const,

    /**
     * Content
     */
    content: 4 as const,

    /**
     * A token list.
     */
    tokenList: 5 as const,

    /**
     * An event.
     */
    event: 6 as const,

    /**
     *
     * @param directive - The directive to assign the aspect to.
     * @param value - The value to base the aspect determination on.
     * @remarks
     * If a falsy value is provided, then the content aspect will be assigned.
     */
    assign(directive: Aspected, value?: string): void {
        if (!value) {
            directive.aspectType = Aspect.content;
            return;
        }

        directive.sourceAspect = value;

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
} as const);

/**
 * The type of HTML aspect to target.
 * @public
 */
export type Aspect = typeof Aspect[Exclude<keyof typeof Aspect, "assign" | "none">];

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
    aspectType: Aspect;

    /**
     * A binding if one is associated with the aspect.
     */
    dataBinding?: Binding;
}

/**
 * A base class used for attribute directives that don't need internal state.
 * @public
 */
export abstract class StatelessAttachedAttributeDirective<TOptions>
    implements HTMLDirective, ViewBehaviorFactory, ViewBehavior {
    /**
     * The unique id of the factory.
     */
    public id: string = nextId();

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    public nodeId: string;

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
