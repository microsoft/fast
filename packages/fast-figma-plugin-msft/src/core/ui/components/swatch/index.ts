import {
    attr,
    css,
    customElement,
    FastElement,
    html,
    when,
} from "@microsoft/fast-element";
import { bool } from "../drawer";

const template = html`
    <template class="${x => x.orientation} ${x => x.type} ${x =>
    bool(x.circular) ? "circular" : ""} ${x =>
    x.value === "none" ? "none" : ""}" style="--swatch-value: ${x =>
    x.value === "none" ? "transparent" : x.value}">
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
        max-width: 58px;
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
`;
export enum SwatchTypes {
    background = "background",
    border = "border",
}

@customElement({
    name: "td-swatch",
    template,
    styles,
})
export class Swatch extends FastElement {
    @attr
    public type: SwatchTypes = SwatchTypes.background;

    @attr
    public circular: boolean = false;

    @attr
    public value: string | "none" = "none";

    @attr
    public orientation: "horizontal" | "vertical" = "vertical";

    @attr
    public label: string;
}
