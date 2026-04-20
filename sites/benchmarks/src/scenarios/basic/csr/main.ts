import { html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "bench-element",
    template: html`
        <slot></slot>
    `,
});

runBenchmark(() => {
    const el = document.createElement("bench-element");
    el.innerHTML = "hello";
    return el;
});
