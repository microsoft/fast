import { css } from "@microsoft/fast-element";
import chevronLeftIcon from "../../../statics/svg/chevron_left_16_regular.svg";
import chevronRightIcon from "../../../statics/svg/chevron_right_16_regular.svg";
import { FASTFlipper } from "../flipper.js";
import { flipperTemplate } from "../flipper.template.js";

const styles = css`
    :host {
        --size: calc(var(--height-number) * 1px);
        align-items: center;
        background: transparent;
        border: none;
        color: var(--foreground-on-accent-rest);
        display: inline-flex;
        fill: currentcolor;
        height: var(--size);
        justify-content: center;
        margin: 0;
        outline: none;
        padding: 0;
        position: relative;
        width: var(--size);
    }
    :host::before {
        background: var(--accent-fill-rest);
        border-radius: 50%;
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        bottom: 0;
        content: "";
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: all 0.1s ease-in-out;
    }

    .next,
    .previous {
        display: grid;
        height: 16px;
        position: relative;
        width: 16px;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
        cursor: var(--disabled-cursor);
        fill: currentcolor;
        color: var(--neutral-foreground-rest);
        pointer-events: none;
    }
    :host([disabled])::before,
    :host([disabled]:hover)::before,
    :host([disabled]:active)::before {
        background: var(--neutral-fill-stealth-rest);
        border-color: var(--neutral-stroke-rest);
    }
    :host(:hover) {
        color: var(--foreground-on-accent-hover);
    }
    :host(:hover)::before {
        background: var(--accent-fill-hover);
        border-color: var(--accent-fill-hover);
    }
    :host(:active) {
        color: var(--foreground-on-accent-active);
    }
    :host(:active)::before {
        background: var(--accent-fill-active);
        border-color: var(--accent-fill-active);
    }
    :host(:focus-visible) {
        outline: none;
    }
    :host(:focus-visible)::before {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 calc((var(--focus-stroke-width) - var(--stroke-width)) * 1px)
                var(--focus-stroke-outer) inset,
            0 0 0 calc((var(--focus-stroke-width) + var(--stroke-width)) * 1px)
                var(--focus-stroke-inner) inset;
    }
    :host::-moz-focus-inner {
        border: 0;
    }
`;

FASTFlipper.define({
    name: "fast-flipper",
    template: flipperTemplate({
        next: chevronRightIcon,
        previous: chevronLeftIcon,
    }),
    styles,
});
