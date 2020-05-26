import { css } from "@microsoft/fast-element";
import { neutralForegroundRestBehavior } from "@microsoft/fast-components";
import { display } from "@microsoft/fast-foundation";
import { siteBreakpoints } from "../../style/constants";

export const FeatureCardStyles = css`
    ${display("grid")} :host {
        contain: layout;
        grid-template-columns: 150px repeat(2, minmax(120px, 1fr));
        grid-template-areas: "header main main";
        color: inherit;
        box-sizing: border-box;
        padding: calc(var(--design-unit) * 5px);
        box-shadow: unset;
    }

    :host::before {
        content: "";
        display: block;
        background-color: currentColor;
        position: fixed;
        height: 1px;
        width: calc(100% - (var(--design-unit) * 10px));
        left: 20px;
        top: 0;
    }

    :host(:hover)::before {
        opacity: 0;
    }

    :host(:hover) ::slotted(:first-child) {
        color: var(--accent-fill-rest);
    }

    .card_heading {
        grid-area: header;
        padding-bottom: 10px;
    }

    .card_body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        grid-area: main;
    }

    ::slotted(h4) {
        font-size: var(--type-ramp-plus-2-font-size);
        margin: 0;
    }

    ::slotted(:first-child) {
        font-weight: bold;
        margin: 0 0 10px 0;
    }

    ::slotted(p) {
        margin: 0;
    }

    ::slotted(fast-anchor) {
        margin-right: 20px;
    }

    @media screen and (max-width: ${siteBreakpoints[2]}) {
        ${display("grid")} :host {
            grid-template-columns: repeat(3, minmax(50px, 1fr));
            grid-template-areas:
                "header header header"
                "main main main";
            max-width: 600px;
        }

        :host ::slotted(:first-child) {
            color: var(--accent-fill-rest);
        }

        .card_heading {
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
        }
    }
`.withBehaviors(neutralForegroundRestBehavior);
