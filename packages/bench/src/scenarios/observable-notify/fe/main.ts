import { FASTElement, html, observable } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class ObservableNotifyElement extends FASTElement {
    @observable firstName = "Jane";
    @observable lastName = "Doe";
    @observable age = 30;

    connectedCallback(): void {
        super.connectedCallback();
        // Trigger several observable notifications to exercise the
        // subscriber notification pipeline (track → notify → update).
        this.firstName = "Alice";
        this.lastName = "Smith";
        this.age = 25;
        this.firstName = "Bob";
        this.age = 40;
    }
}

ObservableNotifyElement.define({
    name: "bench-observable-notify",
    template: html<ObservableNotifyElement>`
        <span>${x => x.firstName} ${x => x.lastName}, age ${x => x.age}</span>
    `,
});

runBenchmark(() => document.createElement("bench-observable-notify"));
