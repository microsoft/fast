import { attr } from "@microsoft/fast-element/attr.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { html } from "@microsoft/fast-element/html.js";
export class BenchElement extends FASTElement {
    @attr count: string = "0";

    handleClick(): void {
        this.count = String(parseInt(this.count, 10) + 1);
    }
}

export const template = html<BenchElement>`
    <button @click="${x => x.handleClick()}">Count: ${x => x.count}</button>
`;
