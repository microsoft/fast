import { html, when } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";

export const LinearProgressTemplate = html<BaseProgress>`
    <template
        role="progressbar"
        $aria-valuenow="${x => x.value}"
        $aria-valuemin="${x => x.min}"
        $aria-valuemax="${x => x.max}"
    >
        ${when(
            x => x.value,
            html<BaseProgress>`
            <div class="progress" part="progress" slot="determinate">
                <div class="determinate" part="determinate" style="width: ${x =>
                    x.value}%"></div>
            </div>
        `
        )}
        ${when(
            x => !x.value,
            html<BaseProgress>`
            <div class="progress" part="progress" slot="indeterminate">
                <slot class="indeterminate" name="indeterminate">
                    <span class="linear-indeterminate-indicator-1" part="linear-indeterminate-indicator-1"></span>
                    <span class="linear-indeterminate-indicator-2" part="linear-indeterminate-indicator-2"></span>
                </slot>
            </div>
        `
        )}
    </template>
`;
