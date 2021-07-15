var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, css, customElement, FASTElement, html } from "@microsoft/fast-element";
import {
    neutralFillStealthHover,
    neutralForegroundHint,
} from "@microsoft/fast-components";
const template = html`
    <template
        class="${x => x.orientation} ${x => (x.interactive ? "interactive" : "")} ${x =>
            x.selected ? "selected" : ""}"
        style="--radius: ${x => x.value}"
        tabindex="${x => (x.interactive ? "interactive" : null)}"
        aria-selected="${x => x.selected}"
    >
        <div class="indicator"></div>
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

    .indicator {
        width: 28px;
        height: 28px;
        position: relative;
        overflow: hidden;
    }

    .indicator::before {
        content: "";
        display: block;
        width: 200%;
        height: 200%;
        border: 4px solid black;
        border-radius: calc(var(--radius) * 3px);
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
let CornerRadius = class CornerRadius extends FASTElement {
    constructor() {
        super(...arguments);
        this.value = "0";
        this.orientation = "vertical";
        this.interactive = false;
        this.selected = false;
    }
};
__decorate([attr], CornerRadius.prototype, "value", void 0);
__decorate([attr], CornerRadius.prototype, "orientation", void 0);
__decorate([attr({ mode: "boolean" })], CornerRadius.prototype, "interactive", void 0);
__decorate([attr({ mode: "boolean" })], CornerRadius.prototype, "selected", void 0);
CornerRadius = __decorate(
    [
        customElement({
            name: "td-corner-radius",
            template,
            styles,
        }),
    ],
    CornerRadius
);
export { CornerRadius };
