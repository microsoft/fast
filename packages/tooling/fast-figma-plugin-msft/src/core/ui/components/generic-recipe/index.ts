import { attr, css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { neutralFillStealthHover, neutralForegroundHint } from "@fluentui/web-components";

const template = html<GenericRecipe>`
    <template
        class="${x => x.orientation} ${x => (x.interactive ? "interactive" : "")} ${x =>
            x.selected ? "selected" : ""}"
        tabindex="${x => (x.interactive ? "interactive" : null)}"
        aria-selected="${x => x.selected}"
    >
        <div class="icon">${x => x.icon || ""}</div>
        <slot></slot>
    </template>
`;

const styles = css`
    :host {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        text-align: center;
        color: ${neutralForegroundHint};
    }

    .icon {
        width: 28px;
        height: 28px;
        position: relative;
        overflow: hidden;
    }

    :host(.vertical) {
        flex-direction: column;
        padding: 8px;
    }

    :host(.vertical) .indicator {
        margin-bottom: 8px;
    }

    :host(.horizontal) .indicator {
        margin-inline-end: 12px;
    }

    :host(.interactive) {
        outline: none;
    }

    :host(.interactive:hover) {
        cursor: pointer;
        background: ${neutralFillStealthHover};
    }

    :host(.selected),
    :host(.selected:hover) {
        background: #daebf7;
    }
`;

@customElement({
    name: "td-generic-recipe",
    template,
    styles,
})
export class GenericRecipe extends FASTElement {
    @attr
    public value: string = "";

    @attr
    public icon?: string;

    @attr
    public orientation: "vertical" | "horizontal" = "vertical";

    @attr({ mode: "boolean" })
    public interactive: boolean = false;

    @attr({ mode: "boolean" })
    public selected: boolean = false;
}
