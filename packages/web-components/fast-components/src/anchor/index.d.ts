import { Anchor as FoundationAnchor } from "@microsoft/fast-foundation";
import { ButtonAppearance } from "../button";
/**
 * Types of anchor appearance.
 * @public
 */
export declare type AnchorAppearance = ButtonAppearance | "hypertext";
/**
 * Base class for Anchor
 * @public
 */
export declare class Anchor extends FoundationAnchor {
    /**
     * The appearance the anchor should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance: AnchorAppearance;
    appearanceChanged(oldValue: AnchorAppearance, newValue: AnchorAppearance): void;
    connectedCallback(): void;
    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot
     *
     * @internal
     *
     */
    defaultSlottedContentChanged(oldValue: any, newValue: any): void;
}
/**
 * Styles for Anchor
 * @public
 */
export declare const anchorStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * A function that returns a {@link @microsoft/fast-foundation#Anchor} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#anchorTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-anchor\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export declare const fastAnchor: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Anchor
>;
