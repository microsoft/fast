import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class RepeatMutateElement extends FASTElement {
    items: string[] = Array.from({ length: 20 }, (_, i) => `Item ${i}`);

    connectedCallback(): void {
        super.connectedCallback();

        // Splice out the middle third, push new items, then reverse.
        // This exercises repeat's diffing / repositioning logic.
        this.items.splice(7, 6, "Spliced-A", "Spliced-B");
        this.items.push("Pushed-1", "Pushed-2", "Pushed-3");
        this.items.reverse();
    }
}

RepeatMutateElement.defineAsync({
    name: "bench-repeat-mutate",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-repeat-mutate");

runBenchmark(() => document.createElement("bench-repeat-mutate"));
