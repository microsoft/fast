import { Card as FoundationCard } from "@microsoft/fast-foundation";
/**
 * @internal
 */
export declare class Card extends FoundationCard {
    connectedCallback(): void;
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#Card} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#CardTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-card\>
 */
export declare const fastCard: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Card
>;
/**
 * Styles for Card
 * @public
 */
export declare const cardStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
