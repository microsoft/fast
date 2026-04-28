import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define(
    {
        name: "dot-syntax-bench-element",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

await customElements.whenDefined("dot-syntax-bench-element");

runBenchmark(() => document.createElement("dot-syntax-bench-element"));
