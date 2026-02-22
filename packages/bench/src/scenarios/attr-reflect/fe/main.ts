import { attr, FASTElement, html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class AttrElement extends FASTElement {
    @attr label: string = "";
    @attr count: string = "0";
    @attr({ mode: "boolean" }) active: boolean = false;
}
AttrElement.define({
    name: "bench-attr",
    template: html`
        <span>${x => x.label} (${x => x.count})</span>
    `,
});

let id = 0;

runBenchmark(() => {
    const el = document.createElement("bench-attr");
    el.setAttribute("label", `item-${++id}`);
    el.setAttribute("count", String(id));
    el.setAttribute("active", "");
    return el;
});
