import { attr, FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class AttrElement extends FASTElement {
    @attr label: string = "";
    @attr count: string = "0";
    @attr({ mode: "boolean" }) active: boolean = false;
}
AttrElement.defineAsync({
    name: "bench-attr",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

let id = 0;

await customElements.whenDefined("bench-attr");

runBenchmark(() => {
    const el = document.createElement("bench-attr");
    el.setAttribute("label", `item-${++id}`);
    el.setAttribute("count", String(id));
    el.setAttribute("active", "");
    return el;
});
