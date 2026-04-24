import { TemplateElement } from "@microsoft/fast-element/declarative.js";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "repeat-bench-element",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        signalDone();
    },
}).define({ name: "f-template" });
