import { attr, FASTElement, html } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class AttrBindElement extends FASTElement {
    @attr value: string = "";
    @attr({ mode: "boolean" }) disabled: boolean = false;
    @attr title: string = "";
}
AttrBindElement.define({
    name: "bench-bind-attr",
    template: html`
        <input
            type="text"
            :value="${x => x.value}"
            ?disabled="${x => x.disabled}"
            title="${x => x.title}"
        />
    `,
});

let id = 0;

runBenchmark(() => {
    const el = document.createElement("bench-bind-attr");
    el.setAttribute("value", `val-${++id}`);
    el.setAttribute("disabled", "");
    el.setAttribute("title", `title-${id}`);
    return el;
});
