import { css } from "@microsoft/fast-element";

export const CardStyles = css`
    :host {
        --elevation: 4;
        display: block;
        box-sizing: border-box;
        height: "100%";
        width: "100%";
        background: var(--neutral-layer-card);
        border-radius: var(--elevated-corner-radius);
        box-shadow: 0 0 calc(var(--elevation) * 1px) rgba(0, 0, 0, 0.5);
    }
`;
