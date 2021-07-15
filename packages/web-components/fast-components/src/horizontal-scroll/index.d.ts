import {
    HorizontalScroll as FoundationHorizontalScroll,
    HorizontalScrollOptions,
} from "@microsoft/fast-foundation";
/**
 * @internal
 */
export declare class HorizontalScroll extends FoundationHorizontalScroll {
    /**
     * @public
     */
    connectedCallback(): void;
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#HorizontalScroll} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#horizontalScrollTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-horizontal-scroll\>
 */
export declare const fastHorizontalScroll: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        HorizontalScrollOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    HorizontalScrollOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
