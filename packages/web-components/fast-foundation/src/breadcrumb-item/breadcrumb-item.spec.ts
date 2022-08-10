import { expect } from "chai";
import { FASTBreadcrumbItem, breadcrumbItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";

const BreadcrumbItem = FASTBreadcrumbItem.define({
    name: uniqueElementName("breadcrumb-item"),
    template: breadcrumbItemTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture(BreadcrumbItem);

    return { element, connect, disconnect };
}

describe("Breadcrumb item", () => {
    it("should include a `role` of `listitem`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element?.shadowRoot?.querySelector("[role='listitem']")).to.not.equal(
            null
        );

        await disconnect();
    });

    it("should render `anchor` when `href` is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(element.shadowRoot?.querySelector("a")).not.to.equal(null);

        await disconnect();
    });

    it("should render `anchor` when `href` is not provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.shadowRoot?.querySelector("a")).not.to.equal(null);

        await disconnect();
    });

    it("should add an element with a class of `separator` when `separator` is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.separator = true;

        await connect();

        expect(element.shadowRoot?.querySelector(".separator")).to.exist;

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

    it("should set the `target` attribute on the internal anchor when `href` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        const hrefExample: string = "https://fast.design";
        const targetExample = "_blank";

        element.href = hrefExample;
        element.target = targetExample;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(element.shadowRoot?.querySelector("a")?.getAttribute("target")).to.equal(
            targetExample
        );

        await disconnect();
    });

    it("should set the `download` attribute on the internal anchor when `href` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        const download: string = "foo";
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;
        element.download = download;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(element.shadowRoot?.querySelector("a")?.getAttribute("download")).to.equal(
            download
        );

        await disconnect();
    });

    it("should set the `hreflang` attribute on the internal anchor when `href` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        const hreflang: string = "en-GB";
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;
        element.hreflang = hreflang;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(element.shadowRoot?.querySelector("a")?.getAttribute("hreflang")).to.equal(
            hreflang
        );

        await disconnect();
    });

    it("should set the `ping` attribute on the internal anchor when `href` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        const ping: string = "https://fast.design/trackingthepings";
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;
        element.ping = ping;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(element.shadowRoot?.querySelector("a")?.getAttribute("ping")).to.equal(
            ping
        );

        await disconnect();
    });

    it("should set the `referrerpolicy` attribute on the internal anchor when `href` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        const referrerpolicy: string = "no-referrer";
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;
        element.referrerpolicy = referrerpolicy;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(
            element.shadowRoot?.querySelector("a")?.getAttribute("referrerpolicy")
        ).to.equal(referrerpolicy);

        await disconnect();
    });

    it("should set the `rel` attribute on the internal anchor when `href` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        const rel: string = "external";
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;
        element.rel = rel;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(element.shadowRoot?.querySelector("a")?.getAttribute("rel")).to.equal(rel);

        await disconnect();
    });

    it("should set the `type` attribute on the internal anchor when `href` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        const type = "text/html";
        const hrefExample: string = "https://fast.design";

        element.href = hrefExample;
        element.type = type;

        await connect();

        expect(element.href).to.equal(hrefExample);
        expect(element.shadowRoot?.querySelector("a")?.getAttribute("type")).to.equal(
            type
        );

        await disconnect();
    });

    describe("Delegates ARIA link", () => {
        it("should set the `aria-atomic` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaAtomic = "true";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaAtomic = ariaAtomic;

            expect(element.href).to.equal(hrefExample);
            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-atomic")
            ).to.equal(ariaAtomic);

            await disconnect();
        });

        it("should set the `aria-busy` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaBusy = "false";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaBusy = ariaBusy;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-busy")
            ).to.equal(ariaBusy);

            await disconnect();
        });

        it("should set the `aria-controls` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaControls = "testId";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaControls = ariaControls;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-controls")
            ).to.equal(ariaControls);

            await disconnect();
        });

        it("should set the `aria-current` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaCurrent = "page";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaCurrent = ariaCurrent;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-current")
            ).to.equal(ariaCurrent);

            await disconnect();
        });

        it("should set the `aria-describedby` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDescribedby = "testId";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaDescribedby = ariaDescribedby;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-describedby")
            ).to.equal(ariaDescribedby);

            await disconnect();
        });

        it("should set the `aria-details` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDetails = "testId";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaDetails = ariaDetails;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-details")
            ).to.equal(ariaDetails);

            await disconnect();
        });

        it("should set the `aria-disabled` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDisabled = "true";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaDisabled = ariaDisabled;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-disabled")
            ).to.equal(ariaDisabled);

            await disconnect();
        });

        it("should set the `aria-errormessage` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaErrormessage = "test";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaErrormessage = ariaErrormessage;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-errormessage")
            ).to.equal(ariaErrormessage);

            await disconnect();
        });

        it("should set the `aria-expanded` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaExpanded = "true";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaExpanded = ariaExpanded;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-expanded")
            ).to.equal(ariaExpanded);

            await disconnect();
        });

        it("should set the `aria-flowto` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaFlowto = "testId";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaFlowto = ariaFlowto;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-flowto")
            ).to.equal(ariaFlowto);

            await disconnect();
        });

        it("should set the `aria-haspopup` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHaspopup = "true";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaHaspopup = ariaHaspopup;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-haspopup")
            ).to.equal(ariaHaspopup);

            await disconnect();
        });

        it("should set the `aria-hidden` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHidden = "true";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaHidden = ariaHidden;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-hidden")
            ).to.equal(ariaHidden);

            await disconnect();
        });

        it("should set the `aria-invalid` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaInvalid = "spelling";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaInvalid = ariaInvalid;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-invalid")
            ).to.equal(ariaInvalid);

            await disconnect();
        });

        it("should set the `aria-keyshortcuts` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaKeyshortcuts = "F4";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaKeyshortcuts = ariaKeyshortcuts;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-keyshortcuts")
            ).to.equal(ariaKeyshortcuts);

            await disconnect();
        });

        it("should set the `aria-label` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabel = "Foo label";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaLabel = ariaLabel;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-label")
            ).to.equal(ariaLabel);

            await disconnect();
        });

        it("should set the `aria-labelledby` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabelledby = "testId";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaLabelledby = ariaLabelledby;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-labelledby")
            ).to.equal(ariaLabelledby);

            await disconnect();
        });

        it("should set the `aria-live` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLive = "polite";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaLive = ariaLive;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-live")
            ).to.equal(ariaLive);

            await disconnect();
        });

        it("should set the `aria-owns` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaOwns = "testId";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaOwns = ariaOwns;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-owns")
            ).to.equal(ariaOwns);

            await disconnect();
        });

        it("should set the `aria-relevant` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRelevant = "removals";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaRelevant = ariaRelevant;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-relevant")
            ).to.equal(ariaRelevant);

            await disconnect();
        });

        it("should set the `aria-roledescription` attribute on the internal anchor when `href` is passed", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRoledescription = "slide";
            const hrefExample: string = "https://fast.design";

            element.href = hrefExample;
            element.ariaRoledescription = ariaRoledescription;

            await connect();

            expect(element.href).to.equal(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector("a")
                    ?.getAttribute("aria-roledescription")
            ).to.equal(ariaRoledescription);

            await disconnect();
        });
    });
});
