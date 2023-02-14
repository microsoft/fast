import { css } from "@microsoft/fast-element";
import { FASTHorizontalScroll } from "../horizontal-scroll.js";
import { horizontalScrollTemplate } from "../horizontal-scroll.template.js";

const ActionsStyles = css`
    :host {
        --scroll-fade-next: var(--fill-color);
        --scroll-fade-previous: var(--fill-color);
    }

    .scroll-area {
        position: relative;
    }

    .scroll-view {
        overflow-x: hidden !important;
    }

    .scroll-next,
    .scroll-previous {
        position: absolute;
        top: 0;
        bottom: 0;
        user-select: none;
        width: 100px;
        display: flex;
        align-items: center;
    }

    .scroll-next.disabled,
    .scroll-previous.disabled {
        display: none;
    }

    .scroll-next::before,
    .scroll-previous::before {
        content: "";
        display: block;
        position: absolute;
        height: 100%;
        width: 100%;
        pointer-events: none;
    }

    .scroll-next {
        right: 0;
        justify-content: flex-end;
    }

    .scroll-next::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-next));
    }

    .scroll-previous {
        justify-content: flex-start;
    }

    .scroll-previous::before {
        background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
    }

    slot[name="previous-flipper"] *,
    ::slotted([slot="previous-flipper"]) {
        transform: translateX(-50%);
    }

    slot[name="next-flipper"] *,
    ::slotted([slot="next-flipper"]) {
        transform: translateX(50%);
    }
`;

const styles = css`
    :host {
        --scroll-align: center;
        --scroll-item-spacing: 5px;
        contain: layout;
        display: block;
        position: relative;
    }

    .scroll-view {
        overflow-x: auto;
        scrollbar-width: none;
        padding: 4px;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .content {
        align-items: var(--scroll-align);
        display: inline-flex;
        flex-wrap: nowrap;
        position: relative;
    }

    .content ::slotted(*) {
        margin-right: var(--scroll-item-spacing);
    }

    .content ::slotted(*:last-child) {
        margin-right: 0;
    }
`;

class HorizontalScroll extends FASTHorizontalScroll {
    /**
     * @public
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.view !== "mobile") {
            this.$fastController.addStyles(ActionsStyles);
        }
    }
}

HorizontalScroll.define({
    name: "fast-horizontal-scroll",
    template: horizontalScrollTemplate({
        flipper: "fast-flipper",
    }),
    styles,
});
