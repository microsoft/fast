import type { ViewTemplate } from "@microsoft/fast-element";
import type { Skeleton } from "./skeleton";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
/**
 * The template for the fast-skeleton component
 * @public
 */
export declare const skeletonTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Skeleton>;
