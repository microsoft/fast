import { css } from "@microsoft/fast-element";
import { FASTAccordionItem } from "../accordion-item.js";
import { accordionItemTemplate } from "../accordion-item.template.js";
import { chevronUpIcon } from "../../icons.js";

const styles = css`
    :host {
        display: flex;
        box-sizing: border-box;
        font-family: var(--body-font);
        flex-direction: column;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        border-bottom: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
    }

    .panel {
        display: none;
        padding: calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }

    .heading {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .button {
        display: grid;
        align-items: center;
        position: relative;
        grid-template-columns: auto 1fr auto calc(
                (var(--base-height-multiplier) + var(--density)) * var(--design-unit) *
                    1px
            );
        appearance: none;
        border: none;
        background: none;
        grid-column: 2;
        grid-row: 1;
        outline: none;
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
        text-align: left;
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-family: inherit;
    }

    .button:hover {
        color: var(--neutral-foreground-rest);
    }

    .button:active {
        color: var(--neutral-foreground-rest);
    }

    .button:focus-visible::before {
        outline: none;
        border: calc(var(--focus-stroke-width) * 1px) solid var(--focus-stroke-outer);
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :host([expanded]) .panel {
        display: block;
    }

    .expand-collapse-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: 4;
        pointer-events: none;
        position: relative;
    }

    slot[name="expand-collapse-icon"] * {
        transition: transform 0.1s linear;
        transform: rotate(0deg);
        transform-origin: center;
    }

    :host([expanded]) slot[name="expand-collapse-icon"] * {
        transform: rotate(90deg);
    }

    ::slotted([slot="start"]) {
        display: flex;
        align-items: center;
        margin-inline-end: calc(var(--design-unit) * 1px);
        justify-content: center;
        grid-column: 1;
        position: relative;
    }

    ::slotted([slot="end"]) {
        display: flex;
        align-items: center;
        margin-inline-start: calc(var(--design-unit) * 1px);
        justify-content: center;
        grid-column: 3;
        position: relative;
    }
`;

FASTAccordionItem.define({
    name: "fast-accordion-item",
    template: accordionItemTemplate({
        expandCollapseIcon: chevronUpIcon,
    }),
    styles,
});
