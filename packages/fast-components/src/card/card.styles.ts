import { css } from "@microsoft/fast-element";

export const CardStyles = css`
    :host {
        --elevation: 4;
        --height: "100%";
        --width: "100%";
        display: block;
        background: var(--neutral-layer-card);
        border-radius: calc(var(--elevated-corner-radius));
        width: var(--width);
        height: var(--height);
        box-shadow: 0 0 calc(var(--elevation) * 1px) rgba(0, 0, 0, 0.5);
    }
`;
