import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";

export class BaseProgress extends FASTElement {
    @attr({ converter: nullableNumberConverter })
    public value: number;

    @attr({ converter: nullableNumberConverter })
    public min: number;

    @attr({ converter: nullableNumberConverter })
    public max: number;

    @attr({ mode: "boolean" })
    public paused;
}
