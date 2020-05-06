import { css } from "@microsoft/fast-element";
import { display } from "../styles";
import {
    neutralDividerRestBehavior,
    neutralForegroundRestBehavior,
} from "../styles/recipes";

export const AccordionStyles = css`
    ${display("flex")} :host {
        box-sizing: border-box;
        flex-direction: column;
        font-family: var(--body-font);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: var(--neutral-foreground-rest);
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(neutralDividerRestBehavior, neutralForegroundRestBehavior);
