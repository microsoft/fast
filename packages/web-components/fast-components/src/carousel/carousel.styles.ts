import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentFillRestBehavior,
    neutralDividerRestBehavior,
    neutralForegroundRestBehavior,
} from "../styles/recipes";

export const CarouselStyles = css`
    ${/* TODO: ADD Focus visible*/ ""} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-font-size);
        color: var(--neutral-foreground-rest);
        display: inline-flex;
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

    :host([tabbed]) .flipper {
        opacity: 0;
    }

    :host([tabbed]:hover) .flipper {
        opacity: 1;
    }

    ::slotted(.slide) {
    }

    .flipper {
        transition: all 0.2s ease-in-out;
        position: absolute;
        z-index: 1;
    }

    .previous-flipper {
        left: 20px;
    }

    .next-flipper {
        right: 20px;
    }

    .slide-container {
    }

    .slide-tab {
        display: inline-block;
        padding: 4px;
        border-radius: 40px;
        border: none;
        outline: none;
    }

    .slide-tab:before {
        opacity: 0.5;
        width: 32px;
        border: 1px solid #bebebe;
        border-radius: 40px;
        opacity: 0.45;
        content: "";
        display: block;
        transition: all 0.05s ease-in-out;
        height: 4px;
        background-color: #101010;
    }

    .slide-tab:hover:before {
        opacity: 1;
    }

    .slide-tab[aria-selected="true"]:before {
        opacity: 1;
    }

    .play-control {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 1;
    }

    ::part(tablist) {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }

    ::part(tabpanel) {
    }

    ::part(tabpanelcontainer) {
    }
`.withBehaviors(
    accentFillRestBehavior,
    neutralDividerRestBehavior,
    neutralForegroundRestBehavior
);
