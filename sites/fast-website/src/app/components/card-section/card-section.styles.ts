import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const CardSectionStyles = css`
    :host {
        --flow: column;
    }

    @media screen and (max-width: 1000px) {
        :host {
            --flow: row;
        }
    }

    ${display("grid")} :host {
        grid-template-rows: repeat(4, min-content);
        grid-auto-flow: var(--flow);
    }

    :host(:hover) ::slotted(site-feature-card) {
        color: rgba(171, 171, 171, 1);
    }

    :host ::slotted(site-feature-card:hover) {
        cursor: pointer;
        color: currentColor;
        background-color: rgba(27, 27, 27, 1);
    }
`;
