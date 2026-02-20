import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

class RefSlottedElement extends FASTElement {
    @observable heading!: HTMLHeadingElement;
    @observable slottedItems!: HTMLElement[];
}

RenderableFASTElement(RefSlottedElement).defineAsync({
    name: "bench-ref-slotted",
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
