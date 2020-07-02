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
        display: inline-flex;
        align-items: center;
        justify-content: space-evenly;
        height: 100%;
        min-height: 50px;
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

    .slide-tab {
        display: inline-block;
        padding: 4px;
        margin: 4px;
        position: relative;
        border: none;
        outline: none;
        max-width: 32px;
        min-width: 10px;
    }

    .slide-tab:before {
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
        display: "inline-flex";
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
`.withBehaviors(
    accentFillRestBehavior,
    neutralDividerRestBehavior,
    neutralForegroundRestBehavior
);
