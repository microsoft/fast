import { TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.defineAsync({
    name: "bench-element",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        signalDone();
    },
}).define({ name: "f-template" });
