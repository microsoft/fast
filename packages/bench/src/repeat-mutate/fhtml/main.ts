import { FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

interface Item {
    text: string;
}

const initialItems: Item[] = Array.from({ length: 20 }, (_, i) => ({
    text: `Item ${i}`,
}));

class RepeatMutateElement extends FASTElement {
    @observable items: Item[] = [...initialItems];

    connectedCallback(): void {
        super.connectedCallback();

        // Splice out the middle third, push new items, then reverse.
        // This exercises repeat's diffing / repositioning logic.
        // FIXME: In-place mutations (splice, push, reverse) on @observable arrays
        // are not detected by FAST's repeat directive. We must clone the array and
        // reassign so the @observable setter fires. This is a bug/limitation in
        // fast-element's observable system.
        const items = this.items.slice();
        items.splice(7, 6, { text: "Spliced-A" }, { text: "Spliced-B" });
        items.push({ text: "Pushed-1" }, { text: "Pushed-2" }, { text: "Pushed-3" });
        items.reverse();
        this.items = items;
    }
}

RepeatMutateElement.defineAsync({
    name: "bench-repeat-mutate",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-repeat-mutate");

runBenchmark(() => document.createElement("bench-repeat-mutate"));
