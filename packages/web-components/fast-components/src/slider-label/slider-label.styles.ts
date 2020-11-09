import { css } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    heightNumber,
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";

export const SliderLabelStyles = css`
    ${display("block")} :host {
        color: ${neutralForegroundRestBehavior.var};
        fill: currentcolor;
    }
    .root {
        position: absolute;
        display: grid;
    }
    .container {
        display: grid;
        justify-self: center;
    }
    .label {
        justify-self: center;
        align-self: center;
        white-space: nowrap;
        max-width: 30px;
        margin: 2px 0;
    }
    .mark {
        width: calc((var(--design-unit) / 4) * 1px);
        height: calc(${heightNumber} * 0.25 * 1px);
        background: ${neutralOutlineRestBehavior.var};
        justify-self: center;
    }
    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            .mark {
                forced-color-adjust: none;
                background: ${SystemColors.FieldText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${SystemColors.GrayText};
            }
            :host(.disabled) .mark {
                background: ${SystemColors.GrayText};
            }
        `
    )
);
