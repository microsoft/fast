import { attr, css, customElement, FASTElement, html } from "@microsoft/fast-element";
import {
    neutralFillStealthHoverBehavior,
    neutralForegroundHintBehavior,
} from "@microsoft/fast-components";

const template = html`
    <template
        class="${x => x.orientation} ${x => x.type} ${x =>
            x.circular ? " circular" : ""} ${x =>
            x.value === "none" ? "none" : ""} ${x =>
            x.interactive ? "interactive" : ""} ${x => (x.selected ? "selected" : "")}"
        style="--swatch-value: ${x => (x.value === "none" ? "transparent" : x.value)}"
        tabindex="${x => (x.interactive ? "0" : null)}"
        role="${x => (x.interactive ? "button" : null)}"
        aria-selected="${x => x.selected}"
    >
        <div class="swatch"></div>
        <slot></slot>
    </template>
`;

const styles = css`
    :host {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        text-align: center;
        color: var(--neutral-foreground-hint);
    }

    .swatch {
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border-radius: calc(var(--corner-radius) * 2px);
        background: var(--swatch-value);
        border: 1px solid var(--swatch-border-color, #e8e8e8);
        position: relative;
    }

    .swatch:before {
        content: "";
        display: none;
        position: absolute;
        top: 6px;
        bottom: 6px;
        left: 6px;
        right: 6px;
        box-sizing: border-box;
        background: var(--background-color);
        border: 1px solid var(--swatch-border-color, #e8e8e8);
        border-radius: calc(var(--cornerRadius) * 2px);
    }

    .swatch::after {
        content: "";
        display: none;
        width: 1px;
        height: 32px;
        background: #ff3366;
        left: calc(50% - 0.5px);
        position: relative;
        transform-origin: center;
        transform: rotate(45deg);
    }

    :host(.vertical) {
        flex-direction: column;
        padding: 8px;
    }

    :host(.vertical) .swatch {
        margin-bottom: 8px;
    }

    :host(.horizontal) .swatch {
        margin-inline-end: 8px;
    }

    :host(.circular) .swatch,
    :host(.circular) .swatch::before {
        border-radius: 50%;
    }

    :host(.border) .swatch::before {
        display: block;
    }

    :host(.none) .swatch::after {
        display: block;
    }

    :host(.interactive) {
        outline: none;
    }

    :host(.interactive:hover) {
        cursor: pointer;
        background: var(--neutral-fill-stealth-hover);
    }

    :host(.selected),
    :host(.selected:hover) {
        background: #daebf7;
    }
`.withBehaviors(neutralFillStealthHoverBehavior, neutralForegroundHintBehavior);

export enum SwatchTypes {
    background = "background",
    border = "border",
}

@customElement({
    name: "td-swatch",
    template,
    styles,
})
export class Swatch extends FASTElement {
    @attr
    public type: SwatchTypes = SwatchTypes.background;

    @attr({ mode: "boolean" })
    public circular: boolean = false;

    @attr
    public value: string | "none" = "none";

    @attr
    public orientation: "horizontal" | "vertical" = "vertical";

    @attr
    public label: string;

    @attr({ mode: "boolean" })
    public interactive: boolean = false;

    @attr({ mode: "boolean" })
    public selected: boolean = false;
}
