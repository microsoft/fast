import { TextArea as FoundationTextArea } from "@microsoft/fast-foundation";
/**
 * Text area appearances
 * @public
 */
export declare type TextAreaAppearance = "filled" | "outline";
/**
 * @internal
 */
export declare class TextArea extends FoundationTextArea {
    /**
     * The appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance: TextAreaAppearance;
    /**
     * @internal
     */
    connectedCallback(): void;
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#TextArea} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#textAreaTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-text-area\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export declare const fastTextArea: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof TextArea
>;
/**
 * Styles for TextArea
 * @public
 */
export declare const textAreaStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
