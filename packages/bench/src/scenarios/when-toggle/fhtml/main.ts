import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class WhenToggleElement extends FASTElement {
    show = true;

    connectedCallback(): void {
        super.connectedCallback();
        // Toggle a few times to exercise when's swap logic.
        this.show = false;
        this.show = true;
        this.show = false;
    }
}

WhenToggleElement.defineAsync({
    name: "bench-when-toggle",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-when-toggle");
runBenchmark(() => document.createElement("bench-when-toggle"));
