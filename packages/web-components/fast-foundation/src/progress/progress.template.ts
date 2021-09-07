import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type { BaseProgress, ProgressOptions } from "./base-progress";

/**
 * The template for the {@link @microsoft/fast-foundation#BaseProgress} component.
 * @public
 */
export const progressTemplate: (
    context: ElementDefinitionContext,
    defintion: ProgressOptions
) => ViewTemplate<BaseProgress> = (
    context: ElementDefinitionContext,
    defintion: ProgressOptions
) => html`
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
                    <slot class="indeterminate" name="indeterminate">
                        ${defintion.indeterminateIndicator1 || ""}
                        ${defintion.indeterminateIndicator2 || ""}
                    </slot>
                </div>
            `
        )}
    </template>
`;
