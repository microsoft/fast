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
        filter: blur(1px);
    }

    :host ::slotted(site-feature-card:hover) {
        filter: blur(0);
    }
`;
