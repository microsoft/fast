import { Disclosure as FoundationDisclosure } from "@microsoft/fast-foundation";
/**
 * Types of anchor appearance.
 * @public
 */
export declare type DisclosureAppearance = "accent" | "lightweight";
/**
 * @internal
 */
export declare class Disclosure extends FoundationDisclosure {
    /**
     * Disclosure default height
     */
    private height;
    /**
     * Disclosure height after it's expanded
     */
    private totalHeight;
    /**
     * The appearance the anchor should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance: DisclosureAppearance;
    appearanceChanged(
        oldValue: DisclosureAppearance,
        newValue: DisclosureAppearance
    ): void;
    /**
     * Set disclosure height while transitioning
     * @override
     */
    protected onToggle(): void;
    /**
     * Calculate disclosure height before and after expanded
     * @override
     */
    protected setup(): void;
    get disclosureHeight(): number;
}
/**
 * Styles for Disclosure
 * @public
 */
export declare const disclosureStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * A function that returns a {@link @microsoft/fast-foundation#Disclosure} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#disclosureTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-Disclosure\>
 *
 */
export declare const fastDisclosure: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Disclosure
>;
