import { FASTElement, html, observable, when } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class WhenToggleElement extends FASTElement {
    @observable show = true;

    connectedCallback(): void {
        super.connectedCallback();
        // Toggle a few times to exercise when's swap logic.
        this.show = false;
        this.show = true;
        this.show = false;
    }
}

WhenToggleElement.define({
    name: "bench-when-toggle",
    template: html<WhenToggleElement>`
        ${when(
            x => x.show,
            html`
                <span>Visible</span>
            `
        )}
        ${when(
            x => !x.show,
            html`
                <span>Hidden</span>
            `
        )}
    `,
});

runBenchmark(() => document.createElement("bench-when-toggle"));
