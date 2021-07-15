import {
    ComposableStyles,
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
} from "@microsoft/fast-element";
import { Container } from "../di/di";
/**
 * Applies presentation details, such as template and styles, to a component instance.
 * @public
 */
export interface ComponentPresentation {
    /**
     * Applies the presentation details to the specified element.
     * @param element - The element to apply the presentation details to.
     * @public
     */
    applyTo(element: FASTElement): void;
}
/**
 * An API gateway to component presentation features.
 * @public
 */
export declare const ComponentPresentation: Readonly<{
    /**
     * Defines a component presentation for an element.
     * @param tagName - The element name to define the presentation for.
     * @param presentation - The presentation that will be applied to matching elements.
     * @param container - The dependency injection container to register the configuration in.
     * @public
     */
    define(
        tagName: string,
        presentation: ComponentPresentation,
        container: Container
    ): void;
    /**
     * Finds a component presentation for the specified element name,
     * searching the DOM hierarchy starting from the provided element.
     * @param tagName - The name of the element to locate the presentation for.
     * @param element - The element to begin the search from.
     * @returns The component presentation or null if none is found.
     * @public
     */
    forTag(tagName: string, element: HTMLElement): ComponentPresentation | null;
}>;
/**
 * The default implementation of ComponentPresentation, used by FoundationElement.
 * @public
 */
export declare class DefaultComponentPresentation implements ComponentPresentation {
    /**
     * The styles to apply to the element.
     * @public
     */
    readonly styles: ElementStyles | null;
    /**
     * The template to apply to the element.
     * @public
     */
    readonly template: ElementViewTemplate | null;
    /**
     * Creates an instance of DefaultComponentPresentation.
     * @param template - The template to apply to the element.
     * @param styles - The styles to apply to the element.
     * @public
     */
    constructor(
        template?: ElementViewTemplate,
        styles?: ComposableStyles | ComposableStyles[]
    );
    /**
     * Applies the presentation details to the specified element.
     * @param element - The element to apply the presentation details to.
     * @public
     */
    applyTo(element: FASTElement): void;
}
