import { Constructable, PartialFASTElementDefinition } from "@microsoft/fast-element";
import { Container, InterfaceSymbol } from "../di/di";
import { ComponentPresentation } from "./component-presentation";
/**
 * Enables defining an element within the context of a design system.
 * @public
 */
export declare type ContextualElementDefinition = Omit<
    PartialFASTElementDefinition,
    "name"
>;
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
export declare type ElementDefinitionCallback = (ctx: ElementDefinitionContext) => void;
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
     */
    tryDefineElement(
        name: string,
        type: Constructable,
        callback: ElementDefinitionCallback
    ): any;
}
/**
 * Design system contextual APIs and configuration usable within component
 * registries.
 * @public
 */
export declare const DesignSystemRegistrationContext: InterfaceSymbol<DesignSystemRegistrationContext>;
/**
 * The callback type that is invoked when two elements are trying to define themselves with
 * the same name.
 * @public
 */
export declare type ElementDisambiguationCallback = (
    nameAttempt: string,
    typeAttempt: Constructable,
    existingType: Constructable
) => string | null;
/**
 * Represents a configurable design system.
 * @public
 */
export interface DesignSystem {
    /**
     * Registers components and services with the design system and the
     * underlying dependency injection container.
     * @param params - The registries to pass to the design system
     * and the underlying dependency injection container.
     * @public
     */
    register(...params: any[]): DesignSystem;
    /**
     * Configures the prefix to add to each custom element name.
     * @param prefix - The prefix to use for custom elements.
     * @public
     */
    withPrefix(prefix: string): DesignSystem;
    /**
     * Overrides the default Shadow DOM mode for custom elements.
     * @param mode - The Shadow DOM mode to use for custom elements.
     * @public
     */
    withShadowRootMode(mode: ShadowRootMode): DesignSystem;
    /**
     * Provides a custom callback capable of resolving scenarios where
     * two different elements request the same element name.
     * @param callback - The disambiguation callback.
     * @public
     */
    withElementDisambiguation(callback: ElementDisambiguationCallback): DesignSystem;
}
/**
 * An API gateway to design system features.
 * @public
 */
export declare const DesignSystem: Readonly<{
    /**
     * Returns the HTML element name that the type is defined as.
     * @param type - The type to lookup.
     * @public
     */
    tagFor(type: Constructable): string;
    /**
     * Searches the DOM hierarchy for the design system that is responsible
     * for the provided element.
     * @param element - The element to locate the design system for.
     * @returns The located design system.
     * @public
     */
    responsibleFor(element: HTMLElement): DesignSystem;
    /**
     * Gets the DesignSystem if one is explicitly defined on the provided element;
     * otherwise creates a design system defined directly on the element.
     * @param element - The element to get or create a design system for.
     * @returns The design system.
     * @public
     */
    getOrCreate(element?: HTMLElement): DesignSystem;
}>;
