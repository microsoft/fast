import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const UnityHostStyles = css`
    ${display("flex")} :host {
        justify-content: center;
        max-width: 960px;
        max-height: 540px;
    }

    ::slotted(div) {
        display: flex;
        justify-content: center;
        width: 100%;
        margin: auto;
    }
`;
