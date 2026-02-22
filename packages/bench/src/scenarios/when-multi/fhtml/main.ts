import { FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class WhenMultiElement extends FASTElement {
    @observable level = 3;

    connectedCallback(): void {
        super.connectedCallback();
        // Cycle through all five branches to stress the when swap path.
        this.level = 1;
        this.level = 5;
        this.level = 2;
        this.level = 4;
    }
}

WhenMultiElement.defineAsync({
    name: "bench-when-multi",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-when-multi");
runBenchmark(() => document.createElement("bench-when-multi"));
