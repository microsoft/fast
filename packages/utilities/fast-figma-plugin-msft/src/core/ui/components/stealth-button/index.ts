import { css, customElement, FastElement, html } from "@microsoft/fast-element";
import { designSystemConsumer } from "@microsoft/fast-components/dist/design-system-consumer";
import {
    accentForegroundCutRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
} from "@microsoft/fast-components/dist/styles/recipes";

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
        border-radius: calc(var(--corner-radius) * 1px);
        background: var(--neutral-fill-stealth-rest);
        fill: var(--neutral-foreground-rest);
        outline: none;
        font-size: inherit;
    }

    button:focus {
        border-color: var(--neutral-outline-rest);
    }
    button:hover {
        background: var(--neutral-fill-stealth-hover);
    }

    button:active {
        background: var(--neutral-fill-stealth-active);
    }

    :host([aria-expanded="true"]) button {
        background: #18a0fb;
        fill: var(--accent-foreground-cut-rest);
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
@designSystemConsumer({
    recipes: [
        neutralFillStealthRest,
        neutralFillStealthHover,
        neutralFillStealthActive,
        accentForegroundCutRest,
    ],
})
export class StealthButton extends FastElement {
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
