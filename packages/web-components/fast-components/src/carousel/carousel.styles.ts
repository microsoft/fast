import { css } from "@microsoft/fast-element";
import { neutralForegroundRestBehavior, neutralFocusBehavior } from "../styles/recipes";
import {
    focusVisible,
    display,
    CarouselPattern,
    DirectionalStyleSheetBehavior,
} from "@microsoft/fast-foundation";

const ltr = css`
    .previous-flipper-container {
        left: 20px;
    }

    .next-flipper-container {
        right: 20px;
    }

    .rotation-control-container {
        left: 10px;
    }
`;

const rtl = css`
    .previous-flipper-container {
        right: 20px;
    }

    .next-flipper-container {
        left: 20px;
    }

    .rotation-control-container {
        right: 10px;
    }
`;

export const CarouselStyles = css`
    ${display("inline-flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-font-size);
        color: ${neutralForegroundRestBehavior.var};
        align-items: center;
        justify-content: space-evenly;
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    :host([hidden]) {
        display: none;
    }

    :host([pattern="${CarouselPattern.basic}"]) .flipper {
        opacity: 1;
    }

    :host(:hover) .flipper {
        opacity: 1;
    }

    .flipper {
        opacity: 0;
    }

    .flipper {
        transition: all 0.2s ease-in-out;
        position: absolute;
        z-index: 1;
    }

    .tablist {
        display: inline-flex;
        position: absolute;
        padding: 0;
        bottom: 15px;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        max-width: 100%;
        min-width: 25%;
        overflow: hidden;
    }

    .tablist ::slotted(*) {
        all: initial;
        display: inline-block;
        padding: 4px;
        margin: 4px;
        position: relative;
        border: none;
        outline: none;
        max-width: 32px;
        min-width: 5px;
        flex-grow: 1;
        height: unset;
        line-height: unset;
    }

    .tablist ::slotted(*):before {
        opacity: 0.5;
        border: 1px solid #bebebe;
        border-radius: calc(var(--corner-radius) * 1px);
        opacity: 0.45;
        content: "";
        display: block;
        transition: all 0.05s ease-in-out;
        height: 4px;
        background-color: var(--background-color);
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .tablist ::slotted(*:hover):before, .tablist ::slotted([aria-selected="true"]):before {
        opacity: 1;
    }

    .tablist ::slotted(*:${focusVisible}):before {
        outline: none;
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px)
            rgba(0,0,0,1), 0 0 0 calc((var(--focus-outline-width) + var(--outline-width)) * 1px)
            ${neutralFocusBehavior.var};
    }

    .rotation-control-container {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 1;
    }
`.withBehaviors(
    new DirectionalStyleSheetBehavior(ltr, rtl),
    neutralForegroundRestBehavior,
    neutralFocusBehavior
);
