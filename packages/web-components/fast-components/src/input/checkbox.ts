import { css, elements, html, slotted } from "@microsoft/fast-element";
import {
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    heightNumber,
    neutralFillInputRestBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";
import { FastInput } from "./index";

export const checkedIndicatorTemplate = html`
    <svg aria-hidden="true" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
        />
    </svg>
`;

export const indeterminateIndicatorTemplate = html`
    <div part="indeterminate-indicator" class="indeterminate-indicator"></div>
`;

export const checkboxTemplate = html<FastInput>`
    <template @change=${(x, c) => x.checkedHandler(c.event)}>
        <slot name="label"></slot>
        <span
            class="control ${x => (x.checked ? "checked" : "")} ${x =>
                x.indeterminate ? "indeterminate" : ""}"
        >
            <slot
                ${slotted({
                    property: "controls",
                    filter: elements("input"),
                })}
            ></slot>
            <slot name="checked-indicator">
                ${x => x.checkedIndicatorTemplate}
            </slot>

            <slot name="indeterminate-indicator">
                ${x => x.indeterminateIndicatorTemplate}
            </slot>
        </span>
    </template>
`;
export const checkboxStyles = css`
    ::slotted(input) {
        position: relative;
        width: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
        height: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid ${neutralOutlineRestBehavior.var};
        background: ${neutralFillInputRestBehavior.var};
        outline: none;
        cursor: pointer;
        appearance: none;
        margin: 0;
    }

    .control {
        align-self: start;
        display: inline-flex;
        fill: ${accentForegroundCutRestBehavior.var};
        position: relative;
    }

    ::slotted(input:checked) {
        background: ${accentFillRestBehavior.var};
        border: calc(var(--outline-width) * 1px) solid ${accentFillRestBehavior.var};
    }

    .indeterminate-indicator {
        border-radius: calc(var(--corner-radius) * 1px);
        background: ${accentForegroundCutRestBehavior.var};
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50%;
        height: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
    }

    slot[name="checked-indicator"] > *,
    slot[name="checked-indicator"] ::slotted(*),
    slot[name="indeterminate-indicator"] > *,
    slot[name="indeterminate-indicator"] ::slotted(*) {
        fill: inherit;
        width: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
        height: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
        width: inherit;
        height: inherit;
        display: block;
        fill: ${accentForegroundCutRestBehavior.var};
        opacity: 0;
    }

    .checked:not(.indeterminate) slot[name="checked-indicator"] svg,
    .checked:not(.indeterminate) slot[name="checked-indicator"] ::slotted(svg),
    .indeterminate slot[name="indeterminate-indicator"] > *,
    .indeterminate slot[name="indeterminate-indicator"] > ::slotted(*) {
        opacity: 1;
    }
`.withBehaviors(
    accentForegroundCutRestBehavior,
    accentFillRestBehavior,
    neutralFillInputRestBehavior,
    neutralOutlineRestBehavior
);
