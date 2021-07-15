import {
    NumberField as FoundationNumberField,
    NumberFieldOptions,
} from "@microsoft/fast-foundation";
/**
 * Number field appearances
 * @public
 */
export declare type NumberFieldAppearance = "filled" | "outline";
/**
 * @internal
 */
export declare class NumberField extends FoundationNumberField {
    /**
     * The appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance: NumberFieldAppearance;
    /**
     * @internal
     */
    connectedCallback(): void;
}
/**
 * Styles for NumberField
 * @public
 */
export declare const numberFieldStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: NumberFieldOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * A function that returns a {@link @microsoft/fast-foundation#NumberField} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#numberFieldTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-number-field\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export declare const fastNumberField: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        NumberFieldOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    NumberFieldOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
