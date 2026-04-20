import { FASTElement } from "@microsoft/fast-element";

export class BenchElement extends FASTElement {
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
