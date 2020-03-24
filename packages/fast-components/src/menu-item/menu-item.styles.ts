import { css } from "@microsoft/fast-element";
import { disabledCursor, display, focusVisible } from "../styles";

export const MenuItemStyles = css`
    ${display("grid")} :host {
        box-sizing: border-box;
        height: calc(var(--height-number) * 1px);
        grid-template-columns:  0 auto 0;
        grid-template-rows: auto;
        justify-items: center;
        align-items: center;
        padding: 0;
        margin: 0 calc(var(--design-unit) * 1px);
        white-space: nowrap;
        overflow: hidden;
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
        cursor: pointer;
        ${
            /* Font size and line height are temporary - 
            replace when adaptive typography is figured out */ ""
        } font-size: 14px;
        line-height: 20px;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
    }

    :host(:${focusVisible}) {
        border-color: var(--neutral-focus);
    }

    :host(:hover) {
        background: var(--neutral-fill-stealth-hover);
    }

    :host(:active) {
        background: var(--neutral-fill-stealth-active);
    }

    :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: var(--disabled-opacity);
    }
`;
