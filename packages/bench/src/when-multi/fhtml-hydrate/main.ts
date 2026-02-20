import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

class WhenMultiElement extends FASTElement {
    @observable level: number = 3;

    connectedCallback(): void {
        super.connectedCallback();
        this.level = 1;
        this.level = 5;
        this.level = 2;
        this.level = 4;
    }
}

RenderableFASTElement(WhenMultiElement).defineAsync({
    name: "bench-when-multi",
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
