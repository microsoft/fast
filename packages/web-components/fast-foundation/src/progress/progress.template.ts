import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import { staticallyCompose } from "../utilities/template-helpers.js";
import type { FASTProgress } from "./progress.js";
import type { ProgressOptions } from "./progress.options.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTProgress} component.
 * @public
 */
export function progressTemplate<T extends FASTProgress>(
    options: ProgressOptions = {}
): ElementViewTemplate<T> {
    return html`
        <template
            role="progressbar"
            aria-valuenow="${x => x.value}"
            aria-valuemin="${x => x.min}"
            aria-valuemax="${x => x.max}"
        >
            ${when(
                x => typeof x.value === "number",
                html<T>`
                    <div class="progress" part="progress" slot="determinate">
                        <div
                            class="determinate"
                            part="determinate"
                            style="width: ${x => x.percentComplete}%"
                        ></div>
                    </div>
                `,
                html<T>`
                    <div class="progress" part="progress" slot="indeterminate">
                        <slot name="indeterminate">
                            ${staticallyCompose(options.indeterminateIndicator1)}
                            ${staticallyCompose(options.indeterminateIndicator2)}
                        </slot>
                    </div>
                `
            )}
        </template>
    `;
}
