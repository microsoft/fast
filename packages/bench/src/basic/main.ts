import { FASTElement, html } from "@microsoft/fast-element";
import { runBenchmark } from "../harness.js";

class TestElement extends FASTElement {}
TestElement.define({
    name: "test-element",
    template: html`
        <span>foo</span>
    `,
});

const itemRenderer = (): HTMLElement => {
    return document.createElement("test-element");
};

runBenchmark(itemRenderer);
