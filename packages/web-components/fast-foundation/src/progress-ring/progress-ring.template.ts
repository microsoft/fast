import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import type { FASTProgressRing } from "./progress-ring.js";
import type { ProgressRingOptions } from "./progress-ring.options.js";

const progressSegments: number = 44;

/**
 * The template for the {@link @microsoft/fast-foundation#FASTProgressRing} component.
 * @public
 */
export function progressRingTemplate(
    options: ProgressRingOptions = {}
): ElementViewTemplate<FASTProgressRing> {
    return html<FASTProgressRing>`
        <template
            role="progressbar"
            aria-valuenow="${x => x.value}"
            aria-valuemin="${x => x.min}"
            aria-valuemax="${x => x.max}"
            class="${x => (x.paused ? "paused" : "")}"
        >
            ${when(
                x => typeof x.value === "number",
                html<FASTProgressRing>`
                    <svg
                        class="progress"
                        part="progress"
                        viewBox="0 0 16 16"
                        slot="determinate"
                    >
                        <circle
                            class="background"
                            part="background"
                            cx="8px"
                            cy="8px"
                            r="7px"
                        ></circle>
                        <circle
                            class="determinate"
                            part="determinate"
                            style="stroke-dasharray: ${x =>
                                (progressSegments * x.percentComplete) /
                                100}px ${progressSegments}px"
                            cx="8px"
                            cy="8px"
                            r="7px"
                        ></circle>
                    </svg>
                `
            )}
            ${when(
                x => typeof x.value !== "number",
                html<FASTProgressRing>`
                    <slot name="indeterminate">
                        ${options.indeterminateIndicator || ""}
                    </slot>
                `
            )}
        </template>
    `;
}
