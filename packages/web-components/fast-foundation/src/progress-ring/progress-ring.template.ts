import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { BaseProgress, ProgressRingOptions } from "../progress/base-progress";
import type { ElementDefinitionContext } from "../design-system";

const progressSegments: number = 44;

/**
 * The template for the {@link @microsoft/fast-foundation#BaseProgress} component.
 * @public
 */
export const progressRingTemplate: (
    context: ElementDefinitionContext,
    definition: ProgressRingOptions
) => ViewTemplate<BaseProgress> = (
    context: ElementDefinitionContext,
    definition: ProgressRingOptions
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
                            (progressSegments * x.percentComplete!) /
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
            html<BaseProgress>`
                <slot name="indeterminate" slot="indeterminate">
                    ${definition.indeterminateIndicator || ""}
                </slot>
            `
        )}
    </template>
`;
