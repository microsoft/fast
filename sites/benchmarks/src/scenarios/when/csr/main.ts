import { html, when } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "bench-element",
    template: html<BenchElement>`
        ${when(
            x => x.show,
            html`
                <span>Visible</span>
            `
        )}
        ${when(
            x => !x.show,
            html`
                <span>Hidden</span>
            `
        )}
    `,
});

runBenchmark(() => document.createElement("bench-element"));
