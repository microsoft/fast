import { css } from "@microsoft/fast-element";

export const NameTagStyles = css`
    :host {
        --depth: 4;
        display: block;
        color: var(--accent-foreground-cut-rest);
        background: var(--accent-fill-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        min-width: calc(var(--design-unit) * 81.25px);
        max-width: calc(var(--design-unit) * 125px);
        text-align: center;
        box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0, 0, 0, 0.5);
        overflow: hidden;
        margin: calc(var(--design-unit) * 8px) 0;
    }

    .header {
        padding: 16px 0;
        position: relative;
    }

    h3 {
        font-weight: bold;
        font-family: "Source Sans Pro";
        letter-spacing: 4px;
        font-size: calc(var(--density) * 24px + 20px);
        margin: 0;
        padding: 0;
    }

    h4 {
        font-family: sans-serif;
        font-size: calc(var(--density) * 16px + 10px);
        margin: 0;
        padding: 0;
    }

    .body {
        background: white;
        color: black;
        padding: calc(var(--density) * var(--design-unit) * 8px + 12px) 8px;
        font-size: calc(var(--density) * 24px + 30px);
        font-family: cursive;
    }

    .footer {
        height: 16px;
    }

    ::slotted(img) {
        border-radius: 50%;
        height: 64px;
        width: 64px;
        box-shadow: 0 0 calc(var(--depth) / 2px) rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 16px;
        top: -4px;
    }
`;
