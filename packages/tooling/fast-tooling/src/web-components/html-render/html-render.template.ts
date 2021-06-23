import { html, slotted } from "@microsoft/fast-element";
import { HTMLRender } from "./html-render";

export const HTMLRenderTemplate = html<HTMLRender>`
    <div
        class="container"
        @click="${(x, c) => x.containerClickHandler(c.event as MouseEvent)}"
    >
        <div
            class="html-render"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            @dblclick="${(x, c) => x.dblClickHandler(c.event as MouseEvent)}"
            @mouseover="${(x, c) => x.hoverHandler(c.event as MouseEvent)}"
            @mouseout="${(x, c) => x.blurHandler(c.event as MouseEvent)}"
            @keydown="${(x, c) => x.keyDownHandler(c.event as KeyboardEvent)}"
            @keyup="${(x, c) => x.keyUpHandler(c.event as KeyboardEvent)}"
            :innerHTML="${x => (x.markup ? x.markup.outerHTML : "")}"
            tabindex="1"
        ></div>
        <slot ${slotted("layers")}></slot>
    </div>
`;
