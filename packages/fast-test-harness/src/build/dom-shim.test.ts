import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

// Each test needs a clean globalThis, so we tear down the shim between tests.
function teardownShim() {
    for (const key of [
        "Node",
        "Element",
        "HTMLElement",
        "Document",
        "CustomEvent",
        "CSSStyleSheet",
        "ShadowRoot",
        "CustomElementRegistry",
        "MutationObserver",
        "MediaQueryList",
        "matchMedia",
        "document",
        "customElements",
        "window",
        "CSS",
    ]) {
        delete (globalThis as any)[key];
    }
}

describe("installDomShim", () => {
    beforeEach(() => {
        teardownShim();
    });

    async function loadShim() {
        // Dynamic import so each test gets a fresh evaluation context
        // after globalThis is cleaned.
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    }

    it("should assign globals on first call", async () => {
        await loadShim();

        assert.ok((globalThis as any).window !== undefined);
        assert.ok((globalThis as any).document !== undefined);
        assert.ok((globalThis as any).customElements !== undefined);
        assert.ok((globalThis as any).Node !== undefined);
        assert.ok((globalThis as any).Element !== undefined);
        assert.ok((globalThis as any).HTMLElement !== undefined);
        assert.ok((globalThis as any).CSSStyleSheet !== undefined);
        assert.ok((globalThis as any).MutationObserver !== undefined);
        assert.ok((globalThis as any).matchMedia !== undefined);
    });

    it("should be idempotent when window is already defined", async () => {
        const sentinel = { __sentinel: true };
        (globalThis as any).window = sentinel;

        await loadShim();

        assert.strictEqual((globalThis as any).window, sentinel);
        assert.strictEqual((globalThis as any).document, undefined);
    });

    it("should set window to globalThis", async () => {
        await loadShim();

        assert.strictEqual((globalThis as any).window, globalThis);
    });

    it("should provide CSS.supports that returns true", async () => {
        await loadShim();

        assert.strictEqual((globalThis as any).CSS.supports("display", "flex"), true);
    });

    it("should not overwrite an existing CSS global", async () => {
        const existing = { supports: () => false };
        (globalThis as any).CSS = existing;

        await loadShim();

        assert.strictEqual((globalThis as any).CSS, existing);
    });
});

describe("ShimHTMLElement", () => {
    beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    it("should support setAttribute / getAttribute / hasAttribute", () => {
        const el = new (globalThis as any).HTMLElement();

        assert.strictEqual(el.hasAttribute("id"), false);
        assert.strictEqual(el.getAttribute("id"), null);

        el.setAttribute("id", "test");
        assert.strictEqual(el.hasAttribute("id"), true);
        assert.strictEqual(el.getAttribute("id"), "test");
    });

    it("should support removeAttribute", () => {
        const el = new (globalThis as any).HTMLElement();
        el.setAttribute("class", "foo");
        assert.strictEqual(el.hasAttribute("class"), true);

        el.removeAttribute("class");
        assert.strictEqual(el.hasAttribute("class"), false);
        assert.strictEqual(el.getAttribute("class"), null);
    });

    it("should return attributes as an array of {name, value}", () => {
        const el = new (globalThis as any).HTMLElement();
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", "Close");

        const attrs = el.attributes;
        assert.strictEqual(attrs.length, 2);
        assert.deepStrictEqual(attrs.map((a: any) => a.name).sort(), [
            "aria-label",
            "role",
        ]);
    });

    it("should support attachShadow with open mode", () => {
        const el = new (globalThis as any).HTMLElement();
        const sr = el.attachShadow({ mode: "open" });

        assert.ok(sr);
        assert.strictEqual(sr.host, el);
        assert.strictEqual(el.shadowRoot, sr);
    });

    it("should not expose shadowRoot for closed mode", () => {
        const el = new (globalThis as any).HTMLElement();
        el.attachShadow({ mode: "closed" });

        assert.strictEqual(el.shadowRoot, null);
    });

    it("should provide a classList stub", () => {
        const el = new (globalThis as any).HTMLElement();
        const cl = el.classList;

        assert.strictEqual(cl.contains("foo"), false);
        // Should not throw
        cl.add("foo");
        cl.remove("foo");
        cl.toggle("foo");
    });
});

describe("ShimCSSStyleSheet", () => {
    beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    it("should support insertRule", () => {
        const sheet = new (globalThis as any).CSSStyleSheet();

        const idx = sheet.insertRule(".foo { color: red }", 0);
        assert.strictEqual(idx, 0);
        assert.strictEqual(sheet.cssRules.length, 1);
        assert.strictEqual(sheet.cssRules[0].selectorText, ".foo ");
    });
});

describe("ShimCustomElementRegistry", () => {
    beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    it("should support define and get", () => {
        class MyEl {}
        (globalThis as any).customElements.define("my-el", MyEl);

        assert.strictEqual((globalThis as any).customElements.get("my-el"), MyEl);
    });

    it("should return undefined for unknown elements", () => {
        assert.strictEqual(
            (globalThis as any).customElements.get("unknown-el"),
            undefined,
        );
    });

    it("should resolve whenDefined immediately", async () => {
        const result = await (globalThis as any).customElements.whenDefined("any-el");
        assert.strictEqual(result, undefined);
    });
});

describe("ShimDocument", () => {
    beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    it("should create elements via createElement", () => {
        const el = (globalThis as any).document.createElement("div");
        assert.ok(el);
        assert.strictEqual(typeof el.setAttribute, "function");
    });

    it("should support adoptedStyleSheets", () => {
        assert.ok(Array.isArray((globalThis as any).document.adoptedStyleSheets));
    });
});

describe("ShimCustomEvent", () => {
    beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    it("should carry detail", () => {
        const evt = new (globalThis as any).CustomEvent("test", { detail: 42 });
        assert.strictEqual(evt.detail, 42);
        assert.strictEqual(evt.type, "test");
    });

    it("should default detail to null", () => {
        const evt = new (globalThis as any).CustomEvent("test");
        assert.strictEqual(evt.detail, null);
    });
});

describe("matchMedia", () => {
    beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    it("should return a MediaQueryList with matches = false", () => {
        const mql = (globalThis as any).matchMedia("(prefers-color-scheme: dark)");
        assert.strictEqual(mql.matches, false);
        // Should not throw
        mql.addEventListener("change", () => {});
        mql.removeEventListener("change", () => {});
    });
});
