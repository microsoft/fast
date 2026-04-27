import { FASTElement } from "@microsoft/fast-element";
import { attr, nullableNumberConverter } from "@microsoft/fast-element/attr.js";
import { html } from "@microsoft/fast-element/html.js";
export class BenchElement extends FASTElement {
    @attr
    label?: string;

    @attr({ converter: nullableNumberConverter })
    count?: number;

    @attr({ mode: "boolean" })
    active?: boolean;
}

export const template = html<BenchElement>`
    <span>${x => x.label} (${x => x.count})</span>
`;
