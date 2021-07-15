import { html, slotted } from "@microsoft/fast-element";
export const HTMLRenderTemplate = context => {
    return html`
        <div
            class="${x => (x.interactiveMode ? "container interactive" : "container")}"
            @click="${(x, c) => x.containerClickHandler(c.event)}"
        >
            <div
                class="html-render"
                @click="${(x, c) => x.clickHandler(c.event)}"
                @dblclick="${(x, c) => x.dblClickHandler(c.event)}"
                @mouseover="${(x, c) => x.hoverHandler(c.event)}"
                @mouseout="${(x, c) => x.blurHandler(c.event)}"
                @keydown="${(x, c) => x.keyDownHandler(c.event)}"
                @keyup="${(x, c) => x.keyUpHandler(c.event)}"
                :innerHTML="${x => (x.markup ? x.markup.outerHTML : "")}"
                tabindex="1"
            ></div>
            <slot ${slotted("layers")}></slot>
        </div>
    `;
};
