import { FASTElement, html, observable, repeat } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class RepeatMutateElement extends FASTElement {
    @observable items: string[] = Array.from({ length: 20 }, (_, i) => `Item ${i}`);

    connectedCallback(): void {
        super.connectedCallback();

        // Splice out the middle third, push new items, then reverse.
        // This exercises repeat's diffing / repositioning logic.
        this.items.splice(7, 6, "Spliced-A", "Spliced-B");
        this.items.push("Pushed-1", "Pushed-2", "Pushed-3");
        this.items.reverse();
    }
}

RepeatMutateElement.define({
    name: "bench-repeat-mutate",
    template: html<RepeatMutateElement>`
        <ul>
            ${repeat(
                x => x.items,
                html<string>`
                    <li>${x => x}</li>
                `
            )}
        </ul>
    `,
});

runBenchmark(() => document.createElement("bench-repeat-mutate"));
