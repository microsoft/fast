import { html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";
import { BasicElement } from "../element.js";

BasicElement.define({
    name: "basic-element",
    template: html`
        <slot></slot>
    `,
});

runBenchmark(() => {
    const el = document.createElement("basic-element");
    el.innerHTML = "hello";
    return el;
});
