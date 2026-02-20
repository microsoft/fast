import { attr, FASTElement, html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class EventElement extends FASTElement {
    @attr count: string = "0";

    handleClick = () => {
        this.count = String(parseInt(this.count, 10) + 1);
    };
}
EventElement.define({
    name: "bench-event",
    template: html`
        <button @click="${x => x.handleClick()}">Count: ${x => x.count}</button>
    `,
});

runBenchmark(() => document.createElement("bench-event"));
