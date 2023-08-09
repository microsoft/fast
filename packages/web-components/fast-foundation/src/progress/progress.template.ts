import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import { staticallyCompose } from "../utilities/template-helpers.js";
import type { FASTProgress } from "./progress.js";
import type { ProgressOptions } from "./progress.options.js";

/**
 * @public
 */
export const progressIndicatorTemplate = html`
    <div class="indicator" part="indicator"></div>
`;

/**
 * The template for the {@link @microsoft/fast-foundation#FASTProgress} component.
 * @public
 */
export function progressTemplate<T extends FASTProgress>(
    options: ProgressOptions = {}
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
                    <span
                        class="determinate"
                        part="determinate"
                        style="--percent-complete: ${x => x.percentComplete}"
                    >
                        <slot name="determinate">
                            ${staticallyCompose(options.determinateIndicator)}
                        </slot>
                    </span>
                `,
                html<T>`
                    <span class="indeterminate" part="indeterminate">
                        <slot name="indeterminate">
                            ${staticallyCompose(options.indeterminateIndicator)}
                        </slot>
                    </span>
                `
            )}
        </template>
    `;
}
