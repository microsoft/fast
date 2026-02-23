import { attr, FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class AttrBindElement extends FASTElement {
    @attr value: string = "";
    @attr({ mode: "boolean" }) disabled: boolean = false;
    @attr title: string = "";
}
AttrBindElement.defineAsync({
    name: "bench-bind-attr",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

let id = 0;

await customElements.whenDefined("bench-bind-attr");

runBenchmark(() => {
    const el = document.createElement("bench-bind-attr");
    el.setAttribute("value", `val-${++id}`);
    el.setAttribute("disabled", "");
    el.setAttribute("title", `title-${id}`);
    return el;
});
