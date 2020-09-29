import { html, ref, when } from "@microsoft/fast-element";
import { Tooltip } from "./tooltip";

/**
 * The template for the {@link @microsoft/fast-foundation#(Tooltip:class)} component.
 * @public
 */
export const TooltipTemplate = html<Tooltip>`
    ${when(
        x => x.tooltipVisible,
        html<Tooltip>`
            <fast-anchored-region
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
            </fast-anchored-region>
        `
    )}
`;
