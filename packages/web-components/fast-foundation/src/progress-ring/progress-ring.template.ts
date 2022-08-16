import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import type { FASTProgressRing } from "./progress-ring.js";
import type { ProgressRingOptions } from "./progress-ring.options.js";

const defaultRingTemplate = html<FASTProgressRing>`
    <svg viewBox="0 0 16 16" class="progress">
        <circle class="background" part="background" cx="8px" cy="8px" r="7px"></circle>
        <circle class="indicator" part="indicator" cx="8px" cy="8px" r="7px"></circle>
    </svg>
`;

/**
 * The template for the {@link @microsoft/fast-foundation#FASTProgressRing} component.
 * @public
 */
export function progressRingTemplate<T extends FASTProgressRing>(
    options: ProgressRingOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="progressbar"
            aria-valuenow="${x => x.value}"
            aria-valuemin="${x => x.min}"
            aria-valuemax="${x => x.max}"
            class="${x => (x.paused ? "paused" : "")}"
        >
            ${when(
                x => typeof x.value === "number",
                html<T>`
                    <span
                        class="determinate"
                        part="determinate"
                        style="--percent-complete: ${x => x.percentComplete}"
                    >
                        ${x => options.determinateIndicator ?? defaultRingTemplate}
                    </span>
                `
            )}
            ${when(
                x => typeof x.value !== "number",
                html<FASTProgressRing>`
                    <span class="indeterminate" part="indeterminate">
                        ${x => options.indeterminateIndicator ?? defaultRingTemplate}
                    </span>
                `
            )}
        </template>
    `;
}
