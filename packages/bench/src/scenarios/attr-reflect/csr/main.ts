import { html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "bench-element",
    template: html<BenchElement>`
        <span>${x => x.label} (${x => x.count})</span>
    `,
});

let id = 0;

runBenchmark(() => {
    const count = ++id;
    const el = document.createElement("bench-element") as BenchElement;
    el.label = `item-${count}`;
    el.count = count;
    el.active = true;
    return el;
});
