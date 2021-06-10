import { bodyFont, neutralForegroundRest } from "@microsoft/fast-components";
import { display } from "@microsoft/fast-foundation";
import { css } from "@microsoft/fast-element";

export const SectionHeaderStyles = css`
    ${display("flex")} :host {
        align-items: center;
        flex-direction: column;
        font-family: ${bodyFont};
        color: ${neutralForegroundRest};
        box-sizing: border-box;
        text-align: center;
    }
`;
