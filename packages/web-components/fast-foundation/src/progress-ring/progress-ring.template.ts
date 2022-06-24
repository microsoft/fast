import type { ViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { ProgressRing } from "./progress-ring.js";
import type { ProgressRingOptions } from "./progress-ring.options.js";

const progressSegments: number = 44;

/**
 * The template for the {@link @microsoft/fast-foundation#ProgressRing} component.
 * @public
 */
export const progressRingTemplate: FoundationElementTemplate<
    ViewTemplate<ProgressRing>,
    ProgressRingOptions
> = (context, definition) => html`
    <template
        role="progressbar"
        aria-valuenow="${x => x.value}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
        class="${x => (x.paused ? "paused" : "")}"
    >
        ${when(
            x => typeof x.value === "number",
            html<ProgressRing>`
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
            html<ProgressRing>`
                <slot name="indeterminate">
                    ${definition.indeterminateIndicator || ""}
                </slot>
            `
        )}
    </template>
`;
