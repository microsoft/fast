import { TemplateElement } from "@microsoft/fast-element/declarative.js";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "dot-syntax-bench-element",
    templateOptions: "defer-and-hydrate",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        signalDone();
    },
})
    .options({
        "dot-syntax-bench-element": { observerMap: "all" },
    })
    .define({ name: "f-template" });
