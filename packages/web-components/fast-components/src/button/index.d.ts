import { Button as FoundationButton } from "@microsoft/fast-foundation";
/**
 * Types of button appearance.
 * @public
 */
export declare type ButtonAppearance =
    | "accent"
    | "lightweight"
    | "neutral"
    | "outline"
    | "stealth";
/**
 * @internal
 */
export declare class Button extends FoundationButton {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance: ButtonAppearance;
    connectedCallback(): void;
    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot
     *
     * @public
     * @remarks
     */
    defaultSlottedContentChanged(oldValue: any, newValue: any): void;
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#Button} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#buttonTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-button\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export declare const fastButton: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Button
>;
/**
 * Styles for Button
 * @public
 */
export declare const buttonStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
