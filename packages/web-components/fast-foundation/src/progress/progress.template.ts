import type { ViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { BaseProgress } from "./base-progress.js";
import type { ProgressOptions } from "./progress.options.js";

/**
 * The template for the {@link @microsoft/fast-foundation#BaseProgress} component.
 * @public
 */
export const progressTemplate: FoundationElementTemplate<
    ViewTemplate<BaseProgress>,
    ProgressOptions
> = (context, defintion) => html`
    <template
        role="progressbar"
        aria-valuenow="${x => x.value}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
        class="${x => (x.paused ? "paused" : "")}"
    >
        ${when(
            x => typeof x.value === "number",
            html<BaseProgress>`
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
            html<BaseProgress>`
                <div class="progress" part="progress" slot="indeterminate">
                    <slot name="indeterminate">
                        ${defintion.indeterminateIndicator1 || ""}
                        ${defintion.indeterminateIndicator2 || ""}
                    </slot>
                </div>
            `
        )}
    </template>
`;
