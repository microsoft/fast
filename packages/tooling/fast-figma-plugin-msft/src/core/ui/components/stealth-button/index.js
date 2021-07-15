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
import {
    controlCornerRadius,
    foregroundOnAccentRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundRest,
    neutralStrokeRest,
} from "@microsoft/fast-components";
import { css, customElement, FASTElement, html } from "@microsoft/fast-element";
const template = html`
    <button>
        <slot id="glyph" name="glyph"></slot>
        <span><slot id="content"></slot></span>
    </button>
`;
const styles = css`
    :host {
        display: inline-block;
        outline: none;
    }

    :host(.has-glyph.has-content) span {
        margin-inline-start: 8px;
    }

    button {
        box-sizing: border-box;
        padding: 0 8px;
        min-width: 32px;
        height: 32px;
        border: none;
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${neutralFillStealthRest};
        fill: ${neutralForegroundRest};
        outline: none;
        font-size: inherit;
    }

    button:focus {
        border-color: ${neutralStrokeRest};
    }
    button:hover {
        background: ${neutralFillStealthHover};
    }

    button:active {
        background: ${neutralFillStealthActive};
    }

    :host([aria-expanded="true"]) button {
        background: #18a0fb;
        fill: ${foregroundOnAccentRest};
    }
`;
let StealthButton = class StealthButton extends FASTElement {
    connectedCallback() {
        if (this.hasGlyph()) {
            this.classList.add("has-glyph");
        }
        if (this.hasContent()) {
            this.classList.add("has-content");
        }
    }
    hasGlyph() {
        return this.slotHasContent(this.shadowRoot.querySelector("[id='glyph']"));
    }
    hasContent() {
        return this.slotHasContent(this.shadowRoot.querySelector("[id='content']"));
    }
    slotHasContent(slot) {
        return (
            Array.from(slot.assignedNodes()).filter(node => {
                if (
                    node.nodeType === 3 &&
                    node.nodeValue &&
                    node.nodeValue.trim().length === 0
                ) {
                    // Text node
                    return false;
                }
                return true;
            }).length !== 0
        );
    }
};
StealthButton = __decorate(
    [
        customElement({
            name: "td-stealth-button",
            template,
            styles,
            shadowOptions: {
                mode: "open",
                delegatesFocus: true,
            },
        }),
    ],
    StealthButton
);
export { StealthButton };
