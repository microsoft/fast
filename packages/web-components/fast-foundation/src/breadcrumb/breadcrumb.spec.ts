import { expect } from "chai";
import { Breadcrumb, breadcrumbTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { BreadcrumbItem, breadcrumbItemTemplate } from "../breadcrumb-item";
import { DOM } from "@microsoft/fast-element";

const FASTBreadcrumb = Breadcrumb.compose({
    baseName: "breadcrumb",
    template
})

const FASTBreadcrumbItem = BreadcrumbItem.compose({
    baseName: "breadcrumb-item",
    breadcrumbItemTemplate
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

    it("should remove aria-current from any prior Breadcrumb Item children with hrefs when a new node is appended", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        (item1 as BreadcrumbItem).setAttribute("href", "#");
        (item2 as BreadcrumbItem).setAttribute("href", "#");
        (item3 as BreadcrumbItem).setAttribute("href", "#");

        await connect();

        expect(
            element.querySelectorAll("fast-breadcrumb-item")[2].getAttribute("aria-current")
        ).to.equal("page");

        const item4 = document.createElement("fast-breadcrumb-item");
        (item4 as BreadcrumbItem).setAttribute("href", "#");
        element.appendChild(item4);

        await DOM.nextUpdate();

        expect(
            element.querySelectorAll("fast-breadcrumb-item")[2].hasAttribute("aria-current")
        ).to.equal(false);

        expect(
            element.querySelectorAll("fast-breadcrumb-item")[3].getAttribute("aria-current")
        ).to.equal("page");

        await disconnect();
    });

    it("should remove aria-current from any prior Breadcrumb Item children with child anchors when a new node is appended", async () => {
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

        const item4 = document.createElement("fast-breadcrumb-item");
        const anchor4 = document.createElement("a");
        anchor4.href = "#";

        item4.appendChild(anchor4);
        element.appendChild(item4);

        await DOM.nextUpdate();

        expect(
            element.querySelectorAll("a[href]")[2].hasAttribute("aria-current")
        ).to.equal(false);

        expect(
            element.querySelectorAll("a[href]")[3].getAttribute("aria-current")
        ).to.equal("page");

        await disconnect();
    });
});
