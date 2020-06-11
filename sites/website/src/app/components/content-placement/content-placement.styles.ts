import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const ContentPlacementStyles = css`
    ${display("grid")} :host {
        justify-content: center;
        contain: layout;
        font-family: var(--body-font);
        box-sizing: border-box;
        position: relative;
    }

    :host(.framework_ContentPlacement)::before,
    :host(.framework_ContentPlacement)::after {
        content: "";
        display: block;
        background-color: currentColor;
        position: absolute;
    }

    :host(.framework_ContentPlacement)::before {
        width: 1px;
        height: 100%;
        left: -1px;
        top: 0;
    }

    :host(.framework_ContentPlacement)::after {
        height: 1px;
        width: 100%;
        top: -1px;
    }

    fast-card {
        background: transparent;
        padding: calc(var(--design-unit) * 5px);
        text-align: left;
        display: flex;
        flex-direction: column;
        box-shadow: none;
    }

    fast-card ::slotted([slot="body"]) {
        flex: 1 1 auto;
        margin: 0;
        font-size: var(--type-ramp-base-font-size);
    }

    fast-card ::slotted([slot="action"]) {
        margin-top: calc(var(--design-unit) * 2px);
    }

    fast-card:hover .contentPlacement_icon {
        visibility: visible;
    }

    fast-card .contentPlacement_icon {
        visibility: hidden;
        margin-bottom: calc(var(--design-unit) * 5px);
    }
`;
