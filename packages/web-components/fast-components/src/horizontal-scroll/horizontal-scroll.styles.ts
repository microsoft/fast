import { css } from "@microsoft/fast-element";
import { DirectionalStyleSheetBehavior } from "@microsoft/fast-foundation";

const ltrActionsStyles = css`
    .scroll-prev {
        right: auto;
        left: 0;
    }

    .scroll-next:before {
        left: auto;
        right: 0;
        background: linear-gradient(to right, transparent, var(--scroll-fade-next));
    }

    .scroll-next .scroll-action {
        left: auto;
        right: 0;
        transform: translate(50%, -50%);
    }
`;

const rtlActionsStyles = css`
    .scroll-next {
        right: auto;
        left: 0;
    }

    .scroll-next:before {
        left: auto;
        right: 0;
        background: linear-gradient(to right, var(--scroll-fade-next), transparent);
    }

    .scroll-prev:before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-previous));
    }

    .scroll-prev .scroll-action {
        left: auto;
        right: 0;
        transform: translate(50%, -50%);
    }
`;

/**
 * Styles used for the flipper container and gradient fade
 * @public
 */
export const ActionsStyles = css`
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

    .scroll.disabled {
        display: none;
    }

    .scroll:before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
    }

    .scroll-action {
        position: absolute;
        top: 50%;
        left: 0;
        right: auto;
        transform: translate(-50%, -50%);
    }
`.withBehaviors(new DirectionalStyleSheetBehavior(ltrActionsStyles, rtlActionsStyles));

/**
 * Styles handling the scroll container and content
 * @public
 */
export const HorizontalScrollStyles = css`
    :host {
        --scroll-align: middle;
        --scroll-duration: 0.5s;
        --scroll-easing: ease-out;
        display: block;
        position: relative;
    }

    .scroll-view {
        overflow-x: auto;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .content-container {
        white-space: nowrap;
        display: inline-block;
    }

    .content-container ::slotted(*) {
        display: inline-block;
        white-space: normal;
        vertical-align: var(--scroll-align);
    }
`;
