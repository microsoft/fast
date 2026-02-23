import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

class WhenToggleElement extends FASTElement {
    @observable show: boolean = true;

    connectedCallback(): void {
        super.connectedCallback();
        this.show = false;
        this.show = true;
        this.show = false;
    }
}

RenderableFASTElement(WhenToggleElement).defineAsync({
    name: "bench-when-toggle",
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
