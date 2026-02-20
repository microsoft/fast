import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class DotSyntaxElement extends FASTElement {
    user = {
        name: "Jane",
        address: {
            city: "Seattle",
            geo: { lat: 47.6, lng: -122.3 },
        },
    };

    connectedCallback(): void {
        super.connectedCallback();
        // Mutate deeply-nested properties to exercise the ObserverMap proxy.
        this.user.address.city = "Portland";
        this.user.address.geo.lat = 45.5;
        this.user.name = "Alice";
    }
}

DotSyntaxElement.defineAsync({
    name: "bench-dot-syntax",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "bench-dot-syntax": { observerMap: "all" },
}).define({ name: "f-template" });

await customElements.whenDefined("bench-dot-syntax");

runBenchmark(() => document.createElement("bench-dot-syntax"));
