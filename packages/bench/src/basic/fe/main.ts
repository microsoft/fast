import { FASTElement, html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class BasicElement extends FASTElement {}
BasicElement.define({
    name: "bench-basic",
    template: html`
        <span>hello</span>
    `,
});

runBenchmark(() => document.createElement("bench-basic"));
