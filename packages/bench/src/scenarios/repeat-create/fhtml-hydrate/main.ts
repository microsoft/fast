import { FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);

class RepeatCreateElement extends FASTElement {
    items = items;
}

RenderableFASTElement(RepeatCreateElement).defineAsync({
    name: "bench-repeat-create",
    templateOptions: "defer-and-hydrate",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        performance.measure("bench", "bench-start", "bench-end");
        signalDone();
    },
}).define({ name: "f-template" });
