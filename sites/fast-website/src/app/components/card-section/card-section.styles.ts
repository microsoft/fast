import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { neutralFillHoverBehavior } from "@microsoft/fast-components";

export const CardSectionStyles = css`
    :host {
        --flow: row;
    }

    ${display("grid")} :host {
        grid-template-rows: repeat(4, min-content);
        grid-auto-flow: var(--flow);
        justify-content: center;
    }

    :host(:hover) ::slotted(site-feature-card) {
        filter: saturate(0);
    }

    :host ::slotted(site-feature-card:hover),
    :host ::slotted(site-feature-card:focus-within) {
        cursor: pointer;
        color: currentColor;
        background-color: ${neutralFillHoverBehavior.var};
        filter: saturate(1);
    }

    @media screen and (min-width: 900px) {
        :host {
            --flow: column;
        }
    }
`.withBehaviors(neutralFillHoverBehavior);
