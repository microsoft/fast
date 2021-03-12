import { expect } from "chai";
import { Breadcrumb, BreadcrumbTemplate as template } from "./index";
import { fixture } from "../fixture";
import { customElement, html } from "@microsoft/fast-element";
import type { BreadcrumbItem } from "../breadcrumb-item";

@customElement({
    name: "fast-breadcrumb",
    template,
})
class FASTBreadcrumb extends Breadcrumb {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTBreadcrumb>(
        "fast-breadcrumb"
    );

    return { element, connect, disconnect };
}

describe("Breadcrumb", () => {
    it("should include a `role` of `navigation`", async () => {
        const { element, connect, disconnect } = await fixture<Breadcrumb>(
            "fast-breadcrumb"
        );

        await connect();

        expect(element.getAttribute("role")).to.equal("navigation");

        await disconnect();
    });

    it("should include a `role` of `list`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element?.shadowRoot?.querySelector("[role='list']")).to.not.equal(null);

        await disconnect();
    });

    it("should not render a separator on last item", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTBreadcrumb>`
            <fast-breadcrumb>
                <fast-breadcrumb-item>Item 1</fast-breadcrumb-item>
                <fast-breadcrumb-item>Item 2</fast-breadcrumb-item>
                <fast-breadcrumb-item>Item 3</fast-breadcrumb-item>
            </fast-breadcrumb>
        `);

        await connect();

        let items: NodeListOf<BreadcrumbItem> = element.querySelectorAll("fast-breadcrumb-item");

        let lastItem: BreadcrumbItem = items[items.length - 1];

        expect(lastItem.separator).to.equal(false);

        await disconnect();
    });

    it("should set the `aria-current` on the internal, last node, anchor when `href` is passed", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTBreadcrumb>`
            <fast-breadcrumb>
                <fast-breadcrumb-item>
                    <a href="#">Item1</a>
                </fast-breadcrumb-item>
                <fast-breadcrumb-item>
                    <a href="#">Item2</a>
                </fast-breadcrumb-item>
                <fast-breadcrumb-item>
                    <a href="#" aria-current="page">Item3</a>
                </fast-breadcrumb-item>
            </fast-breadcrumb>
        `);

        await connect();

        expect(
            element.querySelectorAll("a[href]")[2].getAttribute("aria-current")
        ).to.equal("page");

        await disconnect();
    });
});
