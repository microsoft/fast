import { expect } from "chai";
import { Anchor, AnchorTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";

describe("A", () => {
    const name = "A";

    @customElement({
        name: "fast-anchor",
        template,
    })
    class FASTAnchor extends Anchor {}

    it("should set the `download` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect } = await fixture<FASTAnchor>("fast-anchor");
        const download: string = "foo";

        element.download = download;

        await connect();
        expect(element.shadowRoot?.querySelector("a")?.getAttribute("download")).to.equal(
            download
        );
    });

    it("should set the `href` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect } = await fixture<FASTAnchor>("fast-anchor");
        const href: string = "https://fast.design";

        element.href = href;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("href")).to.equal(
            href
        );
    });

    it("should set the `hreflang` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect } = await fixture<FASTAnchor>("fast-anchor");
        const hreflang: string = "en-GB";

        element.hreflang = hreflang;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("hreflang")).to.equal(
            hreflang
        );
    });

    it("should set the `ping` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect } = await fixture<FASTAnchor>("fast-anchor");
        const ping: string = "https://fast.design/trackingthepings";

        element.ping = ping;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("ping")).to.equal(
            ping
        );
    });

    it("should set the `referrerpolicy` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect } = await fixture<FASTAnchor>("fast-anchor");
        const referrerpolicy: string = "no-referrer";

        element.referrerpolicy = referrerpolicy;

        await connect();

        expect(
            element.shadowRoot?.querySelector("a")?.getAttribute("referrerpolicy")
        ).to.equal(referrerpolicy);
    });

    it("should set the `rel` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect } = await fixture<FASTAnchor>("fast-anchor");
        const rel: string = "external";

        element.rel = rel;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("rel")).to.equal(rel);
    });

    it("should set the `target` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect } = await fixture<FASTAnchor>("fast-anchor");
        const target = "_self";

        element.target = target;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("target")).to.equal(
            target
        );
    });

    it("should set the `type` attribute on the internal anchor equal to the value provided", async () => {
        const { element, connect } = await fixture<FASTAnchor>("fast-anchor");
        const type = "text/html";

        element.type = type;

        await connect();

        expect(element.shadowRoot?.querySelector("a")?.getAttribute("type")).to.equal(
            type
        );
    });
});
