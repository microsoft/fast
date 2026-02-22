import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class EventElement extends FASTElement {
    count = 0;

    handleClick() {
        this.count++;
    }
}

EventElement.defineAsync({
    name: "bench-event",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-event");

runBenchmark(() => document.createElement("bench-event"));
