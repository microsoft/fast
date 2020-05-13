import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

export const FeatureCardStyles = css`
    ${display("grid")} :host {
        grid-template-columns: 1fr 2fr;
        color: var(--text-color);
        font-family: var(--text-font);
        box-sizing: border-box;
        margin: 10px 20px;
        padding: 10px 0;
        box-shadow: unset;
        height: 120px;
        border-top: 1px solid currentcolor;
    }

    :host(:hover) ::slotted(fast-anchor) {
        opacity: 1;
    }

    :host(:hover) {
        filter: blur(0);
    }

    header {
        flex: 1;
    }

    main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 2;
    }

    ::slotted(h4) {
        font-size: 20px;
        margin: 0;
    }

    ::slotted(h5) {
        margin: 0 0 10px 0;
    }

    ::slotted(p) {
        margin: 0;
    }

    ::slotted(fast-anchor) {
        margin-right: 20px;
        opacity: 0;
        filter: hue-rotate(100deg);
    }
`;
