import { FASTElement, html, repeat } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);

class RepeatCreateElement extends FASTElement {
    items = items;
}

RepeatCreateElement.define({
    name: "bench-repeat-create",
    template: html<RepeatCreateElement>`
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

runBenchmark(() => document.createElement("bench-repeat-create"));
