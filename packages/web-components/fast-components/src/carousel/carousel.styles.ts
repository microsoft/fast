import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentFillRestBehavior,
    neutralDividerRestBehavior,
    neutralForegroundRestBehavior,
} from "../styles/recipes";

export const CarouselStyles = css`
    :host {
        box-sizing: border-box;
        flex-direction: column;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-font-size);
        color: var(--neutral-foreground-rest);
    }

    .carousel {
        overflow: auto;
        height: 400px;
        position: relative;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :host([hidden]) {
        display: none;
    }

    ::slotted(.slide) {
        max-width: 100%;
        max-height: 100%;
    }

    .previous-flipper {
        position: absolute;
        left: 20px;
    }

    .next-flipper {
        position: absolute;
        right: 20px;
    }

    .slide-tabs {
        position: absolute;
        bottom: 40px;
    }

    .slide-tab {
        display: inline-block;
        padding: 4px;
        border: none;
    }

    .slide-tab::before {
        width: 32px;
        border: 1px solid transparent;
        opacity: 0.45;
        content: "";
        display: block;
        transition: all 0.05s ease-in-out;
        border-radius: 40px;
        height: 4px;
        background-color: #101010;
    }
`.withBehaviors(
    accentFillRestBehavior,
    neutralDividerRestBehavior,
    neutralForegroundRestBehavior
);
