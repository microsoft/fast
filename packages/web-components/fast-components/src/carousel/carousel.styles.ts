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
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-font-size);
        color: var(--neutral-foreground-rest);
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        height: 100%;
        width: 100%;
        position: relative;
        overflow: auto;
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
        border: 1px solid #999;
        border-radius: 40px;
        border: none;
        outline: none;
    }

    .slide-tab:hover:before {
        border-color: #fff;
    }

    ${/*TODO: GET THIS TAB SELECTOR WORKING*/ ""};

    fast-tabs::part(tab) {
        color: red;
        outline: 1px dotted green;
    }

    .slide-tab:before {
        opacity: 0.5;
        width: 32px;
        border: 1px solid #bebebe;
        border-radius: 40px;
        opacity: 0.45;
        content: " ";
        display: block;
        transition: all 0.05s ease-in-out;
        height: 4px;
        background-color: #101010;
    }
`.withBehaviors(
    accentFillRestBehavior,
    neutralDividerRestBehavior,
    neutralForegroundRestBehavior
);
