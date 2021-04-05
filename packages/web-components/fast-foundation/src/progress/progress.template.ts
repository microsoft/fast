import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { BaseProgress } from "./base-progress";

/**
 * The template for the {@link @microsoft/fast-foundation#BaseProgress} component.
 * @public
 */
export const ProgressTemplate: ViewTemplate<BaseProgress> = html`
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
                        style="width: ${x => x.value}%"
                    ></div>
                </div>
            `
        )}
        ${when(
            x => typeof x.value !== "number",
            html<BaseProgress>`
                <div class="progress" part="progress" slot="indeterminate">
                    <slot class="indeterminate" name="indeterminate">
                        <span
                            class="indeterminate-indicator-1"
                            part="indeterminate-indicator-1"
                        ></span>
                        <span
                            class="indeterminate-indicator-2"
                            part="indeterminate-indicator-2"
                        ></span>
                    </slot>
                </div>
            `
        )}
    </template>
`;
