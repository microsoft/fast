import { expect } from "chai";
import { FASTAnchor, anchorTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";

const anchorName = uniqueElementName();
FASTAnchor.define({
    name: anchorName,
    template: anchorTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTAnchor>(anchorName);

    return { element, connect, disconnect };
}

describe("Anchor", () => {
    it("should set the `download` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const download: string = "foo";

        element.download = download;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("download")).to.equal(
            download
        );

        await disconnect();
    });

    it("should set the `href` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const href: string = "https://fast.design";

        element.href = href;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("href")).to.equal(
            href
        );

        await disconnect();
    });

    it("should set the `hreflang` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const hreflang: string = "en-GB";

        element.hreflang = hreflang;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("hreflang")).to.equal(
            hreflang
        );

        await disconnect();
    });

    it("should set the `ping` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const ping: string = "https://fast.design/trackingthepings";

        element.ping = ping;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("ping")).to.equal(
            ping
        );

        await disconnect();
    });

    it("should set the `referrerpolicy` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const referrerpolicy: string = "no-referrer";

        element.referrerpolicy = referrerpolicy;

        await connect();

        expect(
            element.shadowRoot?.querySelector("a")?.getAttribute("referrerpolicy")
        ).to.equal(referrerpolicy);

        await disconnect();
    });

    it("should set the `rel` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const rel: string = "external";

        element.rel = rel;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("rel")).to.equal(rel);

        await disconnect();
    });

    it("should set the `target` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const target = "_self";

        element.target = target;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("target")).to.equal(
            target
        );

        await disconnect();
    });

    it("should set the `type` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const type = "text/html";

        element.type = type;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("type")).to.equal(
            type
        );

        await disconnect();
    });

    describe("Delegates ARIA link", () => {
        it("should set the `aria-atomic` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaAtomic = "true";

            element.ariaAtomic = ariaAtomic;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-atomic")
            ).to.equal(ariaAtomic);

            await disconnect();
        });

        it("should set the `aria-busy` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaBusy = "false";

            element.ariaBusy = ariaBusy;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-busy")
            ).to.equal(ariaBusy);

            await disconnect();
        });

        it("should set the `aria-controls` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaControls = "testId";

            element.ariaControls = ariaControls;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-controls")
            ).to.equal(ariaControls);

            await disconnect();
        });

        it("should set the `aria-current` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaCurrent = "page";

            element.ariaCurrent = ariaCurrent;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-current")
            ).to.equal(ariaCurrent);

            await disconnect();
        });

        it("should set the `aria-describedby` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDescribedby = "testId";

            element.ariaDescribedby = ariaDescribedby;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-describedby")
            ).to.equal(ariaDescribedby);

            await disconnect();
        });

        it("should set the `aria-details` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDetails = "testId";

            element.ariaDetails = ariaDetails;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-details")
            ).to.equal(ariaDetails);

            await disconnect();
        });

        it("should set the `aria-disabled` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDisabled = "true";

            element.ariaDisabled = ariaDisabled;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-disabled")
            ).to.equal(ariaDisabled);

            await disconnect();
        });

        it("should set the `aria-errormessage` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaErrormessage = "test";

            element.ariaErrormessage = ariaErrormessage;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-errormessage")
            ).to.equal(ariaErrormessage);

            await disconnect();
        });

        it("should set the `aria-expanded` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaExpanded = "true";

            element.ariaExpanded = ariaExpanded;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-expanded")
            ).to.equal(ariaExpanded);

            await disconnect();
        });

        it("should set the `aria-flowto` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaFlowto = "testId";

            element.ariaFlowto = ariaFlowto;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-flowto")
            ).to.equal(ariaFlowto);

            await disconnect();
        });

        it("should set the `aria-haspopup` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHaspopup = "true";

            element.ariaHaspopup = ariaHaspopup;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-haspopup")
            ).to.equal(ariaHaspopup);

            await disconnect();
        });

        it("should set the `aria-hidden` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHidden = "true";

            element.ariaHidden = ariaHidden;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-hidden")
            ).to.equal(ariaHidden);

            await disconnect();
        });

        it("should set the `aria-invalid` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaInvalid = "spelling";

            element.ariaInvalid = ariaInvalid;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-invalid")
            ).to.equal(ariaInvalid);

            await disconnect();
        });

        it("should set the `aria-keyshortcuts` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaKeyshortcuts = "F4";

            element.ariaKeyshortcuts = ariaKeyshortcuts;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-keyshortcuts")
            ).to.equal(ariaKeyshortcuts);

            await disconnect();
        });

        it("should set the `aria-label` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabel = "Foo label";

            element.ariaLabel = ariaLabel;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-label")
            ).to.equal(ariaLabel);

            await disconnect();
        });

        it("should set the `aria-labelledby` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabelledby = "testId";

            element.ariaLabelledby = ariaLabelledby;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-labelledby")
            ).to.equal(ariaLabelledby);

            await disconnect();
        });

        it("should set the `aria-live` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLive = "polite";

            element.ariaLive = ariaLive;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-live")
            ).to.equal(ariaLive);

            await disconnect();
        });

        it("should set the `aria-owns` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaOwns = "testId";

            element.ariaOwns = ariaOwns;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-owns")
            ).to.equal(ariaOwns);

            await disconnect();
        });

        it("should set the `aria-relevant` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRelevant = "removals";

            element.ariaRelevant = ariaRelevant;

            await connect();

            expect(
                element.shadowRoot?.querySelector("a")?.getAttribute("aria-relevant")
            ).to.equal(ariaRelevant);

            await disconnect();
        });

        it("should set the `aria-roledescription` attribute on the internal anchor when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRoledescription = "slide";

            element.ariaRoledescription = ariaRoledescription;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("a")
                    ?.getAttribute("aria-roledescription")
            ).to.equal(ariaRoledescription);

            await disconnect();
        });
    });
});
