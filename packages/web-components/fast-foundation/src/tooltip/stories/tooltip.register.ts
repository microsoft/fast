import { css } from "@microsoft/fast-element";
import { FASTTooltip } from "../tooltip.js";
import { tooltipTemplate } from "../tooltip.template.js";

const styles = css`
    :host {
        contain: size;
        overflow: visible;
        height: 0;
        width: 0;
    }

    .control {
        box-sizing: border-box;
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-outer);
        background: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
        padding: 4px;
        height: fit-content;
        width: fit-content;
        font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
            var(--body-font);
        white-space: nowrap;
        z-index: 10000;
    }

    fast-anchored-region {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: visible;
        flex-direction: row;
    }

    fast-anchored-region.right,
    fast-anchored-region.left {
        flex-direction: column;
    }

    fast-anchored-region.top .tooltip {
        margin-bottom: 4px;
    }

    fast-anchored-region.bottom .tooltip {
        margin-top: 4px;
    }

    fast-anchored-region.left .tooltip {
        margin-right: 4px;
    }

    fast-anchored-region.right .tooltip {
        margin-left: 4px;
    }

    fast-anchored-region.top.left .tooltip,
    fast-anchored-region.top.right .tooltip {
        margin-bottom: 0;
    }

    fast-anchored-region.bottom.left .tooltip,
    fast-anchored-region.bottom.right .tooltip {
        margin-top: 0;
    }

    fast-anchored-region.top.left .tooltip,
    fast-anchored-region.bottom.left .tooltip {
        margin-right: 0;
    }

    fast-anchored-region.top.right .tooltip,
    fast-anchored-region.bottom.right .tooltip {
        margin-left: 0;
    }
`;

FASTTooltip.define({
    name: "fast-tooltip",
    styles,
    template: tooltipTemplate({
        anchoredRegion: "fast-anchored-region",
    }),
});
