import { attr, FastElement, nullableNumberConverter } from "@microsoft/fast-element";

export class BaseProgress extends FastElement {
    @attr({ converter: nullableNumberConverter })
    value: number;

    @attr({ converter: nullableNumberConverter })
    min: number;

    @attr({ converter: nullableNumberConverter })
    max: number;

    @attr({ mode: "boolean" })
    paused;
    private pausedChanged(): void {
        this.paused ? this.classList.add("paused") : this.classList.remove("paused");
    }
}
