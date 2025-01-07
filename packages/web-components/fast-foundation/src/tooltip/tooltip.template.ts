import { html, ref, when } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import { AnchoredRegion } from "../anchored-region/anchored-region.js";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Tooltip } from "./tooltip.js";

/**
 * Creates a template for the {@link @ni/fast-foundation#(Tooltip:class)} component using the provided prefix.
 * @public
 */
export const tooltipTemplate: FoundationElementTemplate<ViewTemplate<Tooltip>> = (
    context,
    definition
) => {
    return html<Tooltip>`
        ${when(
            x => x.tooltipVisible,
            html<Tooltip>`
            <${context.tagFor(AnchoredRegion)}
                fixed-placement="true"
                auto-update-mode="${x => x.autoUpdateMode}"
                vertical-positioning-mode="${x => x.verticalPositioningMode}"
                vertical-default-position="${x => x.verticalDefaultPosition}"
                vertical-inset="${x => x.verticalInset}"
                vertical-scaling="${x => x.verticalScaling}"
                horizontal-positioning-mode="${x => x.horizontalPositioningMode}"
                horizontal-default-position="${x => x.horizontalDefaultPosition}"
                horizontal-scaling="${x => x.horizontalScaling}"
                horizontal-inset="${x => x.horizontalInset}"
                vertical-viewport-lock="${x => x.horizontalViewportLock}"
                horizontal-viewport-lock="${x => x.verticalViewportLock}"
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
