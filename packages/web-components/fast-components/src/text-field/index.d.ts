import { TextField as FoundationTextField } from "@microsoft/fast-foundation";
/**
 * Text field appearances
 * @public
 */
export declare type TextFieldAppearance = "filled" | "outline";
/**
 * @internal
 */
export declare class TextField extends FoundationTextField {
    /**
     * The appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance: TextFieldAppearance;
    /**
     * @internal
     */
    connectedCallback(): void;
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#TextField} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#textFieldTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-text-field\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export declare const fastTextField: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof TextField
>;
/**
 * Styles for TextField
 * @public
 */
export declare const textFieldStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
