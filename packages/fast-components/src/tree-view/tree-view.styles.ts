import { css } from "@microsoft/fast-element";

export const NameTagStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --depth: 4;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-width: fit-content;
        font-size: 0;
    }

    :host:focus-visible {
        outline: none;
    }
`;
