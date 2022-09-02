import { css } from "@microsoft/fast-element";
import { FASTHorizontalScroll } from "../horizontal-scroll.js";
import { horizontalScrollTemplate } from "../horizontal-scroll.template.js";

const ActionsStyles = css`
    .scroll-area {
        position: relative;
    }

    div.scroll-view {
        overflow-x: hidden;
    }

    .scroll {
        position: absolute;
        top: 0;
        bottom: 0;
        user-select: none;
        width: 100px;
        display: flex;
        align-items: center;
    }

    .scroll-next {
        right: 0;
    }

    .scroll.disabled {
        display: none;
    }

    .scroll::before {
        background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
        content: "";
        display: block;
        position: absolute;
        height: 100%;
        width: 100%;
        pointer-events: none;
    }

    .scroll-next.scroll::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-next));
    }

    .scroll-next {
        justify-content: flex-end;
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
