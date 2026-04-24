import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { html } from "@microsoft/fast-element/template.js";

export class BenchElement extends FASTElement {
    @attr count: string = "0";

    handleClick(): void {
        this.count = String(parseInt(this.count, 10) + 1);
    }
}

export const template = html<BenchElement>`
    <button @click="${x => x.handleClick()}">Count: ${x => x.count}</button>
`;
