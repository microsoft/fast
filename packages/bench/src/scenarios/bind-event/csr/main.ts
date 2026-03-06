import { html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "bench-element",
    template: html<BenchElement>`
        <button @click="${x => x.handleClick()}">Count: ${x => x.count}</button>
    `,
});

runBenchmark(() => document.createElement("bench-element"));
