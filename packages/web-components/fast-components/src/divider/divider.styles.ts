import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { neutralDividerRestBehavior } from "../styles/index";

/**
 * Styles for the {@link @microsoft/fast-components#FASTDivider|FASTDivider} component.
 *
 * @public
 */
export const DividerStyles: ElementStyles = css`
    ${display("block")} :host {
        box-sizing: content-box;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid
            ${neutralDividerRestBehavior.var};
    }
`.withBehaviors(neutralDividerRestBehavior);
