import { attr, FastElement, nullableNumberConverter } from "@microsoft/fast-element";

export class BaseProgress extends FastElement {
    @attr({ converter: nullableNumberConverter })
    public value: number;

    @attr({ converter: nullableNumberConverter })
    public min: number;

    @attr({ converter: nullableNumberConverter })
    public max: number;

    @attr({ mode: "boolean" })
    public paused;
    private pausedChanged(): void {
        this.paused ? this.classList.add("paused") : this.classList.remove("paused");
    }
}
