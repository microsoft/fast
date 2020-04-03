import { attr, FastElement, html } from "@microsoft/fast-element";

export enum ButtonAppearance {
    accent = "accent",
    hypertext = "hypertext",
    lightweight = "lightweight",
    neutral = "neutral",
    outline = "outline",
    stealth = "stealth",
}

export const buttonTemplate = html<Button>`
    <button
        autofocus=${x => x.autofocus}
        disabled=${x => x.disabled}
        form=${x => x.form}
        formaction=${x => x.formaction}
        formenctype=${x => x.formenctype}
        formmethod=${x => x.formmethod}
        formnovalidate=${x => x.formnovalidate}
        formtarget=${x => x.formtarget}
        name=${x => x.name}
        type=${x => x.type}
        value=${x => x.value}
    >
        <slot slot="start"></slot>
        <slot></slot>
        <slot slot="end"></slot>
    </button>
`;

export class Button extends FastElement {
    @attr
    public appearance: ButtonAppearance = ButtonAppearance.neutral;
    public appearanceChanged(): void {
        this.appearance
            ? this.classList.add(`${ButtonAppearance[this.appearance]}`)
            : this.classList.remove(`${ButtonAppearance[this.appearance]}`);
    }

    @attr({ mode: "boolean" })
    public autofocus: boolean;

    @attr({ mode: "boolean" })
    public disabled: boolean;

    @attr
    public form: string;

    @attr
    public formaction: string;

    @attr
    public formenctype: string;

    @attr
    public formmethod: string;

    @attr({ mode: "boolean" })
    public formnovalidate: boolean;

    @attr
    public formtarget: "_self" | "_blank" | "_parent" | "_top";

    @attr
    public name: string;

    @attr
    public type: "submit" | "reset" | "button";

    @attr
    public value: string;
}
