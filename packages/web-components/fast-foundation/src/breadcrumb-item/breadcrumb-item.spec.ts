import { expect } from "chai";
import { BreadcrumbItem, BreadcrumbItemTemplate as template } from "./index";
import { fixture } from "../fixture";
import { customElement } from "@microsoft/fast-element";

@customElement({
    name: "fast-breadcrumb-item",
    template,
})
class FASTBreadcrumbItem extends BreadcrumbItem {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTBreadcrumbItem>(
        "fast-breadcrumb-item"
    );

    return { element, connect, disconnect };
}

describe("Breadcrumb item", () => {
    it("should render `anchor` when there is an `href`", async () => {
        const { element, connect, disconnect } = await setup();
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(element.shadowRoot?.querySelector("a")).not.to.equal(null);

        await disconnect();
    });

    it("should set the `href` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("href")).to.equal(
            hrefExample
        );

        await disconnect();
    });

    it("should NOT add an element with a class of `separator` when `showSeparator` is false", async () => {
        const { element, connect, disconnect } = await setup();

        element.showSeparator = false;

        await connect();

        expect(element.shadowRoot?.querySelector(".separator")).to.not.exist;

        await disconnect();
    });
});
