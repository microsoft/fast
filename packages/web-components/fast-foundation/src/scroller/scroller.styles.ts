import { css } from "@microsoft/fast-element";

export const ScrollerControlStyles = css`
    .scroll-area {
        position: relative;
    }

    div.scroll-view {
        overflow-x: hidden;
    }

    .scroll {
        width: 100px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
    }

    .scroll-prev {
        right: auto;
        left: 0;
    }

    .scroll:before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        background: linear-gradient(to right, var(--scroller-fade-previous), transparent);
    }

    .scroll-next:before {
        left: auto;
        right: 0;
        background: linear-gradient(to right, transparent, var(--scroller-fade-next));
    }

    .scroll-cntrl {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%);
    }

    .scroll-next .scroll-cntrl {
        left: auto;
        right: 0;
        transform: translate(50%, -50%);
    }

    .scroll.hide div {
        opacity: 0;
        pointer-events: none;
    }

    .scroll.hide:before {
        width: 0;
    }
`;

export const ScrollerStyles = css`
    :host {
        --scroller-align: middle;
        --scroller-duration: 0.5s;
        --scroller-easing: ease-out;
        display: block;
        position: relative;
    }

    .scroll-view {
        overflow-x: auto;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .scroll-content {
        white-space: nowrap;
        display: inline-block;
    }

    .scroll-content ::slotted(*) {
        display: inline-block;
        white-space: normal;
        vertical-align: var(--scroller-align);
    }

    .scroll-content {
        transform: translate3d(0, 0, 0);
        transition: transform var(--scroller-duration) var(--scroller-easing);
    }
`;
