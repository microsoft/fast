import { FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

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
        this.user.address.city = "Portland";
        this.user.address.geo.lat = 45.5;
        this.user.name = "Alice";
    }
}

RenderableFASTElement(DotSyntaxElement).defineAsync({
    name: "bench-dot-syntax",
    templateOptions: "defer-and-hydrate",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        performance.measure("bench", "bench-start", "bench-end");
        signalDone();
    },
})
    .options({
        "bench-dot-syntax": { observerMap: "all" },
    })
    .define({ name: "f-template" });
