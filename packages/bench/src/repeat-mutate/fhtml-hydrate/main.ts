import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

const initialItems = Array.from({ length: 20 }, (_, i) => `Item ${i}`);

class RepeatMutateElement extends FASTElement {
    @observable items: string[] = [...initialItems];

    connectedCallback(): void {
        super.connectedCallback();
        this.items.splice(7, 6, "Spliced-A", "Spliced-B");
        this.items.push("Pushed-1", "Pushed-2", "Pushed-3");
        this.items.reverse();
    }
}

RenderableFASTElement(RepeatMutateElement).defineAsync({
    name: "bench-repeat-mutate",
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
