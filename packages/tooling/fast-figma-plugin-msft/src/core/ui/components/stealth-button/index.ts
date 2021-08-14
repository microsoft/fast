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

@customElement({
    name: "td-stealth-button",
    template,
    styles,
    shadowOptions: {
        mode: "open",
        delegatesFocus: true,
    },
})
export class StealthButton extends FASTElement {
    public glyph: HTMLSlotElement;
    public content: HTMLSlotElement;
    public connectedCallback(): void {
        if (this.hasGlyph()) {
            this.classList.add("has-glyph");
        }

        if (this.hasContent()) {
            this.classList.add("has-content");
        }
    }

    private hasGlyph(): boolean {
        return this.slotHasContent(
            (this.shadowRoot as ShadowRoot).querySelector(
                "[id='glyph']"
            ) as HTMLSlotElement
        );
    }

    private hasContent(): boolean {
        return this.slotHasContent(
            (this.shadowRoot as ShadowRoot).querySelector(
                "[id='content']"
            ) as HTMLSlotElement
        );
    }

    private slotHasContent(slot: HTMLSlotElement): boolean {
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
}
