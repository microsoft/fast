import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { neutralDividerRestBehavior } from "../styles/index";

export const DividerStyles = css`
    ${display("block")} :host {
        box-sizing: content-box;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(neutralDividerRestBehavior);
