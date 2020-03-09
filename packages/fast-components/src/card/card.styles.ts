import { css } from "@microsoft/fast-element";

export const CardStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: var(--neutral-layer-card);
        border-radius: var(--elevated-corner-radius);
        box-shadow: 0 0 calc(var(--elevation) * 1px) rgba(0, 0, 0, 0.5);
    }
`;
