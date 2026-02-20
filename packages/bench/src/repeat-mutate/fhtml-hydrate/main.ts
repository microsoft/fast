import { FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

interface Item {
    text: string;
}

const initialItems: Item[] = Array.from({ length: 20 }, (_, i) => ({
    text: `Item ${i}`,
}));

class RepeatMutateElement extends FASTElement {
    items: Item[] = [...initialItems];

    connectedCallback(): void {
        super.connectedCallback();

        this.items.splice(7, 6, { text: "Spliced-A" }, { text: "Spliced-B" });
        this.items.push({ text: "Pushed-1" }, { text: "Pushed-2" }, { text: "Pushed-3" });
        this.items.reverse();
    }
}

RenderableFASTElement(RepeatMutateElement).defineAsync({
    name: "bench-repeat-mutate",
    templateOptions: "defer-and-hydrate",
});

performance.mark("bench-start");

TemplateElement.options({
    "bench-repeat-mutate": { observerMap: "all" },
})
    .config({
        hydrationComplete() {
            performance.mark("bench-end");
            performance.measure("bench", "bench-start", "bench-end");
            signalDone();
        },
    })
    .define({ name: "f-template" });
