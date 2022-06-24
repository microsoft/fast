import { css, ElementStyles, observable } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Select as FoundationSelect } from "../select.js";
import { selectTemplate as template } from "../select.template.js";

const styles = () => {
    const hostContext = ".listbox";
    return css`
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
            left: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        :host([size="0"]) .listbox {
            max-height: none;
        }

        .control + .listbox {
            --stroke-size: calc(var(--design-unit) * var(--stroke-width) * 2);
            max-height: calc(
                (var(--listbox-max-height) * var(--height-number) + var(--stroke-size)) *
                    1px
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
            box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px)
                var(--focus-stroke-outer);
        }
        :host(:not([multiple]):not([size]):focus-visible)
            ::slotted(fast-option}[aria-selected="true"]:not([disabled])) {
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
            min-width: calc(
                var(--listbox-scroll-width, 0) - (var(--design-unit) * 4) * 1px
            );
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
        .end {
            margin-inline-start: auto;
        }
        .start,
        .end,
        .indicator,
        .select-indicator,
        ::slotted(svg) {
            fill: currentcolor;
            height: 1em;
            min-height: calc(var(--design-unit) * 4px);
            min-width: calc(var(--design-unit) * 4px);
            width: 1em;
        }
        ::slotted([role="option"]),
        ::slotted(option) {
            flex: 0 0 auto;
        }
    `;
};
export class Select extends FoundationSelect {
    private computedStylesheet?: ElementStyles;

    private get listboxMaxHeight(): string {
        return Math.floor(this.maxHeight / 40).toString();
    }

    @observable
    private listboxScrollWidth: string = "";

    protected listboxScrollWidthChanged(): void {
        this.updateComputedStylesheet();
    }

    private get selectSize(): string {
        return `${this.size ?? (this.multiple ? 4 : 0)}`;
    }

    public multipleChanged(prev: boolean | undefined, next: boolean): void {
        super.multipleChanged(prev, next);
        this.updateComputedStylesheet();
    }

    protected maxHeightChanged(prev: number | undefined, next: number): void {
        if (this.isConnected) {
            if (this.collapsible) {
                this.updateComputedStylesheet();
            }
        }
    }

    public setPositioning(): void {
        super.setPositioning();
        this.updateComputedStylesheet();
    }

    protected sizeChanged(prev: number | undefined, next: number): void {
        super.sizeChanged(prev, next);
        this.updateComputedStylesheet();

        if (this.collapsible) {
            requestAnimationFrame(() => {
                this.listbox.style.setProperty("display", "flex");
                this.listbox.style.setProperty("overflow", "visible");
                this.listbox.style.setProperty("visibility", "hidden");
                this.listbox.style.setProperty("width", "auto");
                this.listbox.hidden = false;

                this.listboxScrollWidth = `${this.listbox.scrollWidth}`;

                this.listbox.hidden = true;
                this.listbox.style.removeProperty("display");
                this.listbox.style.removeProperty("overflow");
                this.listbox.style.removeProperty("visibility");
                this.listbox.style.removeProperty("width");
            });

            return;
        }

        this.listboxScrollWidth = "";
    }

    /**
     * Updates an internal stylesheet with calculated CSS custom properties.
     *
     * @internal
     */
    protected updateComputedStylesheet(): void {
        if (this.computedStylesheet) {
            this.$fastController.removeStyles(this.computedStylesheet);
        }

        this.computedStylesheet = css`
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `;

        console.log(this.selectSize);

        this.$fastController.addStyles(this.computedStylesheet);
    }
}

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Select.compose({
            baseName: "select",
            baseClass: FoundationSelect,
            template,
            styles,
            indicator: /* html */ `
                <svg
                    class="select-indicator"
                    part="select-indicator"
                    viewBox="0 0 12 7"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
                    />
                </svg>
            `,
        })()
    );
