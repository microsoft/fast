import { css } from "@microsoft/fast-element";
import { neutralForegroundRestBehavior } from "@microsoft/fast-components";
import { display } from "@microsoft/fast-foundation";

export const NavigationStyles = css`
    ${display("grid")} :host {
        grid-template-columns: auto 1fr auto;
        font-family: var(--body-font);
        color: ${neutralForegroundRestBehavior.var};
        box-sizing: border-box;
        width: 100%;
    }

    .nav-button {
        display: none;
    }

    .nav-button::part(control) {
        height: 100%;
    }

    .nav-button::part(content) {
        display: inline-block;
    }

    .nav-button svg {
        display: block;
        width: 35px;
        height: 19px;
    }
`.withBehaviors(neutralForegroundRestBehavior);
