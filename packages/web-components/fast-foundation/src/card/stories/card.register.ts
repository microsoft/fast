import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Card } from "../card.js";
import { cardTemplate as template } from "../card.template.js";

const styles = () => css`
    :host {
        background: var(--fill-color);
        border-radius: calc(var(--control-corner-radius) * 1px);
        box-shadow: 0 0 2.9px var(--ambient-shadow-color),
            0 1.6px 3.6px var(--directional-shadow-color);
        box-sizing: border-box;
        contain: content;
        display: inline-block;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Card.compose({
            baseName: "card",
            styles,
            template,
        })()
    );
