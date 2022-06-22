import type { ElementStyles } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { ListboxElement as FoundationListboxElement } from "../listbox.element.js";
import { listboxTemplate as template } from "../listbox.template.js";

const styles = () => css`
    :host {
        background: var(--neutral-layer-floating);
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        box-sizing: border-box;
        display: inline-flex;
        flex-direction: column;
        padding: calc(var(--design-unit) * 1px) 0;
    }

    :host(:focus-within:not([disabled])) {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 calc((var(--focus-stroke-width) - var(--stroke-width)) * 1px)
            var(--focus-stroke-outer) inset;
    }

    :host([disabled]) ::slotted(*) {
        opacity: var(--disabled-opacity);
        cursor: not-allowed;
        pointer-events: none;
    }

    :host([size]) {
        max-height: calc(
            (
                    var(--size) * (var(--base-height-multiplier) + var(--density)) *
                        var(--design-unit) +
                        ((var(--design-unit) + var(--stroke-width)) * 2)
                ) * 1px
        );
        overflow-y: auto;
    }
`;

class Listbox extends FoundationListboxElement {
    private computedStylesheet?: ElementStyles;

    protected sizeChanged(prev: number | undefined, next: number): void {
        super.sizeChanged(prev, next);
        this.updateComputedStylesheet();
    }

    protected updateComputedStylesheet(): void {
        if (this.computedStylesheet) {
            this.$fastController.removeStyles(this.computedStylesheet);
        }

        const listboxSize = `${this.size}`;

        this.computedStylesheet = css`
            :host {
                --size: ${listboxSize};
            }
        `;

        this.$fastController.addStyles(this.computedStylesheet);
    }
}

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Listbox.compose({
            baseName: "listbox",
            baseClass: FoundationListboxElement,
            template,
            styles,
        })()
    );
