import { html, repeat } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "bench-element",
    template: html<BenchElement>`
        <ul>
            ${repeat(
                x => x.items,
                html<string>`
                    <li>${x => x}</li>
                `
            )}
        </ul>
    `,
});

runBenchmark(() => document.createElement("bench-element"), 100);
