import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

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
        grid-column-gap: 20px;
    }

    :host(:hover) ::slotted(feature-card) {
        filter: blur(1px);
    }

    :host ::slotted(feature-card:hover) {
        filter: blur(0);
    }
`;
