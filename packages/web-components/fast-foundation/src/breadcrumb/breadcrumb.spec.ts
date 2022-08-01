import { expect } from "chai";
import { FASTBreadcrumb, breadcrumbTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTBreadcrumbItem, breadcrumbItemTemplate } from "../breadcrumb-item/index.js";
import { Updates } from "@microsoft/fast-element";

const Breadcrumb = FASTBreadcrumb.define({
    name: uniqueElementName("breadcrumb"),
    template: breadcrumbTemplate()
});

const breadcrumbItemName = uniqueElementName("breadcrumb-item");
const BreadcrumbItem = FASTBreadcrumbItem.define({
    name: breadcrumbItemName,
    template: breadcrumbItemTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture(Breadcrumb);

    const item1 = new BreadcrumbItem();
    const item2 = new BreadcrumbItem();
    const item3 = new BreadcrumbItem();

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

        let items: NodeListOf<FASTBreadcrumbItem> = element.querySelectorAll(breadcrumbItemName);

        let lastItem: FASTBreadcrumbItem = items[items.length - 1];

        expect(lastItem.separator).to.equal(false);

        await disconnect();
    });

    it("should set `aria-current` on a FASTBreadcrumbItem's internal, last anchor when `href` is passed", async () => {
        const { connect, disconnect, item3 } = await setup();

        item3.href = "#";

        await connect();

        expect(
            item3.shadowRoot?.querySelector("a")?.getAttribute("aria-current")
        ).to.equal("page");

        await disconnect();
    });

    it("should set `aria-current` on a FASTBreadcrumbItem's internal, last anchor when `href` is NOT passed", async () => {
        const { connect, disconnect, item3 } = await setup();

        await connect();

        expect(
            item3.shadowRoot?.querySelector("a")?.getAttribute("aria-current")
        ).to.equal("page");

        await disconnect();
    });

    it("should remove aria-current from any prior Breadcrumb Item children with child anchors when a new node is appended", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        item1.href = "#";
        item2.href = "#";
        item3.href = "#";

        await connect();

        expect(
            item3.shadowRoot?.querySelector("a")?.getAttribute("aria-current")
        ).to.equal("page");

        const item4 = new BreadcrumbItem();
        item4.href = "#";

        element.appendChild(item4);

        await Updates.next();

        expect(
            item3.shadowRoot?.querySelector("a")?.hasAttribute("aria-current")
        ).to.equal(false);

        expect(
            item4.shadowRoot?.querySelector("a")?.getAttribute("aria-current")
        ).to.equal("page");

        await disconnect();
    });

    it("should set `aria-current` on the last anchor child when `href` is passed", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        element.removeChild(item1);
        element.removeChild(item2);
        element.removeChild(item3);

        const anchor1 = document.createElement("a");
        const anchor2 = document.createElement("a");
        const anchor3 = document.createElement("a");
        anchor3.href = "#";

        element.appendChild(anchor1);
        element.appendChild(anchor2);
        element.appendChild(anchor3);

        await connect();

        expect(anchor3.getAttribute("aria-current")).to.equal("page");

        await disconnect();
    });

    it("should set `aria-current` on the last anchor child when `href` is NOT passed", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        element.removeChild(item1);
        element.removeChild(item2);
        element.removeChild(item3);

        const anchor1 = document.createElement("a");
        const anchor2 = document.createElement("a");
        const anchor3 = document.createElement("a");

        element.appendChild(anchor1);
        element.appendChild(anchor2);
        element.appendChild(anchor3);

        await connect();


        expect(anchor3.getAttribute("aria-current")).to.equal("page");

        await disconnect();
    });

    it("should remove aria-current from any prior child anchors when a new node is appended", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        element.removeChild(item1);
        element.removeChild(item2);
        element.removeChild(item3);

        const anchor1 = document.createElement("a");
        const anchor2 = document.createElement("a");
        const anchor3 = document.createElement("a");

        anchor1.href = "#";
        anchor2.href = "#";
        anchor3.href = "#";

        element.appendChild(anchor1);
        element.appendChild(anchor2);
        element.appendChild(anchor3);

        await connect();

        expect(
            anchor3.getAttribute("aria-current")
        ).to.equal("page");

        const anchor4 = document.createElement("a");
        anchor4.href = "#";

        element.appendChild(anchor4);

        await Updates.next();

        expect(
            anchor3.hasAttribute("aria-current")
        ).to.equal(false);

        expect(
            anchor4.getAttribute("aria-current")
        ).to.equal("page");

        await disconnect();
    });
});
