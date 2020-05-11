import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

export const ContentCardStyles = css`
    ${display("block")} :host {
        contain: content;
        font-family: var(--body-font);
        box-sizing: border-box;
    }

    :host([hidden]) {
        display: none;
    }

    fast-card {
        background: transparent;
        padding: 0 calc(var(--design-unit) * 5px) calc(var(--design-unit) * 3px);
        text-align: left;
    }

    fast-card:hover .contentCard_footer__hoverVisible {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .contentCard_footer__hoverVisible {
        visibility: hidden;
    }

    fast-card:hover .contentCard_footer__hoverVisible {
        visibility: visible;
    }

    fast-card:hover .contentCard_divider {
        visibility: visible;
    }

    fast-card:hover .contentCard_icon {
        visibility: visible;
    }

    .contentCard_divider {
        visibility: hidden;
    }

    fast-card .contentCard_icon {
        visibility: hidden;
        margin-top: calc(var(--design-unit) * 4px);
    }
`;
