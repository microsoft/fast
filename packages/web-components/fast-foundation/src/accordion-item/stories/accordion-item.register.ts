import { css } from "@microsoft/fast-element";
import { FASTAccordionItem } from "../accordion-item.js";
import { accordionItemTemplate } from "../accordion-item.template.js";

const styles = css`
    :host {
        display: flex;
        box-sizing: border-box;
        font-family: var(--body-font);
        flex-direction: column;
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-line-height);
        border-bottom: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
    }

    .region {
        display: none;
        padding: calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }

    .heading {
        display: grid;
        position: relative;
        grid-template-columns: auto 1fr auto calc(
                (var(--base-height-multiplier) + var(--density)) * var(--design-unit) *
                    1px
            );
    }

    .button {
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

    .button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
    }

    .button:focus-visible::before {
        outline: none;
        border: calc(var(--focus-stroke-width) * 1px) solid var(--focus-stroke-outer);
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :host([expanded]) .region {
        display: block;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: 4;
        pointer-events: none;
        position: relative;
    }

    slot[name="expanded-icon"],
    slot[name="collapsed-icon"] {
        fill: var(--accent-fill-rest);
    }

    slot[name="collapsed-icon"] {
        display: flex;
    }

    :host([expanded]) slot[name="collapsed-icon"] {
        display: none;
    }

    slot[name="expanded-icon"] {
        display: none;
    }

    :host([expanded]) slot[name="expanded-icon"] {
        display: flex;
    }

    .start {
        display: flex;
        align-items: center;
        padding-inline-start: calc(var(--design-unit) * 1px);
        justify-content: center;
        grid-column: 1;
        position: relative;
    }

    .end {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: 3;
        position: relative;
    }
`;

FASTAccordionItem.define({
    name: "fast-accordion-item",
    template: accordionItemTemplate(),
    styles,
});
