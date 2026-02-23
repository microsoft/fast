import { FASTElement, html, observable, when } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class WhenMultiElement extends FASTElement {
    @observable level = 3;

    connectedCallback(): void {
        super.connectedCallback();
        // Cycle through all five branches to stress the when swap path.
        this.level = 1;
        this.level = 5;
        this.level = 2;
        this.level = 4;
    }
}

WhenMultiElement.define({
    name: "bench-when-multi",
    template: html<WhenMultiElement>`
        ${when(
            x => x.level === 1,
            html`
                <div>Branch 1 — low</div>
            `
        )}
        ${when(
            x => x.level === 2,
            html`
                <div>Branch 2 — mid-low</div>
            `
        )}
        ${when(
            x => x.level === 3,
            html`
                <div>Branch 3 — mid</div>
            `
        )}
        ${when(
            x => x.level === 4,
            html`
                <div>Branch 4 — mid-high</div>
            `
        )}
        ${when(
            x => x.level === 5,
            html`
                <div>Branch 5 — high</div>
            `
        )}
    `,
});

runBenchmark(() => document.createElement("bench-when-multi"));
