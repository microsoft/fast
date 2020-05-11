import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

export const FastFrameStyles = css`
    ${display("block")} :host {
        flex-direction: column;
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
        text-align: center;
    }

    .icon {
        pointer-events: none;
    }

    .wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 500px;
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: start;
    }

    .preview {
        display: flex;
        background: #c8c8c8;
        align-items: center;
        justify-content: center;
    }

    fast-tabs ::part(active-indicator) {
        background: red;
        height: 2px;
    }
`;
