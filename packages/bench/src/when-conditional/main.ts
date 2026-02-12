import { attr, FASTElement, html, when } from "@microsoft/fast-element";
import { runBenchmark } from "../harness.js";

class TestWhen extends FASTElement {
    @attr({
        mode: "boolean",
    })
    try: boolean = false;
}
TestWhen.define({
    name: "test-when",
    template: html`
        ${when(
            x => x.try,
            html`
                <span>Yes</span>
            `
        )}
        ${when(
            x => !x.try,
            html`
                <span>No</span>
            `
        )}
    `,
});

const itemRenderer = (): HTMLElement => {
    return document.createElement("test-when");
};

runBenchmark(itemRenderer);
