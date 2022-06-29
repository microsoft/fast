import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import type { FASTProgress } from "./progress.js";
import type { ProgressOptions } from "./progress.options.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTProgress} component.
 * @public
 */
export function progressTemplate(
    options: ProgressOptions = {}
): ElementViewTemplate<FASTProgress> {
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
                html<FASTProgress>`
                    <div class="progress" part="progress" slot="determinate">
                        <div
                            class="determinate"
                            part="determinate"
                            style="width: ${x => x.percentComplete}%"
                        ></div>
                    </div>
                `
            )}
            ${when(
                x => typeof x.value !== "number",
                html<FASTProgress>`
                    <div class="progress" part="progress" slot="indeterminate">
                        <slot name="indeterminate">
                            ${options.indeterminateIndicator1 || ""}
                            ${options.indeterminateIndicator2 || ""}
                        </slot>
                    </div>
                `
            )}
        </template>
    `;
}
