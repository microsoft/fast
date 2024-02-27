import { bodyFont, neutralForegroundRest } from "@microsoft/fast-components";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { css } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";

export const SectionHeaderStyles = css`
    ${display("flex")} :host {
        align-items: center;
        flex-direction: column;
        font-family: ${bodyFont};
        color: ${neutralForegroundRest};
        box-sizing: border-box;
        text-align: center;
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(css`
        :host {
            color: ${SystemColors.CanvasText};
        }
    `)
);
