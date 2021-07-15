import { html, ref, when } from "@microsoft/fast-element";
import { AnchoredRegion } from "../anchored-region";
/**
 * Creates a template for the {@link @microsoft/fast-foundation#(Tooltip:class)} component using the provided prefix.
 * @public
 */
export const tooltipTemplate = (context, definition) => {
    return html`
        ${when(
            x => x.tooltipVisible,
            html`
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
