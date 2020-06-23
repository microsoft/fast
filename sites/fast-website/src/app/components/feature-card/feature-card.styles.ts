import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const FeatureCardStyles = css`
    ${display("grid")} :host {
        contain: layout;
        grid-template-columns: 1fr repeat(2, minmax(120px, 1fr));
        grid-template-areas: "header main main";
        grid-column-gap: calc(var(--design-unit) * 3px);
        color: inherit;
        box-sizing: border-box;
        padding: calc(var(--design-unit) * 5px);
        border-radius: calc(var(--corner-radius) * 1px);
        box-shadow: unset;
        position: relative;
    }

    :host::before {
        content: "";
        display: block;
        background-color: currentColor;
        opacity: 0.5;
        position: absolute;
        height: 1px;
        width: calc(100% - (var(--design-unit) * 10px));
        left: 20px;
        top: 0;
    }

    :host(:hover)::before {
        opacity: 0;
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
        margin: 0 0 10px 0;
    }

    ::slotted(p) {
        margin: 0;
    }

    ::slotted(fast-anchor) {
        margin-right: 20px;
    }

    @media screen and (max-width: 900px) {
        ${display("grid")} :host {
            grid-template-columns: repeat(3, minmax(50px, 1fr));
            grid-template-areas:
                "header header header"
                "main main main";
            max-width: 600px;
        }
    }
`;
