import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

export const HoverCardStyles = css`
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
        padding: calc(var(--design-unit) * 4px) calc(var(--design-unit) * 5px);
        text-align: left;
    }

    fast-card:hover .hoverCard_footer__hoverVisible {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .hoverCard_footer__hoverVisible {
        visibility: hidden;
    }

    fast-card:hover .hoverCard_footer__hoverVisible {
        visibility: visible;
    }

    fast-card:hover .hoverCard_divider {
        visibility: visible;
    }

    fast-card:hover .hoverCard_icon {
        visibility: visible;
    }

    .hoverCard_divider,
    .hoverCard_icon {
        visibility: hidden;
    }
`;
