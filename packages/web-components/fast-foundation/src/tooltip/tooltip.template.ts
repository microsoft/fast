import { html, ref, when } from "@microsoft/fast-element";
import { Tooltip } from "./tooltip";

export const TooltipTemplate = html<Tooltip>`
<template ${ref("root")}>
    <fast-anchored-region
        anchor=${x => x.anchor}
        ${ref("region")}
        vertical-positioning-mode="dynamic"
        horizontal-positioning-mode="dynamic"
        vertical-inset="true"
        horizontal-inset="false"
    >
    <div class="tooltip" part="tooltip">
        <slot></slot>
    </div>
    </fast-anchored-region>
</template>
`;
