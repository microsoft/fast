import {
    attr,
    FASTElement,
    html,
    nullableNumberConverter,
    repeat,
} from "@microsoft/fast-element";
import { runBenchmark } from "../harness.js";

class TestRepeat extends FASTElement {
    @attr({
        mode: "fromView",
        converter: nullableNumberConverter,
    })
    count: number = 0;

    public items: Array<string> = new Array(this.count).fill("foo");

    connectedCallback(): void {
        super.connectedCallback();
        this.items.reverse();
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
