import { expect } from "chai";
import { Breadcrumb, BreadcrumbTemplate as template } from "./index";
import { fixture } from "../fixture";
import { customElement, html } from "@microsoft/fast-element";

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

        // expect(element?.shadowRoot?.querySelector("")).to.not.equal(null);
        expect(
            element.querySelectorAll("fast-breadcrumb-item")[2].getAttribute("separator")
        ).to.equal(null);

        await disconnect();
    });
});
