import { attr, FastElement, observable, Observable } from "@microsoft/fast-element";

export function bool(value: string | boolean | null): boolean {
    return typeof value === "boolean" ? value : typeof value === "string";
}

/* tslint:disable:member-ordering */
export class SliderLabel extends FastElement {
    @observable
    public positionStyle: string;

    @attr
    public position: string;
    private positionChanged(): void {
        console.log("position changed:", this.position);
        this.positionStyle = `right: ${this.position}%`;
    }

    @attr
    public label: string;
    @attr({ attribute: "show-mark" })
    public showMark: string;

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {}
}
