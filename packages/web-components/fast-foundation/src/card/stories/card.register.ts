import { css } from "@microsoft/fast-element";
import { FASTCard } from "../card.js";
import { cardTemplate } from "../card.template.js";

const styles = css`
    :host {
        background: var(--fill-color);
        border-radius: calc(var(--control-corner-radius) * 1px);
        box-shadow: 0 0 2.9px var(--ambient-shadow-color),
            0 1.6px 3.6px var(--directional-shadow-color);
        box-sizing: border-box;
        display: inline-block;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
    }
`;

FASTCard.define({
    name: "fast-card",
    styles,
    template: cardTemplate(),
});
