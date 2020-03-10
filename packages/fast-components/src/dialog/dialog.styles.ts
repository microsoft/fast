import { css } from "@microsoft/fast-element";

export const DialogStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 8;
        --dialog-height: 480px;
        --dialog-width: 640px;
        display: block;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        touch-action: none;
    }

    .positioning-region {
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
    }

    .root {
        margin-top: auto;
        margin-bottom: auto;
        border-radius: calc(var(--elevated-corner-radius));
        width: var(--dialog-width);
        height: var(--dialog-height);
        box-shadow: 0 0 calc(var(--elevation) * 1px) rgba(0, 0, 0, 0.5);
        background: var(--background-color);
        z-index: 1;
    }
`;
