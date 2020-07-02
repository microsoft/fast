import { html, ref, when } from "@microsoft/fast-element";
import { Tooltip } from "./tooltip";

export const TooltipTemplate = html<Tooltip>`
    <template ${ref("tooltipRoot")} role="tooltip">
        ${when(
            x => x.tooltipVisible,
            html<Tooltip>`
                <fast-anchored-region
                    ${ref("region")}
                    vertical-positioning-mode=${x => x.verticalPositioningMode}
                    vertical-default-position=${x => x.verticalDefaultPosition}
                    vertical-inset=${x => x.verticalInset}
                    vertical-scaling=${x => x.verticalScaling}
                    horizontal-positioning-mode=${x => x.horizontalPositioningMode}
                    horizontal-default-position=${x => x.horizontalDefaultPosition}
                    horizontal-scaling=${x => x.horizontalScaling}
                    horizontal-inset=${x => x.horizontalInset}
                    style=${x => x.regionStyle}
                >
                    <div class="tooltip" part="tooltip" ${ref("tooltipElement")}>
                        <slot></slot>
                    </div>
                </fast-anchored-region>
            `
        )}
    </template>
`;
