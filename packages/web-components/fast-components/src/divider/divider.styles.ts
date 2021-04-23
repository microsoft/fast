import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { designUnit, outlineWidth } from "../design-tokens";
import { neutralDividerRestBehavior } from "../styles/index";

export const dividerStyles = (context, definition) =>
    css`
        ${display("block")} :host {
            box-sizing: content-box;
            height: 0;
            margin: calc(${designUnit} * 1px) 0;
            border: none;
            border-top: calc(${outlineWidth} * 1px) solid
                ${neutralDividerRestBehavior.var};
        }
    `.withBehaviors(neutralDividerRestBehavior);
