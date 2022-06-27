import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Slider, SliderOptions } from "../slider.js";
import { sliderTemplate as template } from "../slider.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-grid;
        --thumb-size: calc(var(--height-number) * 0.5 - var(--design-unit));
        --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
        --track-overhang: calc((var(--design-unit) / 2) * -1);
        --track-width: var(--design-unit);
        --fast-slider-height: calc(var(--thumb-size) * 10);
        align-items: center;
        width: 100%;
        margin: calc(var(--design-unit) * 1px) 0;
        user-select: none;
        box-sizing: border-box;
        border-radius: calc(var(--control-corner-radius) * 1px);
        outline: none;
        cursor: pointer;
    }
    :host([orientation="horizontal"]) .positioning-region {
        position: relative;
        margin: 0 8px;
        display: grid;
        grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
    }
    :host([orientation="vertical"]) .positioning-region {
        position: relative;
        margin: 0 8px;
        display: grid;
        height: 100%;
        grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
    }

    :host(:focus-visible) .thumb-cursor {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focus-stroke-outer);
    }

    .thumb-container {
        position: absolute;
        height: calc(var(--thumb-size) * 1px);
        width: calc(var(--thumb-size) * 1px);
        transition: all 0.2s ease;
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
    }
    .thumb-cursor {
        border: none;
        width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
    }
    .thumb-cursor:hover {
        background: var(--neutral-foreground-rest);
        border-color: var(--neutral-stroke-hover);
    }
    .thumb-cursor:active {
        background: var(--neutral-foreground-rest);
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
    :host([orientation="horizontal"]) .thumb-container {
        transform: translateX(calc(var(--thumb-size) * 0.5px))
            translateY(calc(var(--thumb-translate) * 1px));
    }
    :host([orientation="vertical"]) .thumb-container {
        transform: translateX(calc(var(--thumb-translate) * 1px))
            translateY(calc(var(--thumb-size) * 0.5px));
    }
    :host([orientation="horizontal"]) {
        min-width: calc(var(--thumb-size) * 1px);
    }
    :host([orientation="horizontal"]) .track {
        right: calc(var(--track-overhang) * 1px);
        left: calc(var(--track-overhang) * 1px);
        align-self: start;
        height: calc(var(--track-width) * 1px);
    }
    :host([orientation="vertical"]) .track {
        top: calc(var(--track-overhang) * 1px);
        bottom: calc(var(--track-overhang) * 1px);
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
        min-width: calc(var(--design-unit) * 20px);
    }
    :host([orientation="vertical"]) .track-start {
        height: auto;
        width: 100%;
        top: 0;
    }
    :host([disabled]),
    :host([readonly]) {
        cursor: var(--disabled-cursor);
    }
    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Slider.compose<SliderOptions>({
            baseName: "slider",
            template,
            styles,
            thumb: /* html */ `<div class="thumb-cursor"></div>`,
        })()
    );
