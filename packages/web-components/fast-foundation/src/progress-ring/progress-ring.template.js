import { html, when } from "@microsoft/fast-element";
/**
 * The template for the {@link @microsoft/fast-foundation#BaseProgress} component.
 * @public
 */
export const progressRingTemplate = (context, definition) => html`
    <template
        role="progressbar"
        aria-valuenow="${x => x.value}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
        class="${x => (x.paused ? "paused" : "")}"
    >
        ${when(
            x => typeof x.value === "number",
            html`
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
                        style="stroke-dasharray: ${x => (44 * x.value) / 100}px 44px"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                </svg>
            `
        )}
        ${when(
            x => typeof x.value !== "number",
            html`
                <slot name="indeterminate" slot="indeterminate">
                    ${definition.indeterminateIndicator || ""}
                </slot>
            `
        )}
    </template>
`;
