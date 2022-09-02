import { ElementViewTemplate, html, ref, when } from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTTooltip } from "./tooltip.js";

/**
 * Options for the tooltip.
 * @public
 */
export type TooltipOptions = {
    anchoredRegion: TemplateElementDependency;
};

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(FASTTooltip:class)} component using the provided prefix.
 * @public
 */
export function tooltipTemplate<T extends FASTTooltip>(
    options: TooltipOptions
): ElementViewTemplate<T> {
    return html<T>`
        ${when(
            x => x.tooltipVisible,
            html<T>`
            <${tagFor(options.anchoredRegion)}
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
                <div class="control" part="control" role="tooltip">
                    <slot></slot>
                </div>
            </${tagFor(options.anchoredRegion)}>
        `
        )}
    `;
}
