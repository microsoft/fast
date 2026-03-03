import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

RenderableFASTElement(BenchElement).defineAsync({
    name: "bench-element",
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
        "bench-element": { observerMap: "all" },
    })
    .define({ name: "f-template" });
