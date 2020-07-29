import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const MockUiStyles = css`
    ${display("flex")} :host {
        justify-content: center;
    }

    .accessibility-root {
        display: block;
    }
`;
