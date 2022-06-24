import { css, html } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import type { HorizontalScrollOptions } from "../horizontal-scroll.js";
import { HorizontalScroll as FoundationHorizontalScroll } from "../horizontal-scroll.js";
import { horizontalScrollTemplate as template } from "../horizontal-scroll.template.js";

const ActionsStyles = css`
    .scroll-area {
        position: relative;
    }

    div.scroll-view {
        overflow-x: hidden;
    }

    .scroll {
        bottom: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        user-select: none;
        width: 100px;
    }

    .scroll.disabled {
        display: none;
    }

    .scroll::before,
    .scroll-action {
        left: 0;
        position: absolute;
    }

    .scroll::before {
        background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
        content: "";
        display: block;
        height: 100%;
        width: 100%;
    }

    .scroll-action {
        pointer-events: auto;
        right: auto;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .scroll-prev {
        right: auto;
        left: 0;
    }
    .scroll.scroll-next::before,
    .scroll-next .scroll-action {
        left: auto;
        right: 0;
    }
    .scroll.scroll-next::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-next));
    }
    .scroll-next .scroll-action {
        transform: translate(50%, -50%);
    }
`;

const styles = () => css`
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
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .content-container {
        align-items: var(--scroll-align);
        display: inline-flex;
        flex-wrap: nowrap;
        position: relative;
    }

    .content-container ::slotted(*) {
        margin-right: var(--scroll-item-spacing);
    }

    .content-container ::slotted(*:last-child) {
        margin-right: 0;
    }
`;

class HorizontalScroll extends FoundationHorizontalScroll {
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

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        HorizontalScroll.compose<HorizontalScrollOptions>({
            baseName: "horizontal-scroll",
            baseClass: FoundationHorizontalScroll,
            template,
            styles,
            nextFlipper: context => html`
                <fast-flipper
                    @click="${x => x.scrollToNext()}"
                    aria-hidden="${x => x.flippersHiddenFromAT}"
                ></fast-flipper>
            `,
            previousFlipper: context => html`
                <fast-flipper
                    @click="${x => x.scrollToPrevious()}"
                    direction="previous"
                    aria-hidden="${x => x.flippersHiddenFromAT}"
                ></fast-flipper>
            `,
        })()
    );
