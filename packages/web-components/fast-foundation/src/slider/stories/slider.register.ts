import { css } from "@microsoft/fast-element";
import { FASTSlider } from "../slider.js";
import { sliderTemplate } from "../slider.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-grid;
        --thumb-size: calc(var(--height-number) * 0.5 - var(--design-unit));
        --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
        --track-width: var(--design-unit);
        --fast-slider-height: calc(var(--thumb-size) * 10);
        user-select: none;
        box-sizing: border-box;
        border-radius: calc(var(--control-corner-radius) * 1px);
        outline: none;
        cursor: pointer;
    }

    .positioning-region {
        position: relative;
        display: grid;
    }

    :host([orientation="horizontal"]) .positioning-region {
        grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
    }

    :host([orientation="vertical"]) .positioning-region {
        height: 100%;
        grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
    }

    .thumb-container {
        position: absolute;
        height: calc(var(--thumb-size) * 1px);
        width: calc(var(--thumb-size) * 1px);
        transition: all 0.2s ease;
    }

    :host([orientation="horizontal"]) .thumb-container {
        transform: translateX(calc(var(--thumb-size) * 0.5px));
    }

    :host([orientation="vertical"]) .thumb-container {
        transform: translateY(calc(var(--thumb-size) * -0.5px));
    }

    .thumb {
        border: none;
        width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
    }

    .thumb:hover {
        background: var(--neutral-foreground-rest);
        border-color: var(--neutral-stroke-hover);
    }

    .thumb:active {
        background: var(--neutral-foreground-rest);
    }

    :host(:focus-visible) .thumb {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focus-stroke-outer);
    }

    .track-start {
        background: var(--accent-foreground-rest);
        position: absolute;
        height: 100%;
        left: 0;
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    .track-start {
        left: 0;
    }

    :host([orientation="horizontal"]) {
        touch-action: pan-y;
        min-width: calc(var(--thumb-size) * 1px);
        width: 100%;
    }

    :host([orientation="horizontal"]) .track {
        top: calc(((var(--thumb-size) - var(--track-width)) / 2) * 1px);
        right: 0;
        left: 0;
        height: calc(var(--track-width) * 1px);
    }

    :host([orientation="vertical"]) .track {
        left: calc(((var(--thumb-size) - var(--track-width)) / 2) * 1px);
        top: 0;
        bottom: 0;
        width: calc(var(--track-width) * 1px);
        height: 100%;
    }

    .track {
        background: var(--neutral-stroke-rest);
        position: absolute;
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :host([orientation="vertical"]) {
        height: calc(var(--fast-slider-height) * 1px);
        min-height: calc(var(--thumb-size) * 1px);
        touch-action: pan-x;
    }

    :host([orientation="vertical"]) .track-start {
        height: auto;
        width: 100%;
        bottom: 0;
    }

    :host([disabled]),
    :host([readonly]) {
        cursor: var(--disabled-cursor);
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }
`;

FASTSlider.define({
    name: "fast-slider",
    template: sliderTemplate(),
    styles,
});
