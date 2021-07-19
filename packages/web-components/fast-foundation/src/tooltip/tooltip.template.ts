import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { AnchoredRegion } from "../anchored-region";
import type { Tooltip } from "./tooltip";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(Tooltip:class)} component using the provided prefix.
 * @public
 */
export const tooltipTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => {
    return html<Tooltip>`
        ${when(
            x => x.tooltipVisible,
            html<Tooltip>`
            <${context.tagFor(AnchoredRegion)}
                fixed-placement="true"
                vertical-positioning-mode="${x => x.verticalPositioningMode}"
                vertical-default-position="${x => x.verticalDefaultPosition}"
                vertical-inset="${x => x.verticalInset}"
                vertical-scaling="${x => x.verticalScaling}"
                horizontal-positioning-mode="${x => x.horizontalPositioningMode}"
                horizontal-default-position="${x => x.horizontalDefaultPosition}"
                horizontal-scaling="${x => x.horizontalScaling}"
                horizontal-inset="${x => x.horizontalInset}"
                dir="${x => x.currentDirection}"
                ${ref("region")}
            >
                <div class="tooltip" part="tooltip" role="tooltip">
                    <slot></slot>
                </div>
            </${context.tagFor(AnchoredRegion)}>
        `
        )}
    `;
};
