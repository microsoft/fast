import { css } from "@microsoft/fast-element";
import { neutralForegroundRestBehavior } from "@microsoft/fast-components";
import { display } from "@microsoft/fast-foundation";

export const NavigationStyles = css`
    ${display("grid")} :host {
        grid-template-columns: auto 1fr auto;
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
        width: 100%;
    }

    .nav-button {
        display: none;
    }

    .nav-button svg {
        width: 35px;
        height: 19px;
    }
`.withBehaviors(neutralForegroundRestBehavior);
