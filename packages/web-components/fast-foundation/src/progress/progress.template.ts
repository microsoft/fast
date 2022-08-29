import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import type { FASTProgress } from "./progress.js";
import type { ProgressOptions } from "./progress.options.js";

export const progressIndicatorTemplate = html<FASTProgress>`
    <div class="indicator" part="indicator"></div>
`;

/**
 * The template for the {@link @microsoft/fast-foundation#FASTProgress} component.
 * @public
 */
export function progressTemplate<T extends FASTProgress>(
    options: ProgressOptions
): ElementViewTemplate<T> {
    return html`
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
                        ${x => options.determinateIndicator}
                    </span>
                `
            )}
            ${when(
                x => typeof x.value !== "number",
                html<FASTProgress>`
                    <span class="indeterminate" part="indeterminate">
                        ${x => options.indeterminateIndicator}
                    </span>
                `
            )}
        </template>
    `;
}
