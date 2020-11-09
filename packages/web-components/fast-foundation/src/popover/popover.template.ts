import { html, ref, ViewTemplate, when } from "@microsoft/fast-element";
import { Popover } from "./popover";

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(Popover:class)} component using the provided prefix.
 * @public
 */
export function createPopoverTemplate(prefix: string): ViewTemplate {
    return html<Popover>`
        ${when(
            x => x.popoverVisible,
            html<Popover>`
            <${prefix}-anchored-region
                part="anchored-region"
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
                <div
                    class="popover"
                    part="popover"
                    role="dialog"
                    ${ref("popover")}
                    tabindex="0"
                    aria-label="${x => x.ariaLabel}"
                    aria-labelledby="${x => x.ariaLabelledby}"
                    aria-describedby="${x => x.ariaDescribedby}"
                >
                    <slot></slot>
                </div>
            </${prefix}-anchored-region>
        `
        )}
    `;
}
