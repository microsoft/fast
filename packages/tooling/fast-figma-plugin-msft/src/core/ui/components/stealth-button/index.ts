import { css, customElement, FASTElement, html } from "@microsoft/fast-element";
import {
    accentForegroundCutRestBehavior,
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
} from "@microsoft/fast-components";

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
`.withBehaviors(
    accentForegroundCutRestBehavior,
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior
);

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
