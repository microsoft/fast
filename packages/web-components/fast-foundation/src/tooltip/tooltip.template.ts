import { html, ref } from "@microsoft/fast-element";
import { Tooltip } from "./tooltip";

export const TooltipTemplate = html<Tooltip>`
<template ${ref("tooltipRoot")}>
    <fast-anchored-region
        ${ref("region")}
        anchor=${x => x.anchor}
        vertical-positioning-mode=${x => x.verticalPositioningMode}
        horizontal-positioning-mode=${x => x.horizontalPositioningMode}
        vertical-inset=${x => x.verticalInset}
        horizontal-inset=${x => x.horizontalInset}
        vertical-default-position=${x => x.verticalDefaultPosition}
        horizontal-default-position=${x => x.horizontalDefaultPosition}
    >
    <div class="tooltip" part="tooltip">
        <slot></slot>
    </div>
    </fast-anchored-region>
</template>
`;
