import { expect } from "chai";
import { Breadcrumb, breadcrumbTemplate as template } from "./index";
import { fixture } from "../fixture";
import { BreadcrumbItem } from "../breadcrumb-item";

const FASTBreadcrumb = Breadcrumb.compose({
    baseName: "breadcrumb",
    template
})

const FASTBreadcrumbItem = BreadcrumbItem.compose({
    baseName: "breadcrumb-item",
    template
})

async function setup() {
    const { element, connect, disconnect } = await fixture([FASTBreadcrumb(), FASTBreadcrumbItem()]);

    const item1 = document.createElement("fast-breadcrumb-item");
    const item2 = document.createElement("fast-breadcrumb-item");
    const item3 = document.createElement("fast-breadcrumb-item");

    element.appendChild(item1);
    element.appendChild(item2);
    element.appendChild(item3);

    return { element, connect, disconnect, item1, item2, item3 };
}

describe("Breadcrumb", () => {
    it("should include a `role` of `navigation`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("navigation");

        await disconnect();
    });

    it("should include a `role` of `list`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.shadowRoot?.querySelector("[role='list']")).to.not.equal(null);

        await disconnect();
    });

    it("should not render a separator on last item", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        let items: NodeListOf<BreadcrumbItem> = element.querySelectorAll("fast-breadcrumb-item");

        let lastItem: BreadcrumbItem = items[items.length - 1];

        expect(lastItem.separator).to.equal(false);

        await disconnect();
    });

    it("should set the `aria-current` on the internal, last node, anchor when `href` is passed", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        const anchor1 = document.createElement("a");
        anchor1.href = "#";

        const anchor2 = document.createElement("a");
        anchor2.href = "#";

        const anchor3 = document.createElement("a");
        anchor3.href = "#";

        item1.appendChild(anchor1);
        item2.appendChild(anchor2);
        item3.appendChild(anchor3);

        await connect();

        expect(
            element.querySelectorAll("a[href]")[2].getAttribute("aria-current")
        ).to.equal("page");

        await disconnect();
    });
});
