import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const MockUiStyles = css`
    ${display("flex")} :host {
        justify-content: center;
    }

    .accessibility-root {
        margin: 10px 0 0;
        padding: 10px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
    }

    ::slotted(fast-button) {
        margin-bottom: 10px;
    }
`;
