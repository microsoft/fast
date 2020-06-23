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
                    horizontal-positioning-mode=${x => x.horizontalPositioningMode}
                    vertical-inset=${x => x.verticalInset}
                    horizontal-inset=${x => x.horizontalInset}
                    vertical-default-position=${x => x.verticalDefaultPosition}
                    horizontal-default-position=${x => x.horizontalDefaultPosition}
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
