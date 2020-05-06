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
        font-size: var(--type-ramp-minus-1-font-size);
        font-weight: 400;
        line-height: var(--type-ramp-minus-1-line-height);
        color: var(--neutral-foreground-rest);
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(neutralDividerRestBehavior, neutralForegroundRestBehavior);
