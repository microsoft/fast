import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";

export class BenchElement extends FASTElement {
    @attr
    label?: string;

    @attr({ converter: nullableNumberConverter })
    count?: number;

    @attr({ mode: "boolean" })
    active?: boolean;
}
