import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import { staticallyCompose } from "../utilities/template-helpers.js";
import type { FASTProgressRing } from "./progress-ring.js";
import type { ProgressRingOptions } from "./progress-ring.options.js";

const progressSegments: number = 44;

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
        >
            ${when(
                x => typeof x.value === "number",
                html<T>`
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
                `,
                html<T>`
                    <slot name="indeterminate">
                        ${staticallyCompose(options.indeterminateIndicator)}
                    </slot>
                `
            )}
        </template>
    `;
}
