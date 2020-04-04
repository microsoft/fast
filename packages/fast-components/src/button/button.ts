import { attr, FastElement, html, ref } from "@microsoft/fast-element";

export type ButtonAppearance =
    | "accent"
    | "lightweight"
    | "neutral"
    | "outline"
    | "stealth";

export const buttonTemplate = html<Button>`
    <button
        class="control"
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
        <span
            part="start"
            ${ref("startContainer")}
        >
            <slot
                name="start"
                ${ref("start")}
                @slotchange=${x => x.handleStartContentChange()}
            ></slot>
        </span>
        <span class="content" part="content">
            <slot></slot>
        </span>
        <span
            part="end"
            ${ref("endContainer")}
        >
            <slot
                name="end"
                ${ref("end")}
                @slotchange=${x => x.handleEndContentChange()}
            ></slot>
        </span>
    </button>
`;

export class Button extends FastElement {
    @attr
    public appearance: ButtonAppearance;
    public appearanceChanged(): void {
        if (this._currentAppearance !== this.appearance) {
            // add our appearance
            this.classList.add(`${this.appearance}`);
            // remove our current appearance
            this.classList.remove(`${this._currentAppearance}`);

            // update our internal appearance.
            this._currentAppearance = this.appearance;
        }
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

    private _currentAppearance: ButtonAppearance = "neutral";

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.appearance) {
            this._currentAppearance = this.appearance;
        }

        this.classList.add(`${this._currentAppearance}`);
    }

    public start: HTMLSlotElement;
    public startContainer: HTMLSpanElement;
    public handleStartContentChange(): void {
        this.start.assignedNodes().length > 0
            ? this.startContainer.classList.add("start")
            : this.startContainer.classList.remove("start");
    }

    public end: HTMLSlotElement;
    public endContainer: HTMLSpanElement;
    public handleEndContentChange(): void {
        this.end.assignedNodes().length > 0
            ? this.endContainer.classList.add("end")
            : this.endContainer.classList.remove("end");
    }
}
