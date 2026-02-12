import {
    attr,
    FASTElement,
    html,
    nullableNumberConverter,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { runBenchmark } from "../harness.js";

export class TestRepeat extends FASTElement {
    @attr({
        mode: "fromView",
        converter: nullableNumberConverter,
    })
    count: number;
    countChanged(prev: number, next: number): void {
        this.items = new Array(this.count).fill("foo");
    }

    public items: string[];

    connectedCallback(): void {
        super.connectedCallback();
        this.items.shift();
    }
}
TestRepeat.define({
    name: "test-repeat",
    template: html`
        ${repeat(
            x => x.items,
            html`
                <span>${x => x}</span>
            `
        )}
    `,
});

const itemRenderer = (): HTMLElement => {
    const testRepeat = document.createElement("test-repeat");
    testRepeat.setAttribute("count", "100");
    return testRepeat;
};

runBenchmark(itemRenderer);
