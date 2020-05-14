import { css } from "@microsoft/fast-element";
import { display, neutralForegroundRestBehavior } from "@microsoft/fast-components";

export const FeatureCardStyles = css`
    ${display("grid")} :host {
        contain: layout;
        grid-template-columns: 1fr 2fr;
        color: inherit;
        font-family: var(--text-font);
        box-sizing: border-box;
        padding: 20px;
        box-shadow: unset;
    }

    :host::before {
        content: "";
        display: block;
        background-color: currentColor;
        position: fixed;
        height: 1px;
        width: 93%;
        left: 20px;
        top: -1px;
    }

    :host(:hover) ::slotted(fast-anchor) {
        opacity: 1;
    }

    :host(:hover)::before {
        opacity: 0;
    }

    :host(:hover) ::slotted(h5) {
        color: var(--accent-fill-rest);
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
        color: var(--accent-fill-rest);
    }
`.withBehaviors(neutralForegroundRestBehavior);
