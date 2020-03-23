import { html, when } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";

export const CircularProgressTemplate = html<BaseProgress>`
    <template
        role="progressbar"
        $aria-valuenow="${x => x.value}"
        $aria-valuemin="${x => x.min}"
        $aria-valuemax="${x => x.max}"
    >
        ${when(
            x => x.value,
            html<BaseProgress>`
            <svg class="progress" part="circular-container" viewBox="0 0 16 16" slot="determinate">
                <circle class="background" part="circular-background" cx="8px" cy="8px" r="7px"></circle>
                <circle class="determinate" part="circular-determinate" style="stroke-dasharray: ${x =>
                    (44 * x.value) / 100}px 44px" cx="8px" cy="8px" r="7px"></circle>
            </svg>
        `
        )}
        ${when(
            x => !x.value,
            html<BaseProgress>`
            <slot name="indeterminate">
                <svg class="progress" part="circular-container" viewBox="0 0 16 16" slot="indeterminate">
                    <circle class="background" part="circular-background" cx="8px" cy="8px" r="7px"></circle>
                    <circle class="indeterminate" part="circular-indeterminate" cx="8px" cy="8px" r="7px"></circle>
                </svg>
            </slot>
           
        `
        )}
    </template>
`;
