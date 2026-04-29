import assert from "node:assert/strict";
import { test } from "node:test";

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

test.describe("installDomShim", () => {
    test.beforeEach(() => {
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

    test("should assign globals on first call", async () => {
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

    test("should be idempotent when window is already defined", async () => {
        const sentinel = { __sentinel: true };
        (globalThis as any).window = sentinel;

        await loadShim();

        assert.strictEqual((globalThis as any).window, sentinel);
        assert.strictEqual((globalThis as any).document, undefined);
    });

    test("should set window to globalThis", async () => {
        await loadShim();

        assert.strictEqual((globalThis as any).window, globalThis);
    });

    test("should provide CSS.supports that returns true", async () => {
        await loadShim();

        assert.strictEqual((globalThis as any).CSS.supports("display", "flex"), true);
    });

    test("should not overwrite an existing CSS global", async () => {
        const existing = { supports: () => false };
        (globalThis as any).CSS = existing;

        await loadShim();

        assert.strictEqual((globalThis as any).CSS, existing);
    });
});

test.describe("ShimHTMLElement", () => {
    test.beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    test("should support setAttribute / getAttribute / hasAttribute", () => {
        const el = new (globalThis as any).HTMLElement();

        assert.strictEqual(el.hasAttribute("id"), false);
        assert.strictEqual(el.getAttribute("id"), null);

        el.setAttribute("id", "test");
        assert.strictEqual(el.hasAttribute("id"), true);
        assert.strictEqual(el.getAttribute("id"), "test");
    });

    test("should support removeAttribute", () => {
        const el = new (globalThis as any).HTMLElement();
        el.setAttribute("class", "foo");
        assert.strictEqual(el.hasAttribute("class"), true);

        el.removeAttribute("class");
        assert.strictEqual(el.hasAttribute("class"), false);
        assert.strictEqual(el.getAttribute("class"), null);
    });

    test("should return attributes as an array of {name, value}", () => {
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

    test("should support attachShadow with open mode", () => {
        const el = new (globalThis as any).HTMLElement();
        const sr = el.attachShadow({ mode: "open" });

        assert.ok(sr);
        assert.strictEqual(sr.host, el);
        assert.strictEqual(el.shadowRoot, sr);
    });

    test("should not expose shadowRoot for closed mode", () => {
        const el = new (globalThis as any).HTMLElement();
        el.attachShadow({ mode: "closed" });

        assert.strictEqual(el.shadowRoot, null);
    });

    test("should provide a classList stub", () => {
        const el = new (globalThis as any).HTMLElement();
        const cl = el.classList;

        assert.strictEqual(cl.contains("foo"), false);
        // Should not throw
        cl.add("foo");
        cl.remove("foo");
        cl.toggle("foo");
    });
});

test.describe("ShimCSSStyleSheet", () => {
    test.beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    test("should support insertRule", () => {
        const sheet = new (globalThis as any).CSSStyleSheet();

        const idx = sheet.insertRule(".foo { color: red }", 0);
        assert.strictEqual(idx, 0);
        assert.strictEqual(sheet.cssRules.length, 1);
        assert.strictEqual(sheet.cssRules[0].selectorText, ".foo ");
    });
});

test.describe("ShimCustomElementRegistry", () => {
    test.beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    test("should support define and get", () => {
        class MyEl {}
        (globalThis as any).customElements.define("my-el", MyEl);

        assert.strictEqual((globalThis as any).customElements.get("my-el"), MyEl);
    });

    test("should return undefined for unknown elements", () => {
        assert.strictEqual(
            (globalThis as any).customElements.get("unknown-el"),
            undefined,
        );
    });

    test("should resolve whenDefined immediately", async () => {
        const result = await (globalThis as any).customElements.whenDefined("any-el");
        assert.strictEqual(result, undefined);
    });
});

test.describe("ShimDocument", () => {
    test.beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    test("should create elements via createElement", () => {
        const el = (globalThis as any).document.createElement("div");
        assert.ok(el);
        assert.strictEqual(typeof el.setAttribute, "function");
    });

    test("should support adoptedStyleSheets", () => {
        assert.ok(Array.isArray((globalThis as any).document.adoptedStyleSheets));
    });
});

test.describe("ShimCustomEvent", () => {
    test.beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    test("should carry detail", () => {
        const evt = new (globalThis as any).CustomEvent("test", { detail: 42 });
        assert.strictEqual(evt.detail, 42);
        assert.strictEqual(evt.type, "test");
    });

    test("should default detail to null", () => {
        const evt = new (globalThis as any).CustomEvent("test");
        assert.strictEqual(evt.detail, null);
    });
});

test.describe("matchMedia", () => {
    test.beforeEach(async () => {
        teardownShim();
        const { installDomShim } = await import(
            "@microsoft/fast-test-harness/build/dom-shim.js"
        );
        installDomShim();
    });

    test("should return a MediaQueryList with matches = false", () => {
        const mql = (globalThis as any).matchMedia("(prefers-color-scheme: dark)");
        assert.strictEqual(mql.matches, false);
        // Should not throw
        mql.addEventListener("change", () => {});
        mql.removeEventListener("change", () => {});
    });
});
