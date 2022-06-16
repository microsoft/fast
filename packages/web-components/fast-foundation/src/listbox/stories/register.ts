import type { ElementStyles } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { listboxTemplate as template } from "../../index.js";
import { ListboxElement as FoundationListboxElement } from "../listbox.element.js";

const styles = () => css`
    :host {
        background: var(--fill-color);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
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
        cursor: var(--disabled-cursor);
        opacity: var(--disabled-opacity);
        pointer-events: none;
    }

    :host([size]) {
        max-height: calc(
            (
                    var(--size) * var(--height-number) +
                        (var(--design-unit) * var(--stroke-width) * 2)
                ) * 1px
        );
        overflow-y: auto;
    }

    :host([size="0"]) {
        max-height: none;
    }
`;

export class Listbox extends FoundationListboxElement {
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
