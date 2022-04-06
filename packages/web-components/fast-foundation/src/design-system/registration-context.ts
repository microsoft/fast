import type {
    Constructable,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import type { Container } from "../di/di.js";
import type { ComponentPresentation } from "./component-presentation.js";

/**
 * Enables defining an element within the context of a design system.
 * @public
 */
export type ContextualElementDefinition = Omit<PartialFASTElementDefinition, "name">;

/**
 * The design system context in which an element can be defined.
 * @public
 */
export interface ElementDefinitionContext {
    /**
     * The name that the element will be defined as.
     * @public
     */
    readonly name: string;

    /**
     * The type that will be defined.
     * @public
     */
    readonly type: Constructable;

    /**
     * The dependency injection container associated with the design system.
     * @public
     */
    readonly container: Container;

    /**
     * Indicates whether or not a platform define call will be made in order
     * to define the element.
     * @public
     */
    readonly willDefine: boolean;

    /**
     * The shadow root mode specified by the design system's configuration.
     * @public
     */
    readonly shadowRootMode: ShadowRootMode | undefined;

    /**
     * Defines the element.
     * @param definition - The definition for the element.
     * @public
     */
    defineElement(definition?: ContextualElementDefinition): void;

    /**
     * Defines a presentation for the element.
     * @param presentation - The presentation configuration.
     * @public
     */
    definePresentation(presentation: ComponentPresentation): void;

    /**
     * Returns the HTML element tag name that the type will be defined as.
     * @param type - The type to lookup.
     * @public
     */
    tagFor(type: Constructable): string;
}

/**
 * The callback type that is invoked when an element can be defined by a design system.
 * @public
 */
export type ElementDefinitionCallback = (ctx: ElementDefinitionContext) => void;

/**
 * The element definition context interface. Designed to be used in `tryDefineElement`
 * @public
 */
export interface ElementDefinitionParams
    extends Pick<ElementDefinitionContext, "name" | "type"> {
    /**
     * FAST actual base class instance.
     * @public
     */
    readonly baseClass?: Constructable;
    /**
     * A callback to invoke if definition will happen.
     * @public
     */
    callback: ElementDefinitionCallback;
}

/**
 * Design system contextual APIs and configuration usable within component
 * registries.
 * @public
 */
export interface DesignSystemRegistrationContext {
    /**
     * The element prefix specified by the design system's configuration.
     * @public
     */
    readonly elementPrefix: string;

    /**
     * Used to attempt to define a custom element.
     * @param name - The name of the element to define.
     * @param type - The type of the constructor to use to define the element.
     * @param callback - A callback to invoke if definition will happen.
     * @public
     * @deprecated - Use the signature with the ElementDefinitionParams param type instead
     */
    tryDefineElement(
        name: string,
        type: Constructable,
        callback: ElementDefinitionCallback
    ): void;

    /**
     * Used to attempt to define a custom element.
     * @param params - The custom element definition.
     * @public
     */
    tryDefineElement(params: ElementDefinitionParams): void;
}
