import { css, ElementStyles } from "@microsoft/fast-element";
import chevronIcon from "../../../statics/svg/chevron_down_12_regular.svg";
import { FASTSelect } from "../select.js";
import { selectTemplate } from "../select.template.js";

const styles = css`
    :host {
        display: inline-flex;
        --elevation: 14;
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        font-family: var(--body-font);
        height: calc(var(--height-number) * 1px);
        position: relative;
        user-select: none;
        min-width: 250px;
        outline: none;
        vertical-align: top;
    }

    :host(:not([aria-haspopup])) {
        --elevation: 0;
        border: 0;
        height: auto;
        min-width: 0;
    }

    .listbox {
        background: var(--fill-color);
        border: none;
        border-radius: calc(var(--control-corner-radius) * 1px);
        box-shadow: var(--elevation-shadow);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: calc(var(--design-unit) * 1px) 0;
        max-height: calc(
            (
                    var(--size, 0) * var(--height-number) +
                        (var(--design-unit) * var(--stroke-width) * 2)
                ) * 1px
        );
        overflow-y: auto;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }

    :host([size="0"]) .listbox {
        max-height: none;
    }

    .control + .listbox {
        --stroke-size: calc(var(--design-unit) * var(--stroke-width) * 2);
        max-height: calc(
            (var(--listbox-max-height) * var(--height-number) + var(--stroke-size)) * 1px
        );
    }
    :host(:not([aria-haspopup])) .listbox {
        left: auto;
        position: static;
        z-index: auto;
    }
    .listbox[hidden] {
        display: none;
    }
    .control {
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        font-size: var(--type-ramp-base-font-size);
        font-family: inherit;
        line-height: var(--type-ramp-base-line-height);
        min-height: 100%;
        padding: 0 calc(var(--design-unit) * 2.25px);
        width: 100%;
    }
    :host(:not([disabled]):hover) {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }
    :host(:focus-visible) {
        border-color: var(--focus-stroke-outer);
    }
    :host(:not([size]):not([multiple]):not([open]):focus-visible),
    :host([multiple]:focus-visible),
    :host([size]:focus-visible) {
        box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px) var(--focus-stroke-outer);
    }
    :host(:not([multiple]):not([size]):focus-visible)
        ::slotted(fast-option[aria-selected="true"]:not([disabled])) {
        box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px) inset
            var(--focus-stroke-inner);
        border-color: var(--focus-stroke-outer);
        background: var(--accent-fill-focus);
        color: var(--foreground-on-accent-focus);
    }
    :host([disabled]) {
        cursor: var(--disabled-cursor);
        opacity: var(--disabled-opacity);
    }
    :host([disabled]) .control {
        cursor: var(--disabled-cursor);
        user-select: none;
    }
    :host([disabled]:hover) {
        background: var(--neutral-fill-stealth-rest);
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
    }
    :host(:not([disabled])) .control:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--accent-fill-active);
        border-radius: calc(var(--control-corner-radius) * 1px);
    }
    :host([open][position="above"]) .listbox {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: 0;
        bottom: calc(var(--height-number) * 1px);
    }
    :host([open][position="below"]) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-top: 0;
        top: calc(var(--height-number) * 1px);
    }
    .selected-value {
        flex: 1 1 auto;
        font-family: inherit;
        min-width: calc(var(--listbox-scroll-width, 0) - (var(--design-unit) * 4) * 1px);
        overflow: hidden;
        text-align: start;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .indicator {
        flex: 0 0 auto;
        margin-inline-start: 1em;
    }
    slot[name="listbox"] {
        display: none;
        width: 100%;
    }
    :host([open]) slot[name="listbox"] {
        display: flex;
        position: absolute;
        box-shadow: var(--elevation-shadow);
    }
    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
    ::slotted([slot="start"]) {
        margin-inline-end: 11px;
    }
    ::slotted([slot="end"]) {
        margin-inline-start: 11px;
    }
    ::slotted([role="option"]),
    ::slotted(option) {
        flex: 0 0 auto;
    }
`;

export class Select extends FASTSelect {
    private computedStylesheet?: ElementStyles;

    public multipleChanged(prev: boolean | undefined, next: boolean): void {
        super.multipleChanged(prev, next);
        this.updateComputedStylesheet();
    }

    protected sizeChanged(prev: number | undefined, next: number): void {
        super.sizeChanged(prev, next);
        this.updateComputedStylesheet();
    }

    /**
     * Updates an internal stylesheet with calculated CSS custom properties.
     *
     * @internal
     */
    protected updateComputedStylesheet(): void {
        this.$fastController.removeStyles(this.computedStylesheet);

        if (this.collapsible) {
            return;
        }

        this.computedStylesheet = css`
            :host {
                --size: ${`${this.size ?? (this.multiple ? 4 : 0)}`};
            }
        `;

        this.$fastController.addStyles(this.computedStylesheet);
    }
}

Select.define({
    name: "fast-select",
    template: selectTemplate({
        indicator: chevronIcon,
    }),
    styles,
});
