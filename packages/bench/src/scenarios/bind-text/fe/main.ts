import { attr, FASTElement, html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class TextElement extends FASTElement {
    @attr label: string = "default";
}
TextElement.define({
    name: "bench-text",
    template: html`
        <span>${x => x.label}</span>
    `,
});

let id = 0;

runBenchmark(() => {
    const el = document.createElement("bench-text");
    el.setAttribute("label", `item-${++id}`);
    return el;
});
